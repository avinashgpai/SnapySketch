import React ,{Component} from 'react';
import FileOperation from './FileOperation/FileOperation';
import classes from '../../styles/FileOperations.module.css';
import {connect} from 'react-redux';
import Hoc from '../../hoc/hoc';
import TwoD from '../2D/2D';

class FileOperations extends Component{
    
    render(){
        return(
            <Hoc>
                <center 
                    style={{display:this.props.click?'none':'inline'}} 
                    className={this.props.check ? classes.dark:classes.light}
                >
                    <div className={classes.Operations}>
                        <div className={classes.col}>
                            <FileOperation  alt="2D"/>
                            <FileOperation  alt="3D"/>
                        </div>    
                    </div>
                </center>
                <center style={{display:this.props.click?this.props.operation==='2D'?'inline':'none':'none'}} >
                    <TwoD/>
                </center> 
                <center style={{display:this.props.click?this.props.operation==='3D'?'inline':'none':'none'}} >
                    <h1>Coming soon ...</h1>
                </center>
            </Hoc>      
        );
    }    
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme,
      operation:state.operation,
      click:state.showPopUp
    };
}

export default connect(mapStateToProps,null)(FileOperations);