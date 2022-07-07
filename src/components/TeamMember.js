import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Collapse,
  Autocomplete,
  TextField,
} from '@mui/material';

import { formatAllMoves, formatAllPokemon, removeFormatting } from '../helpers';

/* STYLED COMPONENTS */

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5em;

  & .placeholder {
    width: 125px;
    height: 125px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
  }

  & ul {
    display: flex;
    margin-top: 0.5em;
  }

  & ul li {
    text-transform: capitalize;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  width: 125px;
  height: 125px;
`;

const StyledCardContent = styled(CardContent)`
  padding: 0;

  :last-child {
    padding: 0;
  }
`;

const StyledCollapse = styled(Collapse)`
  width: 100%;
`;

const StyledAutocomplete = styled(Autocomplete)`
  margin-top: 0.5em;
`;

const StyledButton = styled(Button)`
  background-color: #464646;
  font-size: 12px;

  :hover {
    background-color: #585858;
  }
`;

function TeamMember(props) {
  const [name, setName] = useState(
    props.data
      ? props.data.name.charAt(0).toUpperCase() + props.data.name.slice(1)
      : ''
  );
  const [isShowingMoves, setIsShowingMoves] = useState(false);
  const [moves, setMoves] = useState(Array(4).fill(''));

  function handleChange(e, value) {
    setName(value);
    // Resets moves
    let temp = [...moves];
    for (let i = 0; i < moves.length; i++) {
      temp[i] = '';
    }
    setMoves(temp);
    props.onTeamChange(removeFormatting(value), props.index);
  }

  function handleMoveChange(index, e, value) {
    let tempMoves = [...moves];
    tempMoves[index] = value;
    setMoves(tempMoves);
    props.onMoveChange(removeFormatting(value), props.index, index);
  }

  function handleClick() {
    setIsShowingMoves(!isShowingMoves);
  }

  return (
    <li>
      <StyledCard>
        {props.data ? (
          <StyledCardMedia
            component="img"
            image={props.data.sprites.other['official-artwork'].front_default}
            alt={props.data.name}
          />
        ) : (
          // <img
          //   src={props.data.sprites.other['official-artwork'].front_default}
          //   alt={props.data.name}
          //   className={`team-member-img ${props.data.types[0].type.name}-bg`}
          // />
          <div className="placeholder">?</div>
        )}
        <StyledAutocomplete
          inputValue={name}
          fullWidth
          size="small"
          options={formatAllPokemon(props.pokemonList)}
          renderInput={(params) => (
            <TextField {...params} label="Pokémon name..." />
          )}
          onInputChange={handleChange}
        />
        <ul>
          {props.data ? (
            <>
              {props.data.types.map((type) => (
                <li key={type.slot} className={`${type.type.name}-text`}>
                  {type.type.name}
                  <span style={{ color: '#464646' }}>
                    {props.data.types.length === 2 &&
                    props.data.types.indexOf(type) === 0
                      ? '/'
                      : ''}
                  </span>
                </li>
              ))}
            </>
          ) : (
            <li key="0">???</li>
          )}
        </ul>
        <CardActions>
          <StyledButton
            variant="contained"
            disabled={!props.data}
            onClick={handleClick}
          >
            {isShowingMoves ? 'Hide' : 'Moves'}
          </StyledButton>
        </CardActions>
        <StyledCollapse in={isShowingMoves}>
          <StyledCardContent>
            {moves.map((move, i) => (
              <StyledAutocomplete
                key={i}
                inputValue={move}
                fullWidth
                size="small"
                options={
                  props.data
                    ? formatAllMoves(props.data.moves).filter(
                        // removes moves already selected
                        (move) => !moves.includes(move)
                      )
                    : []
                }
                renderInput={(params) => (
                  <TextField {...params} label={`Move #${i + 1}...`} />
                )}
                onInputChange={(e, value) => handleMoveChange(i, e, value)}
              />
            ))}
          </StyledCardContent>
        </StyledCollapse>
      </StyledCard>
    </li>
  );
}

export default TeamMember;
