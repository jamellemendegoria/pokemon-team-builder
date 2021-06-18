import React from 'react';
import { capitalize, formatMove } from '../helpers';

function Popover(props) {
  function setDamageValueClass(value) {
    const valueClass = value > 0 && value < 1 ? "positive bold"
                     : value > 1 ? "negative bold"
                     : value === 0 ? "no-damage bold"
                     : "";
    return valueClass;
  }

  const defensiveTemplate = (
    <>
      <h3 className={`popover-heading ${props.name}-text`}>{capitalize(props.name)}</h3>
      <ul className="popover-team">
        {props.team.map((member, index) => {
          const damageValue = props.damageValues[index];
          return member.data &&
            <li key={index}>
              {capitalize(member.data.name)}
              <span className={setDamageValueClass(damageValue)}>{` (${damageValue}x)`}</span>
            </li>
        })}
      </ul>
    </>
  );
  const offensiveTemplate = (
    <>
      <h3 className="popover-heading">
        {`Super effective against `}
        <span className={`${props.name}-text`}>{capitalize(props.name)}</span>
      </h3>
      <ul>
        {props.team.map((member, teamIndex) => {
          return member.data && member.moves.filter(move => move.data && move.damage && move.damage.hasOwnProperty(props.name))
          .map((move, moveIndex) =>
            <li key={`member-${teamIndex}-move-${moveIndex}`}>
              <span className={`${move.data.type.name}-text bold`}>{formatMove(move.data.name)}</span>
              {` - ${capitalize(member.data.name)}`}
            </li>
          )
        })}
      </ul>
    </>
  );

  return (
    <>
    {props.isVisible &&
      <div className={"popover" + ((props.type === 'Offensive') ? " bottom" : "")}>
        {props.team.every(member => !member.data) ?
          <p>Please select a Pokémon.</p>
          :
          (props.type === 'Defensive' ? defensiveTemplate : offensiveTemplate)
        }
      </div>
    }
    </>
  );
}

export default Popover;