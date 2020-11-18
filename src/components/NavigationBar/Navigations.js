import React from 'react';
import Navigation from './Navigation/Navigation';
import classes from '../../styles/Navigations.module.css';

const navigations = () =>{
    return(
        <ul className={ classes.NavigationItems}>
            <Navigation name='Home' path={process.env.PUBLIC_URL +'/'}/>
            <Navigation name='About' path={process.env.PUBLIC_URL +'/About'}/>
            <Navigation name='Feedback' path={process.env.PUBLIC_URL +'/Feedback'}/>
        </ul>
    );
}
export default navigations;