export interface Resource {
  name: string;
  url: URL;
}

export interface DefensiveDamageValues {
  [type: string]: {
    type_chart: number;
    popover: number[];
  };
}

export interface OffensiveDamageValues {
  [type: string]: {
    type_chart: number;
  };
}

export interface DamageValues {
  defensive: DefensiveDamageValues;
  offensive: OffensiveDamageValues;
}

export interface PokemonDamageValues {
  [type: string]: number;
}

export interface TypeTracker {
  [type: string]: {
    decremented: boolean;
    incremented: boolean;
  };
}

export interface MoveData {
  name: string;
  type: string;
  damage_class: string;
}

export interface Move {
  checked: boolean;
  damage: PokemonDamageValues | null;
  data: MoveData | null;
}

export interface PokemonData {
  name: string;
  img: string;
  types: string[];
  moves: string[];
}

export interface Pokemon {
  checked: boolean;
  damage: PokemonDamageValues | null;
  data: PokemonData | null;
  moves: Move[];
}

export interface FetchedPokemonEntry {
  entry_number: number;
  pokemon_species: Resource;
}

export interface DamageRelations {
  double_damage_from: string[];
  half_damage_from: string[];
  no_damage_from: string[];
  double_damage_to: string[];
}

export interface DamageRelationsForEachType {
  [type: string]: DamageRelations;
}
