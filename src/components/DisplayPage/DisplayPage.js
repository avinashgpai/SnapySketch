import React ,{Component} from 'react';
import ToolBar from '../ToolBar/ToolBar';
import SideBar from '../../components/SideDrawer/SideDrawer';
import Hoc from '../../hoc/hoc';
import Footer from '../Footer/Footer';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

class DisplayPage extends Component {
    state = { 
                width: window.innerWidth, 
                height: window.innerHeight
            };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    render(){
        let style = {
            backgroundColor:this.props.check?'darkslategrey':'white',
            transition:'all 0.6s'
        }
        
        if(this.state.width<=860 && this.props.popUp && this.props.history.location.pathname===process.env.PUBLIC_URL + '/'){
            style.overflowX="scroll"
        }
        else{
            delete style.overflowX;
        }
        return(
            <Hoc>
                <ToolBar/>
                <SideBar/>
                <main style={style}>
                    {this.props.children}
                </main>
                {this.props.history.location.pathname!==process.env.PUBLIC_URL + '/'?<Footer/>:null}
            </Hoc>    
        );
    }
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme,
      popUp:state.showPopUp
    };
}

export default withRouter(connect(mapStateToProps,null)(DisplayPage));