import styled from '@emotion/styled';
import { Popover } from '@mui/material';

import { capitalize } from '../../helpers';
import { Pokemon } from '../../types';

interface DefensivePopoverProps {
  name: string;
  isVisible: boolean;
  team: Pokemon[];
  damageValues: number[];
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

const setDamageValueClass = (value: number) => {
  const valueClass =
    value > 0 && value < 1
      ? 'positive bold'
      : value > 1
      ? 'negative bold'
      : value === 0
      ? 'no-damage bold'
      : '';
  return valueClass;
};

const DefensivePopover = ({
  name,
  isVisible,
  team,
  damageValues,
  anchorEl,
  onClose,
}: DefensivePopoverProps) => {
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
        {team.every((member) => !member.data) ? (
          <p>Please select a Pokémon.</p>
        ) : (
          <>
            <h3 className={`${name}-text`}>{capitalize(name)}</h3>
            <ul>
              {team.map((member, index) => {
                const damageValue = damageValues[index];
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
};

export default DefensivePopover;
