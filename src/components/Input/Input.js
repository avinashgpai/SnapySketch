import React,{Component} from 'react';
import classes from '../../styles/Input.module.css';

class Input extends Component{

    render(){
        let inputElement = '';

        switch (this.props.inputtype){
            case ('input'):
                inputElement = <input 
                                    className={classes.InputElement} 
                                    type={this.props.type}  
                                    placeholder={this.props.placeholder} 
                                    onChange={this.props.onChange}
                                    name={this.props.name}
                                    value={this.props.input} />
                break;
            case ('textarea'):
                inputElement = <textarea 
                                    className={classes.InputElement} 
                                    placeholder={this.props.placeholder} 
                                    onChange={this.props.change} 
                                    cols={this.props.cols} 
                                    rows={this.props.rows}
                                    name={this.props.name}>
                                </textarea>;  
                break;
            case ('submit'): 
                inputElement = <input className={this.props.cls}
                                    onSubmit={this.props.onSubmit} 
                                    type={this.props.type} 
                                    disabled={this.props.disable}/>;
                break;    
            default :
                inputElement = <input className={classes.InputElement} type={this.props.type}/>;      
        }

        return(
            <div className={classes.Input}>
                {this.props.label?<label className={classes.Label}>{this.props.label}</label>:null}
                {inputElement}
            </div>
        );
    }
}

export default Input;