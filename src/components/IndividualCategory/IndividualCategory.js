import React from 'react';
import classes from '../../styles/IndividualCategory.module.css';
import Hoc from '../../hoc/hoc';

const individual = (props) => <Hoc><div className={[classes.Individual,props.cls?classes.click:null].join(' ')} onClick={props.click}>{props.name}</div></Hoc>

export default individual;