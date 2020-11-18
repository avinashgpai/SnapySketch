import React ,{Component} from 'react';
import Hoc from '../../hoc/hoc';
import classes from '../../styles/SideDrawer.module.css';
import Navigation from '../SideDrawer/SideNavigation/SideNav';

class Sidedrawer extends Component {
    render(){
        return(
            <Hoc>
                <ul classes={classes.SideDrawer}>
                    <Navigation name='Home' path='/'/>
                    <Navigation name='About' path='/About'/>
                    <Navigation name='Feedback' path='/Feedback'/>
                </ul>    
            </Hoc>
        );
    }
}

export default Sidedrawer;