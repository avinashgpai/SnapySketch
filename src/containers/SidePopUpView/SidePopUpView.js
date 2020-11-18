import React ,{Component} from 'react';
import SideFileOperation from './SideFileOperation/SideFileOperation';
import classes from '../../styles/SidePopUpView.module.css';
import {connect} from 'react-redux';
import * as actionType from '../../store/action'; 

class SidePopUpDesktopView extends Component{
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render(){
        return(
            <center className={this.props.check ? classes.dark:classes.light} style={{
                transform:this.props.click ? 'translateX(0)':'translateX(100vh)',
                opacity : this.props.click ? '1' : '0'
            }}>
                <center style={{backgroundColor:this.props.check?'rgb(1, 16, 20)':'rgb(49, 65, 90)',transition:'all 0.6s'}} 
                    className={classes.drop_down} 
                    onClick={this.props.ChangeMiniClick}
                >
                    <div>
                        <hr className={this.props.miniClick ? classes.close_first:classes.first}/>
                        <hr className={this.props.miniClick ? classes.close_second:classes.second}/>
                    </div>    
                </center>
                <div style={{display:'inline-flex',flexFlow:'row',transition:'all 0.6s'}}>
                    <div className={classes.Operations}>
                        <div className={classes.col} style={{transform:this.state.width>750?null:this.props.miniClick?'translateX(0)':'translateX(750px)',visibility:this.state.width>750?"visible":this.props.miniClick?"visible":"hidden"}}>
                            <SideFileOperation  alt="2D"/>
                            <SideFileOperation  alt="3D"/>
                        </div>   
                    </div>
                </div>    
            </center>    
        );
    }    
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme,
      click:state.showPopUp,
      miniClick:state.showDropDown
    };
}

const mapDispatchToProps = dispatch => {
    return {
      ChangeMiniClick: () => dispatch({type:actionType.CHANGE_MINI_CLICK})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SidePopUpDesktopView);