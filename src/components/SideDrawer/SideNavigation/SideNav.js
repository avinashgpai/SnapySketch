import React ,{Component} from 'react';
import classes from '../../../styles/SideNav.module.css'; 
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

class Navigation extends Component{
    
    render(){
        return(
            <div className={this.props.check ? classes.dark:classes.light}>
                <li className={[classes.NavigationItem,classes.NavContainer].join(' ')}>
                    <NavLink to={this.props.path} activeClassName={classes.active} exact>{this.props.name}</NavLink>
                </li>
            </div>    
        );
    }    
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme
    };
}

export default connect(mapStateToProps,null)(Navigation);