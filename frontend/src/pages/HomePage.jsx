import { Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import LessonCard from '../components/LessonCard';
import Notification from '../components/Notification';
import Login from './Login';
import Signup from './Signup';

import { useEffect, useState } from 'react';

import { useLessonsContext } from '../hooks/useLessonsContext';
import { useAuthContext } from '../hooks/useAuthContext';

function HomePage() {
    const {lessons, dispatch} = useLessonsContext()
    const { user } = useAuthContext()

    const [ newUser, setNewUser ] = useState(true)

    useEffect(() => {
        const getLessonsList = async () => {
            const response = await fetch('http://localhost:8085/api/lessons', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const lessonsList = await response.json()

            if(response.ok){
                dispatch({type: 'SET_LESSONS', payload: lessonsList})
            }
        }

        if(user){
            getLessonsList()
        }

    }, [dispatch, user])

    const login = (event, update) => {
        console.log(event);
        console.log(update);
        setNewUser(update)
    }

    return (
        <Container maxWidth="sm" sx={{mt: "80px", mb: "60px"}}>
            <Stack spacing={3}>

                {!user && <ToggleButtonGroup
                    value={newUser}
                    exclusive
                    onChange={login}
                    >
                        <ToggleButton value={true}>
                            <Typography>Sign up</Typography>
                        </ToggleButton>
                        <ToggleButton value={false}>
                            <Typography>Log in</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                }

                {(!user && newUser) && <Signup />}
                {(!user && !newUser) && <Login />}

                {user && <>
                    <Typography>Welcome back {user.email}</Typography>
                    <Typography variant="h4">Your created lessons</Typography>
                    </>
                }

                {lessons && lessons.map(lesson => 
                    <LessonCard key={lesson._id} lesson={lesson}></LessonCard>
                )}

                <Typography variant="h4">
                    Default sessions
                </Typography>

            </Stack>
            <Notification />
        </Container>      
    );
}

export default HomePage;