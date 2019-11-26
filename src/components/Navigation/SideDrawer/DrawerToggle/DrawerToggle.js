import React from 'react';
import hamburgerMenu from '../../../../assets/images/hamburger-menu.png';
import classes from './DrawerToggle.module.css';

const DrawerToggle = (props) => (
  <div className={classes.DrawerToggle} onClick={props.clicked}>
    {/* <img src={hamburgerMenu} onClick={props.clicked} alt="hamburgerMenu"/> */}
    <div></div>
    <div></div>
    <div></div>
  </div>
)

export default DrawerToggle;
