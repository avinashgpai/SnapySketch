import React,{Component,useLayoutEffect,useState} from 'react';
import rough from 'roughjs/bundled/rough.esm';
import classes from '../../styles/TwoD.module.css';
import Shapes from './Shapes/Shapes';
import {connect} from 'react-redux';
import * as actionType from '../../store/action';
import Polygon from './CreatePolygon/CreatePolygon';
import SaveOption from './SaveOptions/SaveOptions';
import save from '../../assets/images/save.png';
import download from '../../assets/images/download.png';
import Feature from './Feature/Feature';

const generator = rough.generator();

let pencilPathSet = []
let curvePathset = []
let start = true;
let count = 0;
let dataURL = null;
let mouseUp = false;
let hoverElement,elementX1,elementX2,elementY1,elementY2 = null;

const createElement = (id,x1,y1,x2,y2,twoDShape,coor,option) => {
    if(twoDShape===0||twoDShape===1){
        curvePathset.splice(0,curvePathset.length);
        if(start){
            pencilPathSet.push([x1,y1]);
            start = false;
            count=count+1; 
        }    
        const next = []
        if(count>1){
            next.push(x2);
            next.push(y2);
            pencilPathSet.push(next);
        }    
        const roughElement = generator.linearPath(pencilPathSet,option);
        return {id,pencilPathSet,twoDShape,roughElement,option};
    }
    else if(twoDShape===2){
        curvePathset.splice(0,curvePathset.length);
        const roughElement = generator.line(x1,y1,x2,y2,option);
        return {id,x1,y1,x2,y2,twoDShape,roughElement,option};
    }
    else if(twoDShape===3){
        if(count<1){
            curvePathset.push([x1,y1]);
            count=count+1;
        }
        if(mouseUp===true){
            curvePathset.push([x2,y2]);
        }
        const roughElement = generator.curve(curvePathset,option);
        return {id,curvePathset,twoDShape,roughElement,option};
    }
    else if(twoDShape===4){
        curvePathset.splice(0,curvePathset.length);
        const roughElement = generator.polygon([[x1,y2], [x2,y2], [(x1+x2)/2,y1]],option);
        return {id,x1,y1,x2,y2,twoDShape,roughElement,option};
    }
    else if(twoDShape===5){
        curvePathset.splice(0,curvePathset.length);
        const roughElement = generator.rectangle(x1,y1,x2-x1,y2-y1,option);
        return {id,x1,y1,x2,y2,twoDShape,roughElement,option};
    }
    else if(twoDShape===6){
        curvePathset.splice(0,curvePathset.length);
        const roughElement = generator.rectangle(x1,y1,x1<x2&&y1<y2?Math.max(x2-x1,y2-y1):x1>x2&&y1<y2?-Math.max(x1-x2,y2-y1):x1>x2&&y1>y2?-Math.max(x1-x2,y1-y2):Math.max(x2-x1,y1-y2),x1<x2&&y1<y2?Math.max(x2-x1,y2-y1):x1>x2&&y1<y2?Math.max(x1-x2,y2-y1):x1>x2&&y1>y2?-Math.max(x1-x2,y1-y2):-Math.max(x2-x1,y1-y2),option);
        return {id,x1,y1,x2,y2,twoDShape,roughElement,option};
    }
    else if(twoDShape===7){
        curvePathset.splice(0,curvePathset.length);
        const roughElement = generator.circle(x1,y1,x1<x2&&y1<y2?Math.max(x2-x1,y2-y1)*2:x1>x2&&y1<y2?-Math.max(x1-x2,y2-y1)*2:x1>x2&&y1>y2?-Math.max(x1-x2,y1-y2)*2:Math.max(x2-x1,y1-y2)*2,option);
        return {id,x1,y1,x2,y2,twoDShape,roughElement,option};
    }
    else if(twoDShape===8){
        curvePathset.splice(0,curvePathset.length);
        const roughElement = generator.ellipse(x1,y1,(x2-x1)*2,(y2-y1)*2,option);
        return {id,x1,y1,x2,y2,twoDShape,roughElement,option};
    }
    else if(twoDShape===9){
        curvePathset.splice(0,curvePathset.length);
        const roughElement = generator.polygon(coor.map(xy => {return ([xy[0],xy[1]])}),option);
        return {id,coor,twoDShape,roughElement,option};
    }
}

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const isWithInElements = (x,y,element) => {
    const {twoDShape} = element;
    if(twoDShape===2){
        const {x1,x2,y1,y2} = element;
        const a = { x: x1, y: y1 };
        const b = { x: x2, y: y2 };
        const c = { x, y };
        const offset = distance(a, b) - (distance(a, c) + distance(b, c));
        return Math.abs(offset)<1;
    }
    else if(twoDShape===4||twoDShape===5||twoDShape===6||twoDShape===7||twoDShape===8){
        const {x1,x2,y1,y2} = element;
        const minX = Math.min(x1,x2);
        const maxX = Math.max(x1,x2);
        const minY = Math.min(y1,y2);
        const maxY = Math.max(y1,y2);
        if(twoDShape===4||twoDShape===5){
            return x >= minX && x <= maxX && y >= minY && y <= maxY; 
        }
        else if(twoDShape===6){
            return x >=(x1>x2&&y1<y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY):minX):x1>x2&&y1>=y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY):minX):minX) && 
                   x <=(x1<x2&&y1<y2?((maxY-minY)>(maxX-minX)?minX+maxY-minY:maxX):x1<x2&&y1>=y2?((maxY-minY)>(maxX-minX)?minX+maxY-minY:maxX):maxX) && 
                   y >=(x1<x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX):minY):x1>=x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX):minY):minY) && 
                   y <=(x1<x2&&y1<y2?((maxX-minX)>(maxY-minY)?minY+maxX-minX:maxY):x1>=x2&&y1<y2?((maxX-minX)>(maxY-minY)?minY+maxX-minX:maxY):maxY);
        }
        else if(twoDShape===7){
            return x >=(x1>x2&&y1<y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY):minX):x1>x2&&y1>=y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY):minX):minX-((maxX-minX>maxY-minY)?maxX-minX:maxY-minY)) && 
                   x <=(x1<x2&&y1<y2?((maxY-minY)>(maxX-minX)?minX+maxY-minY:maxX):x1<x2&&y1>=y2?((maxY-minY)>(maxX-minX)?minX+maxY-minY:maxX):maxX+((maxX-minX>maxY-minY)?maxX-minX:maxY-minY)) && 
                   y >=(x1<x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX):minY):x1>=x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX):minY):minY-((maxX-minX>maxY-minY)?maxX-minX:maxY-minY)) && 
                   y <=(x1<x2&&y1<y2?((maxX-minX)>(maxY-minY)?minY+maxX-minX:maxY):x1>=x2&&y1<y2?((maxX-minX)>(maxY-minY)?minY+maxX-minX:maxY):maxY+((maxX-minX>maxY-minY)?maxX-minX:maxY-minY));
    
        }
        else if(twoDShape===8){
            return x >= (x1<x2?minX-(maxX-minX):minX) && 
                   x <= (x1<x2?maxX:maxX+(maxX-minX)) && 
                   y >= (y1<y2?minY-(maxY-minY):minY) && 
                   y <= (y1<y2?maxY:maxY+(maxY-minY)); 
    
        }
    }
    else if(twoDShape===9){
        const {coor} = element;
        const x_array = [];
        const y_array = [];
        coor.map(coordinate => {
            x_array.push(coordinate[0]);
            y_array.push(coordinate[1]);
            return null;
        });
        const minX = Math.min(...x_array);
        const maxX = Math.max(...x_array);
        const minY = Math.min(...y_array);
        const maxY = Math.max(...y_array);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
}

const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}

const isNear = (x,y,element) => {
    const {twoDShape} = element;
    if(twoDShape===2){
        const {x1,x2,y1,y2} = element;
        const start = nearPoint(x, y, x1, y1, "start");
        const end = nearPoint(x, y, x2, y2, "end");
        let direction = null;
        if(x1<x2 && start){
            if(y1<y2){
                direction = "tl";
            }
            else{
                direction = "bl";
            }
        }else if(x1>x2 && start){
            if(y1<y2){
                direction = "tr";
            }
            else{
                direction = "br";
            }
        }
        else if(x1<x2 && end){
            if(y1<y2){
                direction = "br";
            }
            else{
                direction = "tr";
            }
        }else if(x1>x2 && end){
            if(y1<y2){
                direction = "bl";
            }
            else{
                direction = "tl";
            }
        }
        return direction;
    }
    else if(twoDShape===4||twoDShape===5||twoDShape===6||twoDShape===7||twoDShape===8){
        const {x1,x2,y1,y2} = element;
        const minX = Math.min(x1,x2);
        const maxX = Math.max(x1,x2);
        const minY = Math.min(y1,y2);
        const maxY = Math.max(y1,y2);
        if(twoDShape===4||twoDShape===5){
            const topLeft = nearPoint(x, y, minX, minY, "tl");
            const topRight = nearPoint(x, y, maxX, minY, "tr");
            const bottomLeft = nearPoint(x, y, minX, maxY, "bl");
            const bottomRight = nearPoint(x, y, maxX, maxY, "br");
            return topLeft || topRight || bottomLeft || bottomRight;
        }
        else if(twoDShape===6||twoDShape===7||twoDShape===8){
            let resize_minx = null;
            let resize_maxx = null;
            let resize_miny = null;
            let resize_maxy = null;
            if(twoDShape===6){
                resize_minx = (x1>x2&&y1<y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY):minX):x1>x2&&y1>=y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY):minX):minX) ;
                resize_maxx = (x1<x2&&y1<y2?((maxY-minY)>(maxX-minX)?minX+maxY-minY:maxX):x1<x2&&y1>=y2?((maxY-minY)>(maxX-minX)?minX+maxY-minY:maxX):maxX) ;
                resize_miny = (x1<x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX):minY):x1>=x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX):minY):minY) ; 
                resize_maxy = (x1<x2&&y1<y2?((maxX-minX)>(maxY-minY)?minY+maxX-minX:maxY):x1>=x2&&y1<y2?((maxX-minX)>(maxY-minY)?minY+maxX-minX:maxY):maxY);
            }
            else if(twoDShape===7){
                resize_minx = (x1>x2&&y1<y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY):minX):x1>x2&&y1>=y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY):minX):minX-((maxX-minX>maxY-minY)?maxX-minX:maxY-minY)) ;
                resize_maxx = (x1<x2&&y1<y2?((maxY-minY)>(maxX-minX)?minX+maxY-minY:maxX):x1<x2&&y1>=y2?((maxY-minY)>(maxX-minX)?minX+maxY-minY:maxX):maxX+((maxX-minX>maxY-minY)?maxX-minX:maxY-minY)) ; 
                resize_miny = (x1<x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX):minY):x1>=x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX):minY):minY-((maxX-minX>maxY-minY)?maxX-minX:maxY-minY)) ;
                resize_maxy = (x1<x2&&y1<y2?((maxX-minX)>(maxY-minY)?minY+maxX-minX:maxY):x1>=x2&&y1<y2?((maxX-minX)>(maxY-minY)?minY+maxX-minX:maxY):maxY+((maxX-minX>maxY-minY)?maxX-minX:maxY-minY));
            }
            else if(twoDShape===8){
                resize_minx = (x1<x2?minX-(maxX-minX):minX) ;
                resize_maxx = (x1<x2?maxX:maxX+(maxX-minX)) ; 
                resize_miny = (y1<y2?minY-(maxY-minY):minY) ; 
                resize_maxy = (y1<y2?maxY:maxY+(maxY-minY)); 
            }
        const topLeft = nearPoint(x, y, resize_minx, resize_miny, "tl");
        const topRight = nearPoint(x, y, resize_maxx, resize_miny, "tr");
        const bottomLeft = nearPoint(x, y, resize_minx, resize_maxy, "bl");
        const bottomRight = nearPoint(x, y, resize_maxx, resize_maxy, "br");
        return topLeft || topRight || bottomLeft || bottomRight;
        }
    }
    else if(twoDShape===9){
        const {coor} = element;
        const x_array = [];
        const y_array = [];
        coor.map(coordinate => {
            x_array.push(coordinate[0]);
            y_array.push(coordinate[1]);
            return null;
        });
        const minX = Math.min(...x_array);
        const maxX = Math.max(...x_array);
        const minY = Math.min(...y_array);
        const maxY = Math.max(...y_array);
        const topLeft = nearPoint(x, y, minX, minY, "tl");
        const topRight = nearPoint(x, y, maxX, minY, "tr");
        const bottomLeft = nearPoint(x, y, minX, maxY, "bl");
        const bottomRight = nearPoint(x, y, maxX, maxY, "br");
        return topLeft || topRight || bottomLeft || bottomRight;
    }
}

const getElementAtPosition = (x,y,elements) => {
    return elements.find(element => isWithInElements(x,y,element));
}

const getElementDirection = (x,y,elements) => {
    return elements.map(element => ({ ...element, position:isNear(x, y, element) }))
                   .find(element => element.position !== null);
}

const getCursorDirection = position => {
    switch (position) {
      case "tl":
      case "br":
        return "nwse-resize";
      case "tr":
      case "bl":
        return "nesw-resize";
      default:
        return "auto";
    }
}

const resizedCoordinates = (twoDShape, clientX, clientY, position, coordinates) => {
    if(twoDShape!==9){
        const { x1, y1, x2, y2 } = coordinates;
        if(twoDShape===2||twoDShape===4||twoDShape===5||twoDShape===6){
            switch (position) {
                case "tl":
                    return { x1: x1<x2?clientX:x1, y1: y1<y2?clientY:y1, x2:x1<x2?x2:clientX, y2:y1<y2?y2:clientY };
                case "tr":
                    return { x1: x1<x2?x1:clientX, y1: y1<y2?clientY:y1, x2: x1<x2?clientX:x2, y2: y1<y2?y2:clientY };
                case "bl":
                    return { x1: x1<x2?clientX:x1, y1 :y1<y2?y1:clientY , x2: x1<x2?x2:clientX, y2: y1<y2?clientY:y2 };
                case "br":
                    return { x1: x1<x2?x1:clientX, y1 :y1<y2?y1:clientY, x2: x1<x2?clientX:x2, y2: y1<y2?clientY:y2 };
                default:
                    return null; //should not really get here...
            }
        }
        else if(twoDShape===7||twoDShape===8){
            switch (position) {
                case "tl":
                    console.log("tl")
                    return { x1: x1, y1: y1, x2: clientX, y2: clientY };
                case "tr":
                    return { x1: x1, y1: y1, x2: clientX, y2: clientY };
                case "bl":
                    return { x1: x1, y1 :y1, x2: clientX, y2: clientY };
                case "br":
                    return { x1: x1, y1 :y1, x2: clientX, y2: clientY };
                default:
                    return null; //should not really get here...
            }
        }
    }   
}

const TwoD = (props) =>{
    const [elements,setElement] = useState([]);
    const [selectedElement,setSelectedElement] = useState(null);
    const [resizeElement,setResizingElement] = useState(null);
    const [action,setAction] = useState('none');
    const [canvasW,setWidth] = useState(0);
    const [canvasH,setHeight] = useState(0);
    const [offsetLeft,setLeft] = useState(0);
    const [offsetTop,setTop] = useState(0);
    const [canvas_save,setSave] = useState(true);
    const [strokeWidth,setStrokeWidth] = useState(1);
    const [strokeColor,setStrokeColor] = useState('#000000');
    const [fillColor,setFillColor] = useState('#000000');
    const [fillStyle,setFillStyle] = useState('solid');
    const [fillStripWidth,setFillStripWidth] = useState(1);
    const [fillStripGap,setFillStripGap] = useState(0);
    const [fillStripAngle,setFillStripAngle] = useState(1);
    
    useLayoutEffect(() => {
        const canvas = document.getElementById('twoD');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);

        let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
        let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

        canvas.setAttribute('height', style_height * window.devicePixelRatio);
        canvas.setAttribute('width', style_width * window.devicePixelRatio);

        const roughCanvas = rough.canvas(canvas);
        ctx.fillStyle = props.save===0?'transparent':'white';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        elements.forEach(({roughElement})=> roughCanvas.draw(roughElement)); 
        
    },[elements,props.save,selectedElement]);

    const updateElement = (index,x1,y1,x2,y2,shape,coor,option) => {
        const updatedElement =  shape===0?
                                        createElement(index,x1,y1,x2,y2,shape,coor,option)
                                        :shape===1?
                                        createElement(index,x1,y1,x2,y2,shape,coor,option)
                                        :createElement(index,x1,y1,x2,y2,shape,coor,option);
        const elementCopy = [...elements];
        elementCopy[index] = updatedElement;
        setElement(elementCopy);
    } 

    const elementBoundry = (ctx,clientX,clientY) => {
        if(getElementAtPosition(clientX-offsetLeft,clientY-offsetTop,elements)){
            const element = getElementAtPosition(clientX-offsetLeft,clientY-offsetTop,elements);
            const x_array = [];
            const y_array = [];
            if(element.twoDShape===9){
                const {coor} = element;
                coor.map(coordinate => {
                    x_array.push(coordinate[0]);
                    y_array.push(coordinate[1]);
                    return null;
                });
            }
            const x1 = element.x1;
            const x2 = element.x2;
            const y1 = element.y1;
            const y2 = element.y2;
            const minX = element.twoDShape!==9?Math.min(x1,x2):Math.min(...x_array);
            const maxX = element.twoDShape!==9?Math.max(x1,x2):Math.max(...x_array);
            const minY = element.twoDShape!==9?Math.min(y1,y2):Math.min(...y_array);
            const maxY = element.twoDShape!==9?Math.max(y1,y2):Math.max(...y_array);

            ctx.setLineDash([4, 2]);
            ctx.lineDashOffset = 5;
            const offset = element.option.strokeWidth<5?5:element.option.strokeWidth<10?10:15;
            if(hoverElement!==element.id && hoverElement!==null){
                ctx.strokeStyle = 'white';
                
                if((element.twoDShape===2||element.twoDShape===4||element.twoDShape===5) && (elementX1!==(x1<=x2?x1-offset:x2-offset) && elementX2!==(x1<=x2?(x2-x1)+(offset*2):-(x2-x1)+(offset*2)) && elementY1!==(y1<=y2?y1-offset:y2-offset) && elementY2!==(y1<=y2?(y2-y1)+(offset*2):-(y2-y1)+(offset*2)))){
                    ctx.strokeRect(elementX1, elementY1, elementX2, elementY2);
                }
                else if(element.twoDShape===6 && 
                       (elementX1 !== (x1>x2&&y1<y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY)-offset:minX-offset):x1>x2&&y1>=y2?maxX+offset:minX-offset)) && 
                       (elementX2 !== (x1<x2&&y1<y2?((maxY-minY)>(maxX-minX)?maxY-minY+(offset*2):maxX-minX+(offset*2)):x1<x2&&y1>=y2?((maxY-minY)>(maxX-minX)?maxY-minY+(offset*2):maxX-minX+(offset*2)):x1>=x2&&y1<y2?(maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2):(maxX-minX)<(maxY-minY)?-(maxY-minY)-(offset*2):-(maxX-minX)-(offset*2))) &&
                       (elementY1 !== (x1<x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX)-offset:minY-offset):x1>=x2&&y1>y2?maxY+offset:minY-offset)) &&
                       (elementY2 !== (x1<x2&&y1<y2?((maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2)):x1>=x2&&y1<y2?((maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2)):x1<x2&&y1>=y2?(maxX-minX)<(maxY-minY)?maxY-minY+(offset*2):maxX-minX+(offset*2):(maxX-minX)>(maxY-minY)?-(maxX-minX)-(offset*2):-(maxY-minY)-(offset*2)))
                       ){
                    ctx.strokeRect(elementX1, elementY1, elementX2, elementY2);
                }
                else if(element.twoDShape===7 && (
                        elementX1 !== (x1>x2?(maxX-minX)<(maxY-minY)?maxX+(maxY-minY)+offset:maxX+(maxX-minX)+offset:(maxX-minX)<(maxY-minY)?minX-(maxY-minY)-offset:minX-(maxX-minX)-(offset)) &&
                        elementX2 !== (x1>x2?(maxX-minX)<(maxY-minY)?-2*(maxY-minY)-(2*offset):-2*(maxX-minX)-(2*offset):(maxX-minX)<(maxY-minY)?2*(maxY-minY)+(2*offset):2*(maxX-minX)+(2*offset)) &&
                        elementY1 !== (y1>y2?(maxX-minX)<(maxY-minY)?maxY+(maxY-minY)+offset:maxY+(maxX-minX)+offset:(maxX-minX)<(maxY-minY)?maxY-(2*(maxY-minY))-offset:minY-(maxX-minX)-offset) &&
                        elementY2 !== (y1>y2?(maxX-minX)<(maxY-minY)?-2*(maxY-minY)-(2*offset):-2*(maxX-minX)-(2*offset):(maxX-minX)<(maxY-minY)?2*(maxY-minY)+(2*offset):2*(maxX-minX)+(2*offset)))){
                    ctx.strokeRect(elementX1, elementY1, elementX2, elementY2);
                }    
                else if(element.twoDShape===8 && (
                        elementX1 !== (x1<x2?minX-(maxX-minX)-offset:minX-offset) &&
                        elementX2 !== (2*(maxX-minX)+(offset*2)) &&
                        elementY1 !== (y1<y2?minY-(maxY-minY)-offset:minY-offset) &&
                        elementY2 !== (2*(maxY-minY)+(offset*2)))){
                    ctx.strokeRect(elementX1, elementY1, elementX2, elementY2);
                }
                else if(element.twoDShape===9 && (elementX1!==minX-offset && elementX2!==(maxX-minX)+(2*offset) && elementY1 !== minY-offset && elementY2 !== (maxY-minY)+(2*offset))){
                    ctx.strokeRect(elementX1, elementY1, elementX2, elementY2);
                }
            }  
            else if(hoverElement===null||hoverElement===element.id){
                ctx.strokeStyle = 'rgb(0,0,0)';
                if(element.twoDShape===2||element.twoDShape===4||element.twoDShape===5){
                    
                    ctx.strokeRect(x1<=x2?x1-offset:x2-offset , y1<=y2?y1-offset:y2-offset , x1<=x2?(x2-x1)+(offset*2):-(x2-x1)+(offset*2) , y1<=y2?(y2-y1)+(offset*2):-(y2-y1)+(offset*2));
                    elementX1 = x1<=x2?x1-offset:x2-offset;
                    elementX2 = x1<=x2?(x2-x1)+(offset*2):-(x2-x1)+(offset*2);
                    elementY1 = y1<=y2?y1-offset:y2-offset;
                    elementY2 = y1<=y2?(y2-y1)+(offset*2):-(y2-y1)+(offset*2);
                }
                else if(element.twoDShape===6){
                    ctx.strokeRect(x1>x2&&y1<y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY)-offset:minX-offset):x1>x2&&y1>=y2?maxX+offset:minX-offset,
                                   x1<x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX)-offset:minY-offset):x1>=x2&&y1>y2?maxY+offset:minY-offset,
                                   x1<x2&&y1<y2?((maxY-minY)>(maxX-minX)?maxY-minY+(offset*2):maxX-minX+(offset*2)):x1<x2&&y1>=y2?((maxY-minY)>(maxX-minX)?maxY-minY+(offset*2):maxX-minX+(offset*2)):x1>=x2&&y1<y2?(maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2):(maxX-minX)<(maxY-minY)?-(maxY-minY)-(offset*2):-(maxX-minX)-(offset*2),
                                   x1<x2&&y1<y2?((maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2)):x1>=x2&&y1<y2?((maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2)):x1<x2&&y1>=y2?(maxX-minX)<(maxY-minY)?maxY-minY+(offset*2):maxX-minX+(offset*2):(maxX-minX)>(maxY-minY)?-(maxX-minX)-(offset*2):-(maxY-minY)-(offset*2));
                                   
                    elementX1 = x1>x2&&y1<y2?((maxX-minX)<(maxY-minY)?maxX-(maxY-minY)-offset:minX-offset):x1>x2&&y1>=y2?maxX+offset:minX-offset;
                    elementX2 = x1<x2&&y1<y2?((maxY-minY)>(maxX-minX)?maxY-minY+(offset*2):maxX-minX+(offset*2)):x1<x2&&y1>=y2?((maxY-minY)>(maxX-minX)?maxY-minY+(offset*2):maxX-minX+(offset*2)):x1>=x2&&y1<y2?(maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2):(maxX-minX)<(maxY-minY)?-(maxY-minY)-(offset*2):-(maxX-minX)-(offset*2);
                    elementY1 = x1<x2&&y1>y2?((maxY-minY)<(maxX-minX)?maxY-(maxX-minX)-offset:minY-offset):x1>=x2&&y1>y2?maxY+offset:minY-offset;
                    elementY2 = x1<x2&&y1<y2?((maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2)):x1>=x2&&y1<y2?((maxX-minX)>(maxY-minY)?maxX-minX+(offset*2):maxY-minY+(offset*2)):x1<x2&&y1>=y2?(maxX-minX)<(maxY-minY)?maxY-minY+(offset*2):maxX-minX+(offset*2):(maxX-minX)>(maxY-minY)?-(maxX-minX)-(offset*2):-(maxY-minY)-(offset*2);
                }   
                else if(element.twoDShape===7){
                    ctx.strokeRect(x1>x2?(maxX-minX)<(maxY-minY)?maxX+(maxY-minY)+offset:maxX+(maxX-minX)+offset:(maxX-minX)<(maxY-minY)?minX-(maxY-minY)-offset:minX-(maxX-minX)-(offset),
                                   y1>y2?(maxX-minX)<(maxY-minY)?maxY+(maxY-minY)+offset:maxY+(maxX-minX)+offset:(maxX-minX)<(maxY-minY)?maxY-(2*(maxY-minY))-offset:minY-(maxX-minX)-offset,
                                   x1>x2?(maxX-minX)<(maxY-minY)?-2*(maxY-minY)-(2*offset):-2*(maxX-minX)-(2*offset):(maxX-minX)<(maxY-minY)?2*(maxY-minY)+(2*offset):2*(maxX-minX)+(2*offset),
                                   y1>y2?(maxX-minX)<(maxY-minY)?-2*(maxY-minY)-(2*offset):-2*(maxX-minX)-(2*offset):(maxX-minX)<(maxY-minY)?2*(maxY-minY)+(2*offset):2*(maxX-minX)+(2*offset));
                                   
                    elementX1 = x1>x2?(maxX-minX)<(maxY-minY)?maxX+(maxY-minY)+offset:maxX+(maxX-minX)+offset:(maxX-minX)<(maxY-minY)?minX-(maxY-minY)-offset:minX-(maxX-minX)-(offset);
                    elementX2 = x1>x2?(maxX-minX)<(maxY-minY)?-2*(maxY-minY)-(2*offset):-2*(maxX-minX)-(2*offset):(maxX-minX)<(maxY-minY)?2*(maxY-minY)+(2*offset):2*(maxX-minX)+(2*offset);
                    elementY1 = y1>y2?(maxX-minX)<(maxY-minY)?maxY+(maxY-minY)+offset:maxY+(maxX-minX)+offset:(maxX-minX)<(maxY-minY)?maxY-(2*(maxY-minY))-offset:minY-(maxX-minX)-offset;
                    elementY2 = y1>y2?(maxX-minX)<(maxY-minY)?-2*(maxY-minY)-(2*offset):-2*(maxX-minX)-(2*offset):(maxX-minX)<(maxY-minY)?2*(maxY-minY)+(2*offset):2*(maxX-minX)+(2*offset);
                }
                else if(element.twoDShape===8){
                    ctx.strokeRect(x1<x2?minX-(maxX-minX)-offset:minX-offset , y1<y2?minY-(maxY-minY)-offset:minY-offset , 2*(maxX-minX)+(offset*2) , 2*(maxY-minY)+(offset*2));

                    elementX1 = x1<x2?minX-(maxX-minX)-offset:minX-offset;
                    elementX2 = 2*(maxX-minX)+(offset*2);
                    elementY1 = y1<y2?minY-(maxY-minY)-offset:minY-offset;
                    elementY2 = 2*(maxY-minY)+(offset*2);
                }
                else if(element.twoDShape===9){
                    ctx.strokeRect(minX-offset,minY-offset,(maxX-minX)+(2*offset),(maxY-minY)+(2*offset));
                    elementX1 = minX-offset;
                    elementX2 = (maxX-minX)+(2*offset);
                    elementY1 = minY-offset;
                    elementY2 = (maxY-minY)+(2*offset);
                } 
            }
              
            hoverElement = element.id;
        }
    }
    
    const handleMouseDown = (event) => {
        let {clientX,clientY} = event;
        if(props.shape===10){
            const element = getElementAtPosition(clientX-offsetLeft,clientY-offsetTop,elements);
            if(element){
                if(element.twoDShape!==9){
                    const offsetX = clientX-offsetLeft-element.x1;
                    const offsetY = clientY-offsetTop-element.y1;
                    setSelectedElement({...element,offsetX,offsetY});
                }
                else{
                    let i;
                    const setCoordinates = [];
                    const {coor} = element;
                    for (i = 0; i < coor.length; i++) {
                        const offsetX = clientX-offsetLeft-coor[i][0];
                        const offsetY = clientY-offsetTop-coor[i][1];
                        setCoordinates.push([offsetX,offsetY]);
                    }
                    setSelectedElement({...element,setCoordinates});
                }    
                setAction("moving");
            }
        }
        else if(props.shape===11){
            const element = getElementDirection(clientX-offsetLeft,clientY-offsetTop,elements);
            if(element){
                    if(element.twoDShape!==9){
                        const offsetX = clientX-offsetLeft-element.x1;
                        const offsetY = clientY-offsetTop-element.y1;
                        setResizingElement({...element,offsetX,offsetY});
                    }
                    else{
                        let i;
                        const setCoordinates = [];
                        const {coor} = element;
                        for (i = 0; i < coor.length; i++) {
                            const offsetX = clientX-offsetLeft-coor[i][0];
                            const offsetY = clientY-offsetTop-coor[i][1];
                            setCoordinates.push([offsetX,offsetY]);
                        }
                        setResizingElement({...element,setCoordinates});
                    }    
                setAction("resizing");
            }
        }
        else{
            const id = elements.length; 
            let option = {fill:fillColor,fillStyle:fillStyle,fillWeight:fillStripWidth,hachureAngle:fillStripAngle,stroke:props.shape===1?'white':strokeColor,strokeWidth:strokeWidth,seed:1000000};
            if((props.shape!==4&&props.shape!==5&&props.shape!==6&&props.shape!==9) && option.hasOwnProperty('hachureGap')){
                delete option.hachureGap;
            }
            else if((props.shape===4||props.shape===5||props.shape===6||props.shape===9) && !option.hasOwnProperty('hachureGap')){
                option.hachureGap = fillStripGap;
            }
            const element =  props.shape===0?
                                createElement(id,clientX-offsetLeft,clientY-offsetTop+30,clientX-offsetLeft,clientY-offsetTop+30,props.shape,null,option)
                                :createElement(id,clientX-offsetLeft,clientY-offsetTop,clientX-offsetLeft,clientY-offsetTop,props.shape,null,option);
            setElement(prevState => [...prevState,element]);    
            setAction("drawing");    
        }      
    }

    const handleMouseMove = (event) => {
        const canvas = document.getElementById('twoD');
        const ctx = canvas.getContext('2d');
        let {clientX,clientY} = event;
        if(props.shape===10){
            event.target.style.cursor=getElementAtPosition(clientX-offsetLeft,clientY-offsetTop,elements)?"move":"auto";
            elementBoundry(ctx,clientX,clientY);
        }
        else if(props.shape===11){
            const element = getElementDirection(clientX-offsetLeft,clientY-offsetTop,elements);
            event.target.style.cursor = element? getCursorDirection(element.position):'auto';
            elementBoundry(ctx,clientX,clientY);
        }
        else{
            event.target.style.cursor=null;
        }
        if(action==="drawing"){
            mouseUp=false;
            if(props.shape===1 && props.save===0){
                ctx.clearRect(clientX-offsetLeft+(20-strokeWidth)/2,clientY-offsetTop+20,strokeWidth,strokeWidth,fillStripWidth,fillStripGap,fillStripAngle);
            }
            else{
                const index = elements.length-1;
                const {x1,y1} = elements[index];
                let option = {fill:fillColor,fillStyle:fillStyle,fillWeight:fillStripWidth,hachureAngle:fillStripAngle,stroke:props.shape===1?'white':strokeColor,strokeWidth:strokeWidth,seed:1000000};
                if((props.shape!==4&&props.shape!==5&&props.shape!==6&&props.shape!==9) && option.hasOwnProperty('hachureGap')){
                    delete option.hachureGap;
                }
                else if((props.shape===4||props.shape===5||props.shape===6||props.shape===9) && !option.hasOwnProperty('hachureGap')){
                    option.hachureGap = fillStripGap;
                }
                updateElement(index,x1,y1,props.shape===0?clientX-offsetLeft:props.shape===1?clientX-offsetLeft+(20-strokeWidth)/2:clientX-offsetLeft,props.shape===0?clientY-offsetTop+30:props.shape===1?clientY-offsetTop+20:clientY-offsetTop,props.shape,null,option);
            }
        }
        else if(action==="moving"){
            const {id,twoDShape,option,offsetX,offsetY} = selectedElement;
            const updatedX = clientX-offsetX-offsetLeft;
            const updatedY = clientY-offsetY-offsetTop;
            if(twoDShape!==9){
                const {x1,x2,y1,y2} = selectedElement;
                let width = x2-x1;
                let height = y2-y1;
                updateElement(id,updatedX,updatedY,props.shape===0?updatedX+width:props.shape===1?updatedX+width+(20-strokeWidth)/2:updatedX+width,props.shape===0?updatedY+30+height:props.shape===1?updatedY+20+height:updatedY+height,twoDShape,null,option);
            }
            else{
                const {setCoordinates} = selectedElement;
                const coordinates = [];
                let i;
                for (i = 0; i < setCoordinates.length; i++) {
                    const xy = [clientX-setCoordinates[i][0]-offsetLeft,clientY-setCoordinates[i][1]-offsetTop];
                    coordinates.push(xy);
                }
                updateElement(id,0,0,0,0,twoDShape,coordinates,option);
            }    
        }
        else if(action==="resizing"){
            const {twoDShape} = resizeElement;
            if(twoDShape!==9){
                const { id, position, option,...coordinates } = resizeElement;
                const { x1, y1, x2, y2 } = resizedCoordinates(twoDShape, clientX-offsetLeft, clientY-offsetTop, position, coordinates);
                updateElement(id, x1, y1, x2, y2, twoDShape,null,option);
            }
            else{
                const { id, position, option, coor} = resizeElement;
                const x_array = [];
                const y_array = [];
                coor.map(coordinate => {
                    x_array.push(coordinate[0]);
                    y_array.push(coordinate[1]);
                    return null;
                });
                const minX = Math.min(...x_array);
                const maxX = Math.max(...x_array);
                const minY = Math.min(...y_array);
                const maxY = Math.max(...y_array);
                let minx_id = 0;
                let miny_id = 0;
                let maxx_id = 0;
                let maxy_id = 0;
                coor.map((coordinate,index) =>{
                    if(coordinate[0]===minX){
                        minx_id = index;
                    }
                    else if(coordinate[0]===maxX){
                        maxx_id = index;
                    }
                    else if(coordinate[1]===minY){
                        miny_id = index;
                    }
                    else if(coordinate[1]===maxY){
                        maxy_id = index;
                    }
                    return null;
                });
                coor[(position==="tl"||position==="bl")?minx_id:maxx_id][0] = clientX - offsetLeft;
                coor[(position==="tl"||position==="tr")?miny_id:maxy_id][1] = clientY - offsetTop; 
                updateElement(id,0,0,0,0,twoDShape,coor,option);
            }
            
        } 
    } 

    const handleMouseUp = () => {
        start = true;
        mouseUp = true;
        pencilPathSet.splice(0,pencilPathSet.length);
        setAction('none');
        setSelectedElement(null);
    }

    const polygonHandler = (coor) => {
        let option = {fill:fillColor,fillStyle:fillStyle,fillWeight:fillStripWidth,hachureAngle:fillStripAngle,hachureGap:fillStripGap,stroke:strokeColor,strokeWidth:strokeWidth,seed:1000000};
        const id = elements.length;
        const element = createElement(id,0,0,0,0,props.shape,coor,option);
        setElement(prevState => [...prevState,element]);
    }

    const handleSave = () => {
        const canvasDownload = document.getElementById('twoD');
        dataURL = canvasDownload.toDataURL(props.save===0?'image/png':'image/jpeg');
        setSave(false);
    }

    const handleDownload = () => {
        const button = document.getElementById('download');
        button.href = dataURL;
        setSave(true);
    }

    const handleFeature = (event,feature) => {
        if(feature==='strokeWidth'){setStrokeWidth(event.target.value);}
        if(feature==='strokeColor'){setStrokeColor(event.target.value);}
        if(feature==='fillColor'){setFillColor(event.target.value);}
        if(feature==='fillStyle'){setFillStyle(event.target.value);}
        if(feature==='fillStripWidth'){setFillStripWidth(event.target.value);}
        if(feature==='fillStripGap'){setFillStripGap(event.target.value);}
        if(feature==='fillStripAngle'){setFillStripAngle(event.target.value);}
    } 

    return(
        <center className={classes.wholeSet}>
            <Shapes Move = {()=>props.move(canvasW,canvasH)} />
            <div className={classes.option}>
                {canvas_save?
                    <button className={classes.save} onClick={()=>handleSave()} title="save">
                        <img 
                            src={save} 
                            alt="save" 
                            className={classes.img}
                        />
                    </button>:
                    <a href="/#" id="download" download={props.save===0?'SnapySktech.png':'SnapySketch.jpg'} title="download">
                        <button className={classes.download} onClick={()=>handleDownload()}>
                            <img 
                                src={download} 
                                alt="download"
                                className={classes.img} 
                            />
                        </button>
                    </a>
                }
                <SaveOption/>
                <Feature height="120px" feature={classes.feature} range={classes.Range} value={strokeWidth} type="range" name="Stroke Width" onchange={(event)=>handleFeature(event,"strokeWidth")} min="1" max="20"/>
                <Feature height="125px" feature={classes.feature} range={classes.Range} value={fillStripWidth} type="range" name="Strip width" onchange={(event)=>handleFeature(event,"fillStripWidth")} min="1" max="5"/>
            </div>
            <div className={classes.option}>
                <Feature feature={classes.feature} value={fillColor} type="color" name="Fill Color" onchange={(event)=>handleFeature(event,"fillColor")}/>
                <Feature feature={classes.feature} value={strokeColor} type="color" name="Stroke Color" onchange={(event)=>handleFeature(event,"strokeColor")}/>
                <Feature feature={classes.feature} range={classes.Range} value={fillStyle} name="Fill Style" onchange={(event)=>handleFeature(event,"fillStyle")}>
                    <select style={{width:'70px'}} name="fillstyle" onChange={(event)=>handleFeature(event,"fillStyle")}>
                        <option value="solid">Solid</option>
                        <option value="hachure">Hachure</option>
                        <option value="zigzag">ZigZag</option>
                        <option value="cross-hatch">Cross-hatch</option>
                        <option value="dots">Dots</option>
                        <option value="dashed">Dash</option>
                        <option value="zigzag-line">ZigZag-line</option>
                    </select>
                </Feature>    
                <Feature height="110px" feature={classes.feature} range={classes.Range} value={fillStripGap} type="range" name="Strip gap" onchange={(event)=>handleFeature(event,"fillStripGap")} min="0" max="4"/>
                <Feature height="120px" feature={classes.feature} range={classes.Range} value={fillStripAngle} type="range" name="Strip angle" onchange={(event)=>handleFeature(event,"fillStripAngle")} min="0" max="359"/>
            </div>   
            <div
                ref={el => {
                    if (!el) return;
                    setLeft(el.getBoundingClientRect().left);
                    setTop(el.getBoundingClientRect().top);
                    setWidth(el.getBoundingClientRect().width);
                    setHeight(el.getBoundingClientRect().height);
                }}
                onMouseDown = {props.shape!==9?handleMouseDown:null}
                onMouseUp = {props.shape!==9?handleMouseUp:null}
                onMouseMove = {props.shape!==9?handleMouseMove:null}
                className={(props.shape===10||props.shape===11)?classes.moveResize:props.shape===0?classes.pencil:props.shape===1?classes.eraser:classes.TwoD}
            >
                <canvas 
                    id="twoD" 
                    style={{width:'100%',height:'100%'}}
                >
                </canvas>
            </div>
            <Polygon plot={(coor)=>polygonHandler(coor)}/>
        </center>       
    );

}

class TwoDCanvas extends Component {
    render(){
        return (
        <div>
            <TwoD 
                save={this.props.saveOption} 
                move={(w,h)=>this.props.getCanvasDimension(w,h)} 
                shape={this.props.shape} 
                coor={this.props.coor} 
                noOfCoor={this.props.noOfCoor}
            />
        </div>    
        );
    }
}

const mapStateToProps = state => {
    return {
      shape:state.shape,
      saveOption:state.option
    };
}

const mapDispatchToProps = dispatch => {
    return {
      getCanvasDimension: (width,height)=>dispatch({type:actionType.DIMENSION,w:width,h:height}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TwoDCanvas);