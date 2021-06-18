import React, { useState } from 'react';
import Popover from './Popover';

function TypeChart(props) {
  const [visibilityChart, setVisibilityChart] = useState(Array(18).fill(false));

  function handleMouseEnter(index) {
    let temp = [...visibilityChart];
    temp[index] = true;
    setVisibilityChart(temp);
  }
  function handleMouseLeave(index) {
    let temp = [...visibilityChart];
    temp[index] = false;
    setVisibilityChart(temp);
  }

  const chart = props.types.map((type, index) => {
    const typeChartDamageValue = props.damageValues[type].type_chart;
    return <li key={type} className="type">
      <div
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={() => handleMouseLeave(index)}
        className={`type-label ${type}-bg`}>
        {type}
      </div>
      <Popover
        name={type}
        index={index}
        type={props.name}
        isVisible={visibilityChart[index]}
        team={props.team}
        damageValues={props.name === 'Defensive' ? props.damageValues[type].popover : []} />
      <p className={"damage-value" + (typeChartDamageValue > 0 ? " positive" : (typeChartDamageValue < 0 ? " negative" : ""))}>
        {typeChartDamageValue > 0 ? `+${typeChartDamageValue}` : typeChartDamageValue}
      </p>
    </li>
  });
  
  return (
    <div className={"type-chart-container" + (props.name === 'Defensive' ? " defensive-type-chart" : " offensive-type-chart")}>
      <h2 className="type-chart-heading">{`${props.name} Coverage`}</h2>
      <ul className="type-chart">
        {chart}
      </ul>
    </div>
  );
}

export default TypeChart;