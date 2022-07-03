import React from 'react';
import { Popover } from '@mui/material';

import { capitalize, formatMove } from '../../helpers';

function OffensivePopover(props) {
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
          <h3 className="popover-heading">
            {`Super effective against `}
            <span className={`${props.name}-text`}>
              {capitalize(props.name)}
            </span>
          </h3>
          <ul>
            {props.team.map((member, teamIndex) => {
              return (
                member.data &&
                member.moves
                  .filter(
                    (move) =>
                      move.data &&
                      move.damage &&
                      move.damage.hasOwnProperty(props.name)
                  )
                  .map((move, moveIndex) => (
                    <li key={`member-${teamIndex}-move-${moveIndex}`}>
                      <span className={`${move.data.type.name}-text bold`}>
                        {formatMove(move.data.name)}
                      </span>
                      {` - ${capitalize(member.data.name)}`}
                    </li>
                  ))
              );
            })}
          </ul>
        </>
      )}
    </Popover>
  );
}

export default OffensivePopover;
