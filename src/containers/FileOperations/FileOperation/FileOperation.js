import React ,{Component}from 'react';
import classes from '../../../styles/FileOperation.module.css';
import {connect} from 'react-redux';
import * as actionType from '../../../store/action';

class Operation extends Component{
    HandleClick = (name) =>{
      this.props.ShowPopUp();
      this.props.ShowSelected(name);
    }

    render(){
        return(
            <div className={classes.operation} onClick={()=>this.HandleClick(this.props.alt)}>
                <center
                  className={this.props.check?classes.dark_operation_img:classes.light_operation_img} 
                > 
                  {this.props.alt}
                </center> 
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme
    };
}

const mapDispatchToProps = dispatch => {
    return {
      ShowPopUp: () => dispatch({type:actionType.CHANGE_CLICK,popUp:null}),
      ShowSelected: (name)=>dispatch({type:actionType.SELECTED_OPERATION,selected_operation:name}),
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(Operation);