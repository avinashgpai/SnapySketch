import React,{Component} from 'react';
import classes from '../../../styles/CreatePolygon.module.css';
import {connect} from 'react-redux';

class Polygon extends Component{

    state = {
        no_of_coordinates:3,
        coordinates_array:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
    }    

    OnchangeHandler = (event) => {
        this.setState({no_of_coordinates:event.target.value});
    }

    coordinateHandler =(event, xy , index) => {
        if(xy ==='x'){
            let copyValues = this.state.coordinates_array.slice();
            copyValues[index][0] = Number(event.target.value);
            this.setState({
                coordinates_array: copyValues
            })
        }
        else{
            let copyValues = this.state.coordinates_array.slice();
            copyValues[index][1] = Number(event.target.value);
            this.setState({
                coordinates_array: copyValues
            })
        }
    }

    onClickHandler = (coordinatesArray,noOfCoor) =>{
        this.props.plot(coordinatesArray.slice(0,noOfCoor));
    }

    render(){

        let coodinates_row_array=[]

        for (let i=0;i<this.state.no_of_coordinates;i++){
            coodinates_row_array.push(<div className={classes.row} key={i}>
                                            <div>Co-ordinate {i+1}</div>
                                            <div className={classes.input}>
                                                <label>X</label>
                                                <input 
                                                    value={this.state.coordinates_array[i][0]} 
                                                    onChange={(event)=>{this.coordinateHandler(event,"x",i)}} 
                                                    min="0" 
                                                    max={this.props.canvasW+''}
                                                    type="range"
                                                />
                                                <div style={{width:'20px'}}>{this.state.coordinates_array[i][0]}</div>
                                            </div>   
                                            <div className={classes.input}> 
                                                <label>Y</label>
                                                <input 
                                                    value={this.state.coordinates_array[i][1]} 
                                                    onChange={(event)=>{this.coordinateHandler(event,"y",i)}} 
                                                    min="0" 
                                                    max={this.props.canvasH+''}
                                                    type="range"
                                                />
                                                <div style={{width:'20px'}}>{this.state.coordinates_array[i][1]}</div>
                                            </div>    
                                      </div>);
        }
        return(
            <div style={{transform:this.props.shape===9 ? 'translateX(0vw)':'translateX(100vw)',
                         transition:'all 0.5s ease'       
                 }} 
                 className={classes.polygon}
            >
                <div>No .of Coordinates</div>
                <input 
                    onChange={(event)=>{this.OnchangeHandler(event)}} 
                    type='range' 
                    min='3' 
                    max='10'
                    value={this.state.no_of_coordinates}
                />
                <span>{this.state.no_of_coordinates}</span>
                <div className={classes.coordinates_set}>
                    {coodinates_row_array}
                </div>

                <div onClick={()=>this.onClickHandler(this.state.coordinates_array,this.state.no_of_coordinates)} className={classes.button}>Plot</div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
      shape:state.shape,
      canvasW:state.canvasW,
      canvasH:state.canvasH
    };
}

export default connect(mapStateToProps,null)(Polygon);