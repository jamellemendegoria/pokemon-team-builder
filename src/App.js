import React, { useEffect, useState } from 'react';
import TeamMember from './components/TeamMember';
import TypeChart from './components/TypeChart';
// import {v4 as uuidv4 } from 'uuid';

const TYPES = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
  'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pokemonNames, setPokemonNames] = useState([]);
  const [moveNames, setMoveNames] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [team, setTeam] = useState(Array.from({length: 6}, () => (
    {
      data: null,
      moves: Array.from({length: 4}, () => ({data: null, damage: null, checked: false})),
      damage: null,
      checked: false
    }
  )));
  const [damageValues, setDamageValues] = useState(() => {
    let defensiveObj = {};
    let offensiveObj = {};
    TYPES.forEach(type => {
      defensiveObj[type] = {type_chart: 0, popover: [1, 1, 1, 1, 1, 1]};
      offensiveObj[type] = {type_chart: 0};
    });
    const initialState = {
      defensive: defensiveObj,
      offensive: offensiveObj
    }
    return initialState;
  });

  useEffect(() => {
    async function fetchPokemonNames() {
      let response = await fetch('https://pokeapi.co/api/v2/pokedex/2/');
      let result = await response.json();
      result.pokemon_entries.forEach(pokemon => setPokemonNames(prevPokemonNames => [...prevPokemonNames, pokemon.pokemon_species.name]));
    }

    async function fetchMoveNames() {
      let response = await fetch('https://pokeapi.co/api/v2/move?limit=844');
      let result = await response.json();
      result.results.forEach(move => setMoveNames(prevMoveNames => [...prevMoveNames, move.name]));
    }

    async function fetchTypeData() {
      let response = await fetch('https://pokeapi.co/api/v2/type');
      let result = await response.json();

      let typeURLs = [];
      // Removes unknown and shadow types because they aren't considered part of the 18 types
      result.results.filter(type => type.name !== 'unknown' && type.name !== 'shadow')
      .forEach(type => typeURLs.push(type.url));

      let values = await Promise.all(typeURLs.map(url => fetch(url)));
      let valuesResult = await Promise.all(values.map(value => value.json()));
      setTypeData(valuesResult);
    }

    Promise.all([fetchPokemonNames(), fetchMoveNames(), fetchTypeData()])
    .then(() => {
      setIsLoaded(true);
    },
    error => {
      setIsLoaded(true);
      setError(error);
    }
    );

  }, []);
  function calculateDefensiveDamage(teamValue) {
    let tempTeam = [...team];
    let tempDamageValues = {...damageValues};
    teamValue.forEach((member, index) => {
      if (member.data && !member.checked) {
        let tempDamage = {};
        let typeTracker = {};
        TYPES.forEach(type => {
          typeTracker[type] = {
            decremented: false,
            incremented: false
          };
        });
        member.data.types.forEach(type => {
          const found = typeData.find(value => value.name === type.type.name);
          if (found) {
            // Double damage
            found.damage_relations.double_damage_from.forEach(damagingType => {
              // Ensures damage value isn't duplicated for quad weak types
              if (!typeTracker[damagingType.name].decremented) {
                // Sets damage value in type chart
                tempDamageValues.defensive[damagingType.name].type_chart--;
                // Sets damage value of damaging type for each member
                tempDamage[damagingType.name] ? tempDamage[damagingType.name]-- : tempDamage[damagingType.name] = -1;
                typeTracker[damagingType.name].decremented = true;
              }
              // console.log(`The ${type.type.name}-type ${member.name} is weak to ${damagingType.name}`);
              // Sets damage value in popover
              tempDamageValues.defensive[damagingType.name].popover[index] *= 2
            });
            // Half damage
            found.damage_relations.half_damage_from.forEach(damagingType => {
              // Ensures damage value isn't duplicated for quad resistant types
              if (!typeTracker[damagingType.name].incremented) {
                tempDamageValues.defensive[damagingType.name].type_chart++;
                tempDamage[damagingType.name] ? tempDamage[damagingType.name]++ : tempDamage[damagingType.name] = 1;
                typeTracker[damagingType.name].incremented = true;
              }
              // console.log(`The ${type.type.name}-type ${member.name} resists ${damagingType.name}`);
              tempDamageValues.defensive[damagingType.name].popover[index] *= 0.5;
            });
            // No damage
            found.damage_relations.no_damage_from.forEach(damagingType => {
              // Adds back decremented damage value because unaffected types take precedence
              const count = (typeTracker[damagingType.name].decremented) ? 2 : 1;
              for (let i = 0; i < count; i++) {
                tempDamageValues.defensive[damagingType.name].type_chart++;
                tempDamage[damagingType.name] ? tempDamage[damagingType.name]++ : tempDamage[damagingType.name] = 1;
              }
              // console.log(`The ${type.type.name}-type ${member.name} is unaffected by ${damagingType.name}`);
              tempDamageValues.defensive[damagingType.name].popover[index] *= 0;
            });
          }
        });
        // Removes types with damage values of 0 since they're unnecessary
        for (const type in tempDamage) {
          if (tempDamage[type] === 0) {
            delete tempDamage[type];
          }
        };
        member.checked = true;
        member.damage = tempDamage;
      }
    });
    setDamageValues(tempDamageValues);
    setTeam(tempTeam);
  }
  function resetDefensiveDamage(index) {
    let tempTeam = [...team];
    let tempDamageValues = {...damageValues};
    const member = tempTeam[index];

    // Reset type chart damage values
    for (const damagingType in member.damage) {
      const damageValue = member.damage[damagingType];
      if (damageValue < 0) {
        tempDamageValues.defensive[`${damagingType}`].type_chart += Math.abs(damageValue);
      } else {
        tempDamageValues.defensive[`${damagingType}`].type_chart -= Math.abs(damageValue);
      }
    }
    // Reset popover damage values
    for (const damagingType in tempDamageValues.defensive) {
      tempDamageValues.defensive[damagingType].popover[index] = 1;
    }
    member.damage = null;
    member.checked = false;
  
    // Reset moves
    member.moves.forEach(move => {
      // Reset type chart damage values
      for (const damagedType in move.damage) {
        const damageValue = move.damage[damagedType];
        if (damageValue < 0) {
          tempDamageValues.offensive[damagedType].type_chart += Math.abs(damageValue);
        } else {
          tempDamageValues.offensive[damagedType].type_chart -= Math.abs(damageValue);
        }
      }
      move.data = null;
      move.damage = null;
      move.checked = false;
    })
    setDamageValues(tempDamageValues);
    setTeam(tempTeam);
  }
  function calculateOffensiveDamage(teamValue) {
    let tempDamageValues = {...damageValues};
    teamValue.forEach(member => {
      if (member.data) {
        member.moves.forEach(move => {
          if (move.data && !move.checked) {
            let tempDamage = {};
            if (move.data.damage_class.name === 'physical' || move.data.damage_class.name === 'special') {
              const found = typeData.find(value => value.name === move.data.type.name);
              if (found) {
                found.damage_relations.double_damage_to.forEach(damagedType => {
                  // Sets damage value in type chart
                  tempDamageValues.offensive[damagedType.name].type_chart++;
                  // Sets damage value of damaged type for each move
                  tempDamage[damagedType.name] ? tempDamage[damagedType.name]++ : tempDamage[damagedType.name] = 1;
                });
              }
            }
            move.checked = true;
            move.damage = tempDamage;
          }
        });
      }
    });
    setDamageValues(tempDamageValues);
  }
  function resetOffensiveDamage(teamIndex, moveIndex) {
    let tempTeam = [...team];
    let tempDamageValues = {...damageValues};
    const member = tempTeam[teamIndex];
    let move = member.moves[moveIndex];

    // Reset type chart damage values
    for (const damagedType in move.damage) {
      const damageValue = move.damage[damagedType];
      if (damageValue < 0) {
        tempDamageValues.offensive[damagedType].type_chart += Math.abs(damageValue);
      } else {
        tempDamageValues.offensive[damagedType].type_chart -= Math.abs(damageValue);
      }
    }
    move.damage = null;
    move.checked = false;
    setDamageValues(tempDamageValues);
    setTeam(tempTeam);
  }
  function handleTeamChange(member, index) {
    let temp = [...team];
    const found = pokemonNames.find(pokemon => pokemon === member);
    if (found) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${found}`)
      .then(res => res.json())
      .then(result => {
        temp[index].data = result;
        setTeam(temp);
        calculateDefensiveDamage(temp);
      });
    } else {
      temp[index].data = null;
      setTeam(temp);
      resetDefensiveDamage(index);
    }
  }
  function handleMoveChange(move, teamIndex, moveIndex) {
   let temp = [...team];
   let member = temp[teamIndex];
   const found = moveNames.find(moveName => moveName === move);
   if (found) {
     fetch(`https://pokeapi.co/api/v2/move/${found}/`)
     .then(res => res.json())
     .then(result => {
       member.moves[moveIndex].data = result;
       setTeam(temp);
       calculateOffensiveDamage(temp);
     })
   } else {
    member.moves[moveIndex].data = null;
    setTeam(temp);
    resetOffensiveDamage(teamIndex, moveIndex);
   }
  }

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
          {team.map((member, index) => 
            <TeamMember
              key={index}
              index={index}
              data={member.data}
              pokemonList={pokemonNames}
              onTeamChange={handleTeamChange}
              onMoveChange={handleMoveChange} />
          )}
        </ul>
        <TypeChart
          name="Defensive"
          types={typeData.map(type => type.name)}
          damageValues={damageValues.defensive}
          team={team} />
        <TypeChart
          name="Offensive"
          types={typeData.map(type => type.name)}
          damageValues={damageValues.offensive}
          team={team} />
      </div>
    );
  }
}

export default App;