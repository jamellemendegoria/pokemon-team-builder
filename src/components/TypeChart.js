import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';

import DefensivePopover from './popovers/DefensivePopover';
import OffensivePopover from './popovers/OffensivePopover';

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

function TypeChart(props) {
  const [anchorEl, setAnchorEl] = useState(Array(18).fill(false));

  const handlePopoverOpen = (index, event) => {
    let temp = [...anchorEl];
    temp[index] = event.target;
    setAnchorEl(temp);
  };

  const handlePopoverClose = (index) => {
    let temp = [...anchorEl];
    temp[index] = null;
    setAnchorEl(temp);
  };

  const chart = props.types.map((type, index) => {
    const typeChartDamageValue = props.damageValues[type].type_chart;
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
        {props.name === 'Defensive' ? (
          <DefensivePopover
            name={type}
            index={index}
            isVisible={Boolean(anchorEl[index])}
            team={props.team}
            damageValues={props.damageValues[type].popover}
            anchorEl={anchorEl[index]}
            onClose={() => handlePopoverClose(index)}
          />
        ) : (
          <OffensivePopover
            name={type}
            index={index}
            isVisible={Boolean(anchorEl[index])}
            team={props.team}
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
      <h2>{`${props.name} Coverage`}</h2>
      <StyledChart>{chart}</StyledChart>
    </StyledContainer>
  );
}

export default TypeChart;
