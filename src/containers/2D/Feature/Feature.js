import React from 'react';

const Feature = (props) => {
    return(
        <div style={{height:props.height}} className={props.feature}>
                    <div>{props.name}</div>
                    {props.type==="color" || props.type==="range" ?<input 
                        style={{marginLeft:props.type==="color"?'10px':null}}
                        className={props.range}
                        value={props.value} 
                        onChange={(event)=>props.onchange(event)} 
                        type={props.type}
                        min={props.type==="range"?props.min:null} 
                        max={props.type==="range"?props.max:null} 
                    />:props.children}
                    <div>{props.value}</div>
                </div>
    );
}

export default Feature;