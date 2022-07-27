import { useEffect, useState } from 'react';
import TeamMember from './components/TeamMember';
import TypeChart from './components/TypeChart';
import {
  DamageRelationsForEachType,
  DamageValues,
  DefensiveDamageValues,
  FetchedPokemonEntry,
  OffensiveDamageValues,
  Pokemon,
  PokemonDamageValues,
  Resource,
  TypeTracker,
} from './types';

const TYPES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
];

const App = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [moveNames, setMoveNames] = useState<string[]>([]);
  const [damageRelations, setDamageRelations] =
    useState<DamageRelationsForEachType>({} as DamageRelationsForEachType);
  const [team, setTeam] = useState<Pokemon[]>(
    Array.from({ length: 6 }, () => ({
      checked: false,
      damage: null,
      data: null,
      moves: Array.from({ length: 4 }, () => ({
        checked: false,
        damage: null,
        data: null,
      })),
    }))
  );
  const [damageValues, setDamageValues] = useState<DamageValues>(() => {
    let defensiveObj: DefensiveDamageValues = {};
    let offensiveObj: OffensiveDamageValues = {};
    TYPES.forEach((type) => {
      defensiveObj[type] = { type_chart: 0, popover: [1, 1, 1, 1, 1, 1] };
      offensiveObj[type] = { type_chart: 0 };
    });
    const initialState = {
      defensive: defensiveObj,
      offensive: offensiveObj,
    };
    return initialState;
  });

  useEffect(() => {
    const fetchPokemonNames = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokedex/2/');
      const result = await response.json();
      result.pokemon_entries.forEach((pokemon: FetchedPokemonEntry) =>
        setPokemonNames((prevPokemonNames) => [
          ...prevPokemonNames,
          pokemon.pokemon_species.name,
        ])
      );
    };

    const fetchMoveNames = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/move?limit=844');
      const result = await response.json();
      result.results.forEach((move: Resource) =>
        setMoveNames((prevMoveNames) => [...prevMoveNames, move.name])
      );
    };

    const fetchDamageRelations = async () => {
      const initialState: DamageRelationsForEachType = {};

      TYPES.forEach(async (type) => {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const result = await response.json();
        initialState[type] = {
          double_damage_from: result.damage_relations.double_damage_from.map(
            (type: Resource) => type.name
          ),
          half_damage_from: result.damage_relations.half_damage_from.map(
            (type: Resource) => type.name
          ),
          no_damage_from: result.damage_relations.no_damage_from.map(
            (type: Resource) => type.name
          ),
          double_damage_to: result.damage_relations.double_damage_to.map(
            (type: Resource) => type.name
          ),
        };
      });

      setDamageRelations(initialState);
    };

    Promise.all([
      fetchPokemonNames(),
      fetchMoveNames(),
      fetchDamageRelations(),
    ]).then(
      () => {
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, []);

  const calculateDefensiveDamage = (teamValue: Pokemon[]) => {
    let tempTeam = [...team];
    let tempDamageValues = { ...damageValues };
    teamValue.forEach((member, index) => {
      if (member.data && !member.checked) {
        let tempDamage: PokemonDamageValues = {};
        let typeTracker: TypeTracker = {};
        TYPES.forEach((type) => {
          typeTracker[type] = {
            decremented: false,
            incremented: false,
          };
        });
        member.data.types.forEach((type) => {
          const currDamageRelations = damageRelations[type];

          // Double damage
          currDamageRelations.double_damage_from?.forEach((damagingType) => {
            // Ensures damage value isn't duplicated for quad weak types
            if (!typeTracker[damagingType].decremented) {
              // Sets damage value in type chart
              tempDamageValues.defensive[damagingType].type_chart--;
              // Sets damage value of damaging type for each member
              tempDamage[damagingType]
                ? tempDamage[damagingType]--
                : (tempDamage[damagingType] = -1);
              typeTracker[damagingType].decremented = true;
            }
            // console.log(`The ${type.type.name}-type ${member.name} is weak to ${damagingType.name}`);
            // Sets damage value in popover
            tempDamageValues.defensive[damagingType].popover[index] *= 2;
          });
          // Half damage
          currDamageRelations.half_damage_from?.forEach((damagingType) => {
            // Ensures damage value isn't duplicated for quad resistant types
            if (!typeTracker[damagingType].incremented) {
              tempDamageValues.defensive[damagingType].type_chart++;
              tempDamage[damagingType]
                ? tempDamage[damagingType]++
                : (tempDamage[damagingType] = 1);
              typeTracker[damagingType].incremented = true;
            }
            // console.log(`The ${type.type.name}-type ${member.name} resists ${damagingType.name}`);
            tempDamageValues.defensive[damagingType].popover[index] *= 0.5;
          });
          // No damage
          currDamageRelations.no_damage_from?.forEach((damagingType) => {
            // Adds back decremented damage value because unaffected types take precedence
            const count = typeTracker[damagingType].decremented ? 2 : 1;
            for (let i = 0; i < count; i++) {
              tempDamageValues.defensive[damagingType].type_chart++;
              tempDamage[damagingType]
                ? tempDamage[damagingType]++
                : (tempDamage[damagingType] = 1);
            }
            // console.log(`The ${type.type.name}-type ${member.name} is unaffected by ${damagingType.name}`);
            tempDamageValues.defensive[damagingType].popover[index] *= 0;
          });
        });
        // Removes types with damage values of 0 since they're unnecessary
        for (const type in tempDamage) {
          if (tempDamage[type] === 0) {
            delete tempDamage[type];
          }
        }
        member.checked = true;
        member.damage = tempDamage;
      }
    });
    setDamageValues(tempDamageValues);
    setTeam(tempTeam);
  };

  const resetDefensiveDamage = (index: number) => {
    let tempTeam = [...team];
    let tempDamageValues = { ...damageValues };
    const member = tempTeam[index];

    // Reset type chart damage values
    for (const damagingType in member.damage) {
      const damageValue = member.damage[damagingType];
      if (damageValue < 0) {
        tempDamageValues.defensive[`${damagingType}`].type_chart +=
          Math.abs(damageValue);
      } else {
        tempDamageValues.defensive[`${damagingType}`].type_chart -=
          Math.abs(damageValue);
      }
    }
    // Reset popover damage values
    for (const damagingType in tempDamageValues.defensive) {
      tempDamageValues.defensive[damagingType].popover[index] = 1;
    }
    member.damage = null;
    member.checked = false;

    // Reset moves
    member.moves.forEach((move) => {
      // Reset type chart damage values
      for (const damagedType in move.damage) {
        const damageValue = move.damage[damagedType];
        if (damageValue < 0) {
          tempDamageValues.offensive[damagedType].type_chart +=
            Math.abs(damageValue);
        } else {
          tempDamageValues.offensive[damagedType].type_chart -=
            Math.abs(damageValue);
        }
      }
      move.data = null;
      move.damage = null;
      move.checked = false;
    });
    setDamageValues(tempDamageValues);
    setTeam(tempTeam);
  };

  const calculateOffensiveDamage = (teamValue: Pokemon[]) => {
    let tempDamageValues = { ...damageValues };
    teamValue.forEach((member) => {
      if (member.data) {
        member.moves.forEach((move) => {
          if (move.data && !move.checked) {
            let tempDamage: PokemonDamageValues = {};
            if (
              move.data.damage_class === 'physical' ||
              move.data.damage_class === 'special'
            ) {
              const currDamageRelations = damageRelations[move.data.type];
              currDamageRelations.double_damage_to?.forEach((damagedType) => {
                // Sets damage value in type chart
                tempDamageValues.offensive[damagedType].type_chart++;
                // Sets damage value of damaged type for each move
                tempDamage[damagedType]
                  ? tempDamage[damagedType]++
                  : (tempDamage[damagedType] = 1);
              });
            }
            move.checked = true;
            move.damage = tempDamage;
          }
        });
      }
    });
    setDamageValues(tempDamageValues);
  };

  const resetOffensiveDamage = (teamIndex: number, moveIndex: number) => {
    let tempTeam = [...team];
    let tempDamageValues = { ...damageValues };
    const member = tempTeam[teamIndex];
    let move = member.moves[moveIndex];

    // Reset type chart damage values
    for (const damagedType in move.damage) {
      const damageValue = move.damage[damagedType];
      if (damageValue < 0) {
        tempDamageValues.offensive[damagedType].type_chart +=
          Math.abs(damageValue);
      } else {
        tempDamageValues.offensive[damagedType].type_chart -=
          Math.abs(damageValue);
      }
    }
    move.damage = null;
    move.checked = false;
    setDamageValues(tempDamageValues);
    setTeam(tempTeam);
  };

  const handleTeamChange = (member: string, index: number) => {
    let temp = [...team];
    const found = pokemonNames.find((pokemon) => pokemon === member);
    if (found) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${found}`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          temp[index].data = {
            name: result.name,
            img: result.sprites.other['official-artwork'].front_default,
            types: result.types.map((type: any) => type.type.name),
            moves: result.moves.map((move: any) => move.move.name),
          };
          setTeam(temp);
          calculateDefensiveDamage(temp);
        });
    } else {
      temp[index].data = null;
      setTeam(temp);
      resetDefensiveDamage(index);
    }
  };

  const handleMoveChange = (
    move: string,
    teamIndex: number,
    moveIndex: number
  ) => {
    let temp = [...team];
    let member = temp[teamIndex];
    const found = moveNames.find((moveName) => moveName === move);
    if (found) {
      fetch(`https://pokeapi.co/api/v2/move/${found}/`)
        .then((res) => res.json())
        .then((result) => {
          member.moves[moveIndex].data = {
            name: result.name,
            type: result.type.name,
            damage_class: result.damage_class.name,
          };
          setTeam(temp);
          calculateOffensiveDamage(temp);
        });
    } else {
      member.moves[moveIndex].data = null;
      setTeam(temp);
      resetOffensiveDamage(teamIndex, moveIndex);
    }
  };

  const loadingTemplate = (
    <div className="loading-container">
      <p className="loading-text">Loading...</p>
    </div>
  );

  if (error) {
    return <div>Error: {error.message} </div>;
  } else if (!isLoaded) {
    return loadingTemplate;
  } else {
    return (
      <div>
        <h1>Pokémon Team Builder</h1>
        <ul className="team">
          {team.map((member, index) => (
            <TeamMember
              key={index}
              index={index}
              data={member.data}
              pokemonList={pokemonNames}
              onTeamChange={handleTeamChange}
              onMoveChange={handleMoveChange}
            />
          ))}
        </ul>
        <TypeChart
          name="Defensive"
          types={TYPES}
          damageValues={damageValues}
          team={team}
        />
        <TypeChart
          name="Offensive"
          types={TYPES}
          damageValues={damageValues}
          team={team}
        />
      </div>
    );
  }
};

export default App;
