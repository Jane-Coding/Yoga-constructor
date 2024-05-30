import {Container, Stack, TextField, Typography, Button, FormControl} from '@mui/material';
import SimpleSlider from "../components/SimpleSlider";

import { useCreateLessonContext } from '../hooks/useCreateLessonContext';
import { useLessonsContext } from '../hooks/useLessonsContext';
import { useState } from 'react';

function LessonForm() {
    let { list, dispatch: dispatchList } = useCreateLessonContext()
    const { dispatch } = useLessonsContext()

    const [ title, setTitle ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ error, setError ] = useState([])
    const [ emptyFields, setEmptyFields ] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const lesson = {title, description, poses: list}

        const response = await fetch('http://localhost:8085/api/lessons', {
            method: 'POST',
            body: JSON.stringify(lesson),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if(!response.ok){
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        
        if(response.ok){
            setEmptyFields([])
            setError([])
            setTitle('')
            setDescription('')
            dispatch({type: 'CREATE_LESSON', payload: json})
            dispatchList({type: 'RESET', payload: []})
        }
    }

    return ( 
        <Container sx={{mt: '70px'}}>
            <FormControl sx={{width: '100%'}}>
                <Typography variant='h4' mb={2}>Create new lesson</Typography>
                <Stack spacing={3}>

                    <TextField 
                        label='Title of the lesson' 
                        variant='outlined' 
                        color='secondary' 
                        required 
                        onChange={(e)=> setTitle(e.target.value)} 
                        value={title}
                        error={emptyFields.includes('title') ? error : null}
                    ></TextField>

                    <TextField 
                        label='Description of the lesson' 
                        variant='outlined' 
                        color='secondary'
                        required
                        multiline 
                        onChange={(e)=> setDescription(e.target.value)} 
                        value={description}
                        error={emptyFields.includes('description') ? 'error' : null}
                    ></TextField>

                </Stack>

                <Typography 
                    sx={{
                    fontWeight: 'bold',
                    color: emptyFields.includes('poses') ? 'red' : 'black'                    
                    }}
                >Chosen asanas for this lesson: {list.length}</Typography>

                {list.length === 0 
                    ? 
                    <Typography sx={{height: '300px'}}>No chosen asanas</Typography> 
                    : 
                    <SimpleSlider list={list}/>
                }
                <Button onClick={handleSubmit}>Submit the lesson</Button>
            </FormControl>
        </Container>
     );
}

export default LessonForm;