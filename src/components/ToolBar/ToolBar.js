import React ,{Component}from 'react';
import Nav from '../NavigationBar/Navigations';
import logo from '../../assets/images/logo.png';
import classes from '../../styles/ToolBar.module.css';
import Hoc from '../../hoc/hoc';
import Toggle from '../../containers/ThemeToggle/ThemeToggle';
import {connect} from 'react-redux';

class ToolBar extends Component {
    render(){
        return(
            <Hoc>
                <div className={this.props.check ? classes.dark:classes.light}>
                    <header className={classes.toolBar}>
                        <div className={classes.logo}>
                            <img src={logo} alt='logo'/>
                        </div>  
                        <div className={classes.DesktopOnly}>  
                            <Nav/>
                        </div>    
                        <div className={classes.toggle}>
                            <Toggle />
                        </div>
                    </header>
                </div>
            </Hoc>    
        );
    }    
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme
    };
}

export default connect(mapStateToProps,null)(ToolBar);