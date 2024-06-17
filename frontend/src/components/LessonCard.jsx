import { 
    Grid, 
    Typography, 
    Paper, 
    Button, 
    ButtonGroup, 
    IconButton, 
    Dialog, 
    DialogTitle, 
    DialogContent,
    DialogContentText,
    DialogActions } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Link } from "react-router-dom";

import { useLessonsContext } from '../hooks/useLessonsContext';
import { useNotificationContext } from '../hooks/useNotificationContext';
import { useAuthContext } from '../hooks/useAuthContext';

import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

function LessonCard({lesson}) {
    const { dispatch } = useLessonsContext()
    const { openNotification } = useNotificationContext()
    const { user } = useAuthContext()
        
    const [ preview, setPreview ] = useState(false)
    const [alert, setAlert] = useState(false)

    const deleteLesson = async () => {
        if(!user){
            return 
        }

        const response = await fetch('http://localhost:8085/api/lessons/' + lesson._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const deletedLesson = await response.json()

        if(response.ok){
            dispatch({type: 'DELETE_LESSON', payload: deletedLesson})
            openNotification({type: 'DELETE'})
        }
    }

    function previewLesson () {
        setPreview(!preview)
    }

    const openAlert = () => {
        setAlert(!alert);
    }

    return ( 
        <>
            <Paper elevation={6} square={false} sx={{p: '10px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        {lesson.title}
                    </Typography>
                    <Typography sx={{pt: 1}}>{lesson.description}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <ButtonGroup sx={{border: "2px solid", borderColor: "primary.main"}} aria-label="Basic button group" >                        
                        <IconButton sx={{borderRight: "2px solid", borderRadius: "0"}} color='primary' aria-label="edit" component={Link} to={`update/${lesson._id}`}>
                            <EditIcon/>
                        </IconButton>
                        <IconButton sx={{borderRight: "2px solid", borderRadius: "0"}} color='primary' aria-label="delete" onClick={openAlert}>
                            <DeleteIcon />
                        </IconButton>
                        <Button variant="text" onClick={()=> previewLesson()}>Preview</Button>
                    </ButtonGroup>
                         
                </Grid>

                <Grid item xs={6}>
                    <Grid container spacing={2} direction={'row-reverse'}>
                        <Grid item>
                            <Button variant='contained' color='secondary' component={Link} to={`lesson/${lesson._id}`}>Start Lesson</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            </Paper>

            <Dialog open={preview}>
                <Button onClick={()=> previewLesson()} color='secondary' variant='outlined'>Close Preview</Button>
                <DialogTitle>List of asanas for the lesson: {lesson.title}</DialogTitle>
                <DialogContent>
                    {lesson && lesson.poses.map(lessonObj=> lessonObj.pose).map((pose, ind)=> <Typography key={uuidv4()}>{ind+1}) {pose}</Typography>)}
                </DialogContent>            
            </Dialog>

            <Dialog
                open={alert}
                onClose={openAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >                    
                <DialogTitle id="alert-dialog-title">
                    {"Deletion of the lesson"}
                </DialogTitle>

                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete lesson: {lesson.title} ?
                </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={openAlert}>Disagree</Button>
                    <Button onClick={deleteLesson}>Agree</Button>
                </DialogActions>
            </Dialog>            
        </>
    );
}

export default LessonCard;