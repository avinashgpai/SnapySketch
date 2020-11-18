import * as actionType from './action';

const initialState = {
    changeTheme : false,
    categories : ['Suggestion','Something is quite not right','Complement'],
    category : null,
    name : null,
    email : null,
    index : null,
    showPopUp : false,
    showDropDown : false,
    operation : null,
    shape : 0,
    canvasW : 0,
    canvasH : 0,
    option : 0,
};

const reducer = (state = initialState,action) => {
    switch(action.type) {
        case actionType.CHANGE_THEME:
            return {
                ...state,
                changeTheme:!state.changeTheme
            };    
        case actionType.SELECTED_CATEGORY:
            return {
                ...state,
                categories:{
                    ...state.categories,
                    [action.id]:state.categories[action.id],
                },
                category:state.categories[action.id],
                index:action.id
            };   
        case actionType.UPDATE_NAME:
            return {
                ...state,
                name:action.input
            };  
        case actionType.UPDATE_EMAIL:
            return {
                ...state,
                email:action.input
            };  
        case actionType.CHANGE_CLICK:
            return {
                ...state,
                showPopUp:action.popUp===null?!state.showPopUp:action.popUp,
            };     
        case actionType.CHANGE_MINI_CLICK:
            return {
                ...state,
                showDropDown:!state.showDropDown
            };     
        case actionType.SELECTED_OPERATION:
            return {
                ...state,
                operation:action.selected_operation
            };        
        case actionType.SELECTED_SHAPE:
            return {
                ...state,
                shape:action.shape
            };         
        case actionType.DIMENSION:
            return {
                ...state,
                canvasW:action.w,
                canvasH:action.h
            };      
        case actionType.SAVE_OPTION:
            return {
                ...state,
                option:action.option
            };      
        default:
            return state;    
    }
};

export default reducer;