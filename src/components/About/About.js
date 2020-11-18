import React ,{Component} from 'react';
import {connect} from 'react-redux';
import classes from '../../styles/About.module.css';
import AnimatedElement from '../About/Animated_model/Animated_model';
import free from '../../assets/images/free.png';
import free_shadow from '../../assets/images/free_shadow.png';
import easy from '../../assets/images/easy.png';
import easy_shadow from '../../assets/images/easy_shadow.png';
import unlimited from '../../assets/images/unlimited.png';
import unlimited_shadow from '../../assets/images/unlimited_shadow.png';

class About extends Component {

    render(){
        return(
            <div className={this.props.check ? classes.dark:classes.light}>
                <h1>Why choose SnapySketch ?</h1>
                <AnimatedElement/>
                <div className={classes.about}>
                    <hr className={classes.NoDesktop}/>
                    <div className={classes.item}>
                        <div className={classes.img_items}>
                            <img className={classes.first}  src={free} alt='free'/>
                            <img className={classes.second} src={free_shadow} alt='free'/>
                        </div>    
                        <h2>FREE</h2>  
                        <p>
                            Well, what else one needs? Free of cost? Here you have nothing to pay for.     
                        </p>  
                    </div>
                    <hr className={classes.NoDesktop}/>
                    <div className={classes.item}>
                        <div className={classes.img_items}>
                            <img className={classes.first} src={easy} alt='easy'/>
                            <img className={classes.second} src={easy_shadow} alt='easy'/>
                        </div>  
                        <h2>EASY</h2>
                        <p>Multiple sketches can be drawn here in the same platform & Easy to create one. </p>
                    </div>
                    <hr className={classes.NoDesktop}/>
                    <div className={classes.item}>
                        <div className={classes.img_items}>
                            <img className={classes.first} src={unlimited} alt='unlimited'/>
                            <img className={classes.second} src={unlimited_shadow} alt='unlimited'/>
                        </div>  
                        <h2>UNLIMITED</h2>
                        <p>If anything went wrong no need to worry you can edit unlimited on any day.</p>
                    </div>
                </div>    
            </div>
        );
    }    
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme
    };
}

export default connect(mapStateToProps,null)(About);