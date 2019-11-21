import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
  {label: 'Bacon', type: 'bacon'},
  {label: 'Salad', type: 'salad'},
  {label: 'Cheese', type: 'cheese'},
  {label: 'Meat', type: 'meat'}
]

const BuildControls = (props) => (
  <div className={classes.BuildControls}>
    <p className={classes.price}>Price: {props.price.toFixed(2)}</p>
    {controls.map(control => (
      <BuildControl
        key={control.label}
        label={control.label}
        added={() => props.ingredientsAdded(control.type)}
        removed={() => props.ingredientsRemoved(control.type)}
        disabled={props.disabled[control.type]}
      />
    ))}

    <button className={classes.OrderButton} disabled={!props.purchaseable} onClick={props.ordered}>ORDER NOW</button>
  </div>
);

export default BuildControls;
