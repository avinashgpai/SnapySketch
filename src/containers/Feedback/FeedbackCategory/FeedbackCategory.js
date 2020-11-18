import React,{Component} from 'react';
import classes from '../../../styles/FeedbackCategory.module.css';
import Individual from '../../../components/IndividualCategory/IndividualCategory';
import Input from '../../../components/Input/Input';
import Hoc from '../../../hoc/hoc';
import {connect} from 'react-redux';
import * as actionType from '../../../store/action';

class FeedbackCategory extends Component{
    constructor(props){
        super(props);    
        this.state={
            id:null,
            suggestionClick:false,
            notRightClick:false,
            complimentClick:false,
            categories:['Suggestion','Something is quite not right','Complement']
        };
    }

    OnclickHandler = (category,index) => {
        if (category==='Suggestion' && !this.state.suggestionClick && !this.state.complimentClick && !this.state.notRightClick){
            const click = this.state.suggestionClick;
            this.setState({suggestionClick:!click,id:index});
        }
        else if (category==='Suggestion' && !this.state.suggestionClick && (this.state.complimentClick || this.state.notRightClick)){
            const click = this.state.suggestionClick;
            this.setState({suggestionClick:!click,complimentClick:false,notRightClick:false,id:index});
        }
        if (category==='Something is quite not right' && !this.state.notRightClick && !this.state.complimentClick && !this.state.satisfiedClick){
            const click = this.state.notRightClick;
            this.setState({notRightClick:!click,id:index});
        }
        else if (category==='Something is quite not right' && !this.state.notRightClick && (this.state.complimentClick || this.state.satisfiedClick)){
            const click = this.state.notRightClick;
            this.setState({notRightClick:!click,complimentClick:false,suggestionClick:false,id:index});
        }
        if (category==='Complement' && !this.state.complimentClick && !this.state.suggestionClick && !this.state.notRightClick){
            const click = this.state.complimentClick;
            this.setState({complimentClick:!click,id:index});
        }
        else if (category==='Complement' && !this.state.complimentClick && (this.state.suggestionClick || this.state.notRightClick)){
            const click = this.state.complimentClick;
            this.setState({complimentClick:!click,suggestionClick:false,notRightClick:false,id:index});
        }
    }

    render(){
        return(
            <Hoc>
                <span className={classes.FeedbackCategory}>
                    {this.state.categories.map((category,index) =>{
                        return <Individual name={category} key={index} cls={this.props.id===index?true:null} 
                        click={() => this.props.CategorySelection(index)}
                        />
                    })}
                </span>
                <Input type="hidden" value={this.state.categories[this.state.id]}/>
            </Hoc>    
        );
    }
}

const mapStateToProps = state => {
    return {
      id:state.index,
    };
}

const mapDispatchToProps = dispatch => {
  return {
    CategorySelection: (index) => dispatch({type:actionType.SELECTED_CATEGORY,id:index})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FeedbackCategory);