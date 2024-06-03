import { createContext, useReducer } from "react";

export const CreateLessonContext = createContext()

import { v4 as uuidv4 } from 'uuid';

function listReducer(list, action){
    switch (action.type){
        case 'ADD_ASANA': {
            const newItem = {
                pose: action.payload.pose,
                picture: action.payload.picture,
                uuid: uuidv4()
            }
            return [...list, newItem]
        }
        case 'DELETE_ASANA': {
            return list.filter(el => el.uuid !== action.uuid)
        }
        case 'RESET': {
            return action.payload
        }
        case 'SET_ASANAS': {
            return action.payload.map((poses) => ({ pose: poses.pose, picture: poses.picture, uuid: poses._id }))
        }
        default:
            return list
    }
}

export const CreateLessonContextProvider = ({children}) => {    
    const [list, dispatch] = useReducer(listReducer, [])

    return ( 
        <CreateLessonContext.Provider value={{list, dispatch}}>
            {children}
        </CreateLessonContext.Provider>
    );
}
