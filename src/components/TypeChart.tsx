import { useState } from 'react';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';

import DefensivePopover from './popovers/DefensivePopover';
import OffensivePopover from './popovers/OffensivePopover';
import { DamageValues, Pokemon } from '../types';

interface TypeChartProps {
  name: string;
  types: string[];
  damageValues: DamageValues;
  team: Pokemon[];
}

/* STYLED COMPONENTS */

const StyledContainer = styled(Paper)`
  margin-top: 1em;
  text-align: center;

  & h2 {
    margin-bottom: 1em;
    padding-top: 1em;
    font-size: 24px;
  }
`;

const StyledChart = styled.ul`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);

  & li {
    position: relative;
  }

  & .type-label {
    position: relative;
    margin: 0 1em;
    color: #fff;
    text-transform: capitalize;
    border-radius: 5px;
    font-size: 16px;
  }
`;

const TypeChart = ({ name, types, damageValues, team }: TypeChartProps) => {
  const [anchorEl, setAnchorEl] = useState(Array(18).fill(false));

  const handlePopoverOpen = (index: number, event: any) => {
    let temp = [...anchorEl];
    temp[index] = event.target;
    setAnchorEl(temp);
  };

  const handlePopoverClose = (index: number) => {
    let temp = [...anchorEl];
    temp[index] = null;
    setAnchorEl(temp);
  };

  const chart = types.map((type, index) => {
    const typeChartDamageValue =
      name === 'Defensive'
        ? damageValues.defensive[type].type_chart
        : damageValues.offensive[type].type_chart;
    return (
      <li key={type}>
        <div
          onMouseEnter={(e) => handlePopoverOpen(index, e)}
          onMouseLeave={() => handlePopoverClose(index)}
          className={`type-label ${type}-bg`}
          aria-owns={
            Boolean(anchorEl[index]) ? 'mouse-over-popover' : undefined
          }
          aria-haspopup="true"
        >
          {type}
        </div>
        {name === 'Defensive' ? (
          <DefensivePopover
            name={type}
            isVisible={Boolean(anchorEl[index])}
            team={team}
            damageValues={damageValues.defensive[type].popover}
            anchorEl={anchorEl[index]}
            onClose={() => handlePopoverClose(index)}
          />
        ) : (
          <OffensivePopover
            name={type}
            isVisible={Boolean(anchorEl[index])}
            team={team}
            anchorEl={anchorEl[index]}
            onClose={() => handlePopoverClose(index)}
          />
        )}
        <p
          className={
            'damage-value' +
            (typeChartDamageValue > 0
              ? ' positive'
              : typeChartDamageValue < 0
              ? ' negative'
              : '')
          }
        >
          {typeChartDamageValue > 0
            ? `+${typeChartDamageValue}`
            : typeChartDamageValue}
        </p>
      </li>
    );
  });

  return (
    <StyledContainer>
      <h2>{`${name} Coverage`}</h2>
      <StyledChart>{chart}</StyledChart>
    </StyledContainer>
  );
};

export default TypeChart;
