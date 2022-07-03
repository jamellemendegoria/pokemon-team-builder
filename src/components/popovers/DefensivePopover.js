import React from 'react';
import { Popover } from '@mui/material';

import { capitalize } from '../../helpers';

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
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      disableRestoreFocus
    >
      {props.team.every((member) => !member.data) ? (
        <p>Please select a Pokémon.</p>
      ) : (
        <>
          <h3 className={`popover-heading ${props.name}-text`}>
            {capitalize(props.name)}
          </h3>
          <ul className="popover-team">
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
    </Popover>
  );
}

export default DefensivePopover;
