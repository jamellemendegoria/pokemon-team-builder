import { useState } from 'react';
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
import { PokemonData } from '../types';

interface TeamMemberProps {
  index: number;
  data: PokemonData | null;
  pokemonList: string[];
  onTeamChange: (member: string, index: number) => void;
  onMoveChange: (move: string, teamIndex: number, moveIndex: number) => void;
}

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

const TeamMember = ({
  index,
  data,
  pokemonList,
  onTeamChange,
  onMoveChange,
}: TeamMemberProps) => {
  const [name, setName] = useState(
    data ? data.name.charAt(0).toUpperCase() + data.name.slice(1) : ''
  );
  const [isShowingMoves, setIsShowingMoves] = useState(false);
  const [moves, setMoves] = useState(Array(4).fill(''));

  const MUICardMediaProps = {
    component: 'img',
    alt: data?.name,
  };

  function handleChange(e: any, value: string) {
    setName(value);
    // Resets moves
    let temp = [...moves];
    for (let i = 0; i < moves.length; i++) {
      temp[i] = '';
    }
    setMoves(temp);
    onTeamChange(removeFormatting(value), index);
  }

  function handleMoveChange(index: number, e: any, value: string) {
    let tempMoves = [...moves];
    tempMoves[index] = value;
    setMoves(tempMoves);
    onMoveChange(removeFormatting(value), index, index);
  }

  function handleClick() {
    setIsShowingMoves(!isShowingMoves);
  }

  return (
    <li>
      <StyledCard>
        {data ? (
          <StyledCardMedia image={data.img} {...MUICardMediaProps} />
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
          options={formatAllPokemon(pokemonList)}
          renderInput={(params) => (
            <TextField {...params} label="Pokémon name..." />
          )}
          onInputChange={handleChange}
        />
        <ul>
          {data ? (
            <>
              {data.types.map((type, index) => (
                <li key={index} className={`${type}-text`}>
                  {type}
                  <span style={{ color: '#464646' }}>
                    {data.types.length === 2 && data.types.indexOf(type) === 0
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
            disabled={!data}
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
                  data
                    ? formatAllMoves(data.moves).filter(
                        // removes moves already selected
                        (move: string) => !moves.includes(move)
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
};

export default TeamMember;
