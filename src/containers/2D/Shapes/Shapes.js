import React,{Component} from 'react';
import classes from '../../../styles/Shapes.module.css';
import pencil from '../../../assets/images/pencil.png';
import eraser from '../../../assets/images/eraser.png';
import line from '../../../assets/images/line.png';
import curve from '../../../assets/images/curve.png';
import triangle from '../../../assets/images/triangle.png';
import rectangle from '../../../assets/images/rectangle.png';
import square from '../../../assets/images/square.png';
import circle from '../../../assets/images/circle.png';
import ellipse from '../../../assets/images/ellipse.png';
import polygon from '../../../assets/images/shapes.png';
import move from '../../../assets/images/move.png';
import resize from '../../../assets/images/resize.png';
import {connect} from 'react-redux';
import * as actionType from '../../../store/action';

class Shapes extends Component{

    shapes = [pencil,eraser,line,curve,triangle,rectangle,square,circle,ellipse,polygon,move,resize]
    shapes_name = ['pencil','eraser','line','curve','triangle','rectangle','square','circle','ellipse','polygon','move','resize']

    render(){
        return(
            <center className={classes.Shapes} onMouseMove={()=>this.props.Move()}>
                {this.shapes.map((shape,index) => {
                    return (<img 
                        className={this.props.shape===index?classes.Selected:classes.Shape} 
                        onClick={() =>this.props.ShapeSelected(index)} 
                        alt={this.shapes_name[index]} 
                        title={this.shapes_name[index]}
                        src={shape} 
                        key={index}
                        />);
                })}
            </center>
        );
    }
}

const mapStateToProps = state => {
    return {
      shape:state.shape
    };
}

const mapDispatchToProps = dispatch => {
    return {
      ShapeSelected: (index)=>dispatch({type:actionType.SELECTED_SHAPE,shape:index}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Shapes);