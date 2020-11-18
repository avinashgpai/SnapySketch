import React ,{Component} from 'react';
import DisplayPage from '../src/components/DisplayPage/DisplayPage';
import {Route,withRouter} from 'react-router-dom';
import About from '../src/components/About/About';
import Feedback from '../src/containers/Feedback/Feedback';
import './App.css';
import FileOperations from '../src/containers/FileOperations/FileOperations';
import SidePopUpView from '../src/containers/SidePopUpView/SidePopUpView';
import {connect} from 'react-redux';
import * as actionType from './store/action';

class App extends Component {
  
  componentDidMount() {
    window.addEventListener("popstate", () => {
        this.props.history.push({pathname:process.env.PUBLIC_URL + '/'});
        this.props.ShowSelected();
        this.props.ShowPopUp();
    });
  }

  render(){
    
    return (
        <div className="App" style={{backgroundColor:this.props.check?'darkslategrey':'white',transition:'all 0.6s'}}>
            <DisplayPage>
              <Route path="/About" component={About} exact/>
              <Route path="/Feedback" component={Feedback} exact/>
              <Route path={process.env.PUBLIC_URL + "/"} component={SidePopUpView} exact/>
              <Route path={process.env.PUBLIC_URL + "/"} component={FileOperations} exact/>
            </DisplayPage> 
        </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    check:state.changeTheme,
    operation:state.operation
  };
}

const mapDispatchToProps = dispatch => {
  return {
    ShowSelected: ()=>dispatch({type:actionType.SELECTED_OPERATION,selected_operation:null}),
    ShowPopUp: () => dispatch({type:actionType.CHANGE_CLICK,popUp:false}),
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));