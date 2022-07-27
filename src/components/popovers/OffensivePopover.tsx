import styled from '@emotion/styled';
import { Popover } from '@mui/material';

import { capitalize, formatMove } from '../../helpers';
import { Pokemon } from '../../types';

interface OffensivePopoverProps {
  name: string;
  isVisible: boolean;
  team: Pokemon[];
  anchorEl: any;
  onClose: any;
}

/* STYLED COMPONENTS */
const StyledContainer = styled.div`
  padding: 1em;

  & h3 {
    margin-bottom: 0.5em;
    font-size: 18px;
  }
`;

const OffensivePopover = ({
  name,
  isVisible,
  team,
  anchorEl,
  onClose,
}: OffensivePopoverProps) => {
  return (
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: 'none',
      }}
      open={isVisible}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      disableRestoreFocus
    >
      <StyledContainer>
        {team.every((member) => !member.data) ? (
          <p>Please select a Pokémon.</p>
        ) : (
          <>
            <h3>
              {`Super effective against `}
              <span className={`${name}-text`}>{capitalize(name)}</span>
            </h3>
            <ul>
              {team.map((member, teamIndex) => {
                return (
                  member.data &&
                  member.moves
                    .filter(
                      (move) =>
                        move.data &&
                        move.damage &&
                        move.damage.hasOwnProperty(name)
                    )
                    .map((move, moveIndex) => (
                      <li key={`member-${teamIndex}-move-${moveIndex}`}>
                        <span className={`${move.data?.type}-text bold`}>
                          {formatMove(move.data?.name)}
                        </span>
                        {` - ${capitalize(member.data?.name)}`}
                      </li>
                    ))
                );
              })}
            </ul>
          </>
        )}
      </StyledContainer>
    </Popover>
  );
};

export default OffensivePopover;
