import React , {Component} from 'react';
import {connect} from 'react-redux';
import Switch from "react-switch"; 
import * as actionType from '../../store/action';

class Toggle extends Component{

    render() {
      return (
        <label>
          <Switch 
              onChange={this.props.ChangeTheme} 
              checked={this.props.check} 
              onColor="#95a1ab"
              onHandleColor="#2a3640"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0,0,0,0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0,0,0,0.2)"
              height={20}
              width={40}
          />
        </label>
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
    ChangeTheme: () => dispatch({type:actionType.CHANGE_THEME})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Toggle);