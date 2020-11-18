import React from 'react';
import Navigation from './Navigation/Navigation';
import classes from '../../styles/Navigations.module.css';

const navigations = () =>{
    return(
        <ul className={ classes.NavigationItems}>
            <Navigation name='Home' path='/'/>
            <Navigation name='About' path='/About'/>
            <Navigation name='Feedback' path='/Feedback'/>
        </ul>
    );
}
export default navigations;