const movesWithHyphens = [
  'baby-doll-eyes','double-edge', 'freeze-dry', 'lock-on', 'mud-slap',
  'multi-attack', 'power-up-punch', 'self-destruct', 'soft-boiled', 'topsy-turvy',
  'trick-or-treat', 'u-turn', 'wake-up-slap', 'will-o-wisp', 'x-scissor'
];

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
function capitalizeAll(str) {
  const words = str.split(/\s/);
  const capitalizedWords = words.map(word => capitalize(word));
  return capitalizedWords.join(' ');
}
function removeHyphens(str) {
  return str.replace(/-/g, ' ');
}
function formatMove(move) {
  let formattedMove;
  if (move.includes('-')) {
    formattedMove = capitalizeAll(removeHyphens(move));
    // If move name is supposed to include hyphens
    if (movesWithHyphens.includes(move)) {
      // These move names only have one hyphen
      formattedMove = (move === 'baby-doll-eyes' || move === 'power-up-punch' || move === 'wake-up-slap') ?
      formattedMove.replace(' ', '-') : formattedMove.replaceAll(' ', '-');
    }
  } else {
    formattedMove = capitalize(move);
  }
  return formattedMove;
}
function formatPokemon(pokemon) {
  let formattedPokemon;
  if (pokemon.includes('-')) {
    formattedPokemon = capitalizeAll(removeHyphens(pokemon));
    // Handles Pokémon names with special requirements
    if (pokemon === 'mr-mime') {
      formattedPokemon = formattedPokemon.replace(' ', '. ');
    }
  } else {
    formattedPokemon = capitalize(pokemon);
  }
  return formattedPokemon;
}
function formatAllMoves(moves) {
  const formattedMoves = moves.map(move => formatMove(move.move.name)).sort();
  return formattedMoves;
}
function formatAllPokemon(pokemonList) {
  const formattedList = pokemonList.map(pokemon => formatPokemon(pokemon));
  return formattedList;
}
function removeFormatting(str) {
  if (str === '') {
    return str;
  }
  let revertedStr;
  if (/[\s.-]+/.test(str)) {
    let words = str.split(/[\s.-]+/);
    // Remove empty string elements
    if (words[words.length - 1] === '') {
      words.pop();
    }
    const lowercasedWords = words.map(word => word.toLowerCase());
    revertedStr = lowercasedWords.join('-');
  } else {
    revertedStr = str.toLowerCase();
  }
  return revertedStr;
}

export { capitalize, formatMove, formatPokemon, formatAllMoves, formatAllPokemon, removeFormatting };