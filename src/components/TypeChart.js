import React, { useState } from 'react';
import DefensivePopover from './popovers/DefensivePopover';
import OffensivePopover from './popovers/OffensivePopover';

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
      <li key={type} className="type">
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
    <div
      className={
        'type-chart-container' +
        (props.name === 'Defensive'
          ? ' defensive-type-chart'
          : ' offensive-type-chart')
      }
    >
      <h2 className="type-chart-heading">{`${props.name} Coverage`}</h2>
      <ul className="type-chart">{chart}</ul>
    </div>
  );
}

export default TypeChart;
