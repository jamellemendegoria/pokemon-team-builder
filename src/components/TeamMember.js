import React, { useState } from 'react';
import { formatAllMoves, formatAllPokemon, removeFormatting } from '../helpers';

function TeamMember(props) {
  const [name, setName] = useState(props.data ? props.data.name.charAt(0).toUpperCase() + props.data.name.slice(1) : '');
  const [isShowingMoves, setIsShowingMoves] = useState(false);
  const [moves, setMoves] = useState(Array(4).fill(''));

  const pokemonList = formatAllPokemon(props.pokemonList).map((pokemon, index) => 
    <option
      key={index}
      value={pokemon}/>
  );

  let moveInputs = [];
  for (let i = 0; i < moves.length; i++) {
    moveInputs.push(
      <input
        key={i}
        value={moves[i]}
        placeholder={`Move #${i + 1}...`}
        list={`moves-${props.index}`}
        onChange={(e) => handleMoveChange(i, e)}
        className="team-member-move-input" />
    );
  }

  function handleChange(e) {
    setName(e.target.value);
    // Resets moves
    let temp = [...moves];
    for (let i = 0; i < moves.length; i++) {
      temp[i] = '';
    }
    setMoves(temp);
    props.onTeamChange(removeFormatting(e.target.value), props.index);

  }
  function handleMoveChange(index, e) {
    let tempMoves = [...moves];
    tempMoves[index] = e.target.value;
    setMoves(tempMoves);
    props.onMoveChange(removeFormatting(e.target.value), props.index, index);
  }
  function handleClick() {
    setIsShowingMoves(!isShowingMoves);
  }

  return (
    <li className="team-member">
      {props.data ?
        <img
          src={props.data.sprites.other['official-artwork'].front_default}
          alt={props.data.name}
          className={`team-member-img ${props.data.types[0].type.name}-bg`}/>
        :
        <div className="team-member-placeholder">?</div>
      }
      <input
        value={name}
        placeholder="Pokémon name..."
        spellCheck="false"
        list="pokemon"
        onChange={handleChange}
        className="team-member-name-input"/>
      <datalist id="pokemon">
        {pokemonList}
      </datalist>
      <ul className="team-member-types-list">
        {props.data ?
          <>
            {props.data.types.map(type => 
              <li key={type.slot} className={`team-member-type ${type.type.name}-text`}>
                {type.type.name}
                <span style={{ color: '#464646'}}>
                  {props.data.types.length === 2 && props.data.types.indexOf(type) === 0 ? '/' : ''}
                </span>
              </li>
            )}
          </>
        : <li key="0">???</li>
        } 
      </ul>
      <button
        onClick={handleClick}
        className="team-member-moves-btn">
        {isShowingMoves ? 'Hide' : 'Moves'}
      </button>
      <div className="team-member-moves-wrapper">
      {isShowingMoves &&
        <div className="team-member-moves-container">
          {moveInputs}
          <datalist id={`moves-${props.index}`}>
            {props.data &&
              (formatAllMoves(props.data.moves).filter(move => !moves.includes(move))
              .map((move, index) => 
                <option key={index} value={move} />
              ))
            }
          </datalist>
        </div>
      }
      </div>
    </li>
  );
}

export default TeamMember;