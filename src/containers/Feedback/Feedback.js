import React ,{Component} from 'react';
import emailjs from 'emailjs-com';
import classes from '../../styles/Feedback.module.css';
import Hoc from '../../hoc/hoc';
import satisfied from '../../assets/images/satisfied.png';
import unsatisfied from '../../assets/images/not-satisfied.png';
import whatever from '../../assets/images/whatever.png';
import satisfiedClicked from '../../assets/images/satisfied_onclick.png';
import unsatisfiedClicked from '../../assets/images/not-satisfied_onclick.png';
import whateverClicked from '../../assets/images/whatever_onclick.png';
import {connect} from 'react-redux';
import Input from '../../components/Input/Input';
import Category from '../Feedback/FeedbackCategory/FeedbackCategory';
import Alert from '../../components/Alert/Alert';

class Feedback extends Component{
    constructor(props){
        super(props);
        this.state = {
            satisfiedClick : false,
            unsatisfiedClick : false,
            whateverClick : false,
            value:'',
            inputValue:'',
            disable:false,
            name: '',
            email: '' ,
            alert:false,
            errorType1: false,
            errorType2:false ,
            show:false
        };
         
    }

    OnclickHandler = (satisfaction) =>{
        if (satisfaction==='satisfied' && !this.state.satisfiedClick && !this.state.unsatisfiedClick && !this.state.whateverClick){
            const click = this.state.satisfiedClick;
            this.setState({satisfiedClick:!click,value:'satisified'});
        }
        else if (satisfaction==='satisfied' && !this.state.satisfiedClick && (this.state.unsatisfiedClick || this.state.whateverClick)){
            const click = this.state.satisfiedClick;
            this.setState({satisfiedClick:!click,unsatisfiedClick:false,whateverClick:false,value:'satisified'});
        }
        if (satisfaction==='whatever' && !this.state.whateverClick && !this.state.unsatisfiedClick && !this.state.satisfiedClick){
            const click = this.state.whateverClick;
            this.setState({whateverClick:!click,value:'whatever'});
        }
        else if (satisfaction==='whatever' && !this.state.whateverClick && (this.state.unsatisfiedClick || this.state.satisfiedClick)){
            const click = this.state.whateverClick;
            this.setState({whateverClick:!click,unsatisfiedClick:false,satisfiedClick:false,value:'whatever'});
        }
        if (satisfaction==='unsatisfied' && !this.state.unsatisfiedClick && !this.state.satisfiedClick && !this.state.whateverClick){
            const click = this.state.unsatisfiedClick;
            this.setState({unsatisfiedClick:!click,value:'unsatisified'});
        }
        else if (satisfaction==='unsatisfied' && !this.state.unsatisfiedClick && (this.state.satisfiedClick || this.state.whateverClick)){
            const click = this.state.unsatisfiedClick;
            this.setState({unsatisfiedClick:!click,satisfiedClick:false,whateverClick:false,value:'unsatisified'});
        }  
    }

    OnchangeHandler = (event) =>{
        const val = {...this.state};
        val.inputValue = event.target.value;
        const res1 = val.inputValue.match(/sex/gi);
        const res2 = val.inputValue.match(/fuck/gi);
        this.setState({inputValue:val,disable:res1===null&&res2===null?false:true});
    }

    OnInputChange = (event,input_type) =>{
        let Name = true;
        let Email = true;
        if(input_type==='Name'){
            this.setState({name:event.target.value,})
            if (event.target.value.length>0){
                Name = false;
            }
            else{
                Name = true;
            }
        } 
        else if(input_type==='Email'){
            this.setState({email:event.target.value})
            if (event.target.value.length>0){
                Email = false;
            }
            else{
                Email = true;
            }
        }    
        this.setState({disable:Name||Email});
    }

    OnsubmitHandler = (e) =>{

        e.preventDefault();

        if(!((this.state.satisfiedClick||this.state.unsatisfiedClick||this.state.whateverClick)&&(this.state.name!==null||this.state.email!==null))){
            this.setState({alert:true,errorType1:true});
        }
        if(this.state.inputValue&&!this.props.category_selected){
            this.setState({alert:true,errorType2:true});
        }
        this.setState({show:true});

        emailjs.sendForm('service_7k7jq6e', 'template_foew5m7', '#FeedbackForm', 'user_7ZuRYhgflSlkIpvN3Cj3x')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });

        e.target.reset();
    }

    HandleOK = () =>{
        this.setState({show:false});
    }

    render(){

        return(
            
            <Hoc>
                <Alert show={this.state.show}>
                    {!this.state.errorType1&&!this.state.errorType2?<p>Thank you for your feedback</p>:null}
                    {this.state.errorType1?<p>Please express your feedback and fill name , email </p>:null}
                    {this.state.errorType2?<p>Please select category of feedback and fill your opinion </p>:null}
                    <p onClick={this.HandleOK} style={{color:'red',float:'right',padding:'5px',fontSize:'20px',cursor:'pointer'}}>OK</p>
                </Alert>
                <div className={this.props.check ? classes.dark:classes.light}>
                    <h1 className={this.props.check ? classes.dark:classes.light}>Your Feedback</h1>
                    <center><hr/></center>
                    <p>I would like your feedback to improve my website.</p>
                    <p>What is your opinion on this page?</p>
                    <form id="FeedbackForm">
                        <div className={classes.feedback}>
                            <img 
                                className={classes.emojies}
                                src={this.state.satisfiedClick?satisfiedClicked:satisfied} 
                                alt="Satisfied" 
                                onClick={()=>{this.OnclickHandler('satisfied')}}>
                            </img>
                            <img 
                                className={classes.emojies}
                                src={this.state.whateverClick?whateverClicked:whatever} 
                                alt="Whatever" 
                                onClick={()=>{this.OnclickHandler('whatever')}}>    
                            </img>
                            <img 
                                className={classes.emojies}
                                src={this.state.unsatisfiedClick?unsatisfiedClicked:unsatisfied} 
                                alt="Unsatisfied" 
                                onClick={()=>{this.OnclickHandler('unsatisfied')}}>                            
                            </img>
                        </div>
                        <Input type="hidden" name="feedback" value={this.state.value}/>
                        <center><hr/></center>
                        <Input 
                            inputtype="input" 
                            type="text" 
                            name="name" 
                            label="Name" 
                            input={this.state.name}
                            onChange={(event) => {this.OnInputChange(event,"Name")}} 
                            placeholder="Your Name" />
                        <Input 
                            inputtype="input" 
                            type="email" 
                            name="email" 
                            label="Email" 
                            input={this.state.email}
                            onChange={(event) => {this.OnInputChange(event,"Email")}} 
                            placeholder="Your Mail" />
                        <center>
                            <hr/>
                        </center>
                        <p>Please select your feedback category below.</p>
                        <center>
                            <Category/>
                        </center>
                        <center>
                            <hr/>
                        </center>
                        <p>I am pleased to hear your opinion.</p>
                        <center>
                            <Input 
                                inputtype="textarea" 
                                type="text" 
                                name="suggestion/complement" 
                                cols="120" 
                                rows="10" 
                                change={(event)=>{this.OnchangeHandler(event)}} 
                                placeholder="Your Opinion"/>
                        </center>
                        <center>
                            <button 
                                onClick={this.OnsubmitHandler} 
                                className={classes.submit} 
                                disabled={this.state.disable}>
                                submit
                            </button>
                        </center>
                    </form>    
                </div>    
            </Hoc>
        );
    }    
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme,
      category_selected:state.category,
    };
}

export default connect(mapStateToProps,null)(Feedback);