import React,{Component} from 'react';
import classes from '../../../styles/Save.module.css';
import {connect} from 'react-redux';
import * as actionType from '../../../store/action';

class Save extends Component {

    options = ['PNG','JPG']

    render(){
        return(
            <center className={classes.formats}>
                <div>Format you wanna save</div>
                {
                    this.options.map(
                        (option,index) => {
                            return(
                                <span 
                                    className={this.props.option===index?classes.format_selected:classes.format} 
                                    key={index}
                                    onClick={()=>this.props.setSaveOption(index)} 
                                >
                                    {option}
                                </span>
                            );
                        })
                }
            </center>
        );
    }

}

const mapStateToProps = state => {
    return {
      option:state.option
    };
}

const mapDispatchToProps = dispatch => {
    return {
      setSaveOption: (index)=>dispatch({type:actionType.SAVE_OPTION,option:index})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Save);