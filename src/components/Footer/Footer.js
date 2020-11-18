import React,{Component} from 'react';
import classes from '../../styles/Footer.module.css';
import facebook from '../../assets/images/facebook.jpg';
import instagram from '../../assets/images/instagram.jpg';
import linkedin from '../../assets/images/linkedin.png';
import twitter from '../../assets/images/twitter.jpg';
import {connect} from 'react-redux';

class Footer extends Component {
    render(){
        return(
            <center className={classes.footer}>
                <div className={this.props.check ? classes.dark:classes.light}>
                    <footer className={classes.footer_item}>
                        <center>
                            <p>&copy; 2020 Avinash</p>
                            <div className={classes.icons}>
                                <ul>
                                    <li><a href="https://www.facebook.com/profile.php?id=100006718006014"><img src={facebook} alt="facebook"/></a></li>
                                    <li><a href="https://www.instagram.com/supreeth98/"><img src={instagram} alt="instagram"/></a></li>
                                    <li><a href="https://www.linkedin.com/in/avinash-g-pai-95089315b/"><img src={linkedin} alt="linkedin"/></a></li>
                                    <li><a href="https://twitter.com/AvinashGPai"><img src={twitter} alt="twitter"/></a></li>
                                </ul>
                            </div> 
                        </center>      
                    </footer>
                </div>
            </center>
        ); 
    }       
}

const mapStateToProps = state => {
    return {
      check:state.changeTheme
    };
}

export default connect(mapStateToProps,null)(Footer);