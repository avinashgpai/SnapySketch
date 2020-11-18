import React from 'react';
import classes from '../../styles/Alert.module.css';

const alert = (props) => (  <center>
                                <div 
                                    className={classes.alert} 
                                    style={{
                                        transform:props.show ? 'translateY(0)':'translateY(-100vh)',
                                        opacity : props.show ? '1' : '0'
                                    }}>
                                    {props.children}
                                </div>
                            </center>);

export default alert;