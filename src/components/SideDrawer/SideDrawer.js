import React ,{Component} from 'react';
import Hoc from '../../hoc/hoc';
import classes from '../../styles/SideDrawer.module.css';
import Navigation from '../SideDrawer/SideNavigation/SideNav';

class Sidedrawer extends Component {
    render(){
        return(
            <Hoc>
                <ul classes={classes.SideDrawer}>
                    <Navigation name='Home' path={process.env.PUBLIC_URL + '/'}/>
                    <Navigation name='About' path={process.env.PUBLIC_URL + '/About/'}/>
                    <Navigation name='Feedback' path={process.env.PUBLIC_URL + '/Feedback/'}/>
                </ul>    
            </Hoc>
        );
    }
}

export default Sidedrawer;