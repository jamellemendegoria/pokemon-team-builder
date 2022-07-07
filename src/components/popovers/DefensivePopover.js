import React from 'react';
import styled from '@emotion/styled';
import { Popover } from '@mui/material';

import { capitalize } from '../../helpers';

/* STYLED COMPONENTS */
const StyledContainer = styled.div`
  padding: 1em;

  & h3 {
    margin-bottom: 0.5em;
    font-size: 18px;
  }
`;

function DefensivePopover(props) {
  function setDamageValueClass(value) {
    const valueClass =
      value > 0 && value < 1
        ? 'positive bold'
        : value > 1
        ? 'negative bold'
        : value === 0
        ? 'no-damage bold'
        : '';
    return valueClass;
  }

  return (
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: 'none',
      }}
      open={props.isVisible}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      disableRestoreFocus
    >
      <StyledContainer>
        {props.team.every((member) => !member.data) ? (
          <p>Please select a Pokémon.</p>
        ) : (
          <>
            <h3 className={`${props.name}-text`}>{capitalize(props.name)}</h3>
            <ul>
              {props.team.map((member, index) => {
                const damageValue = props.damageValues[index];
                return (
                  member.data && (
                    <li key={index}>
                      {capitalize(member.data.name)}
                      <span
                        className={setDamageValueClass(damageValue)}
                      >{` (${damageValue}x)`}</span>
                    </li>
                  )
                );
              })}
            </ul>
          </>
        )}
      </StyledContainer>
    </Popover>
  );
}

export default DefensivePopover;
