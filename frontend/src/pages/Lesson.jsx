import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import Container from '@mui/system/Container';
import Box from '@mui/material/Box';
import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import Navbar from '../components/Navbar';

import { useParams } from 'react-router-dom';

function Lesson() {
  const { id } = useParams()

  const [progress, setProgress] = React.useState(0);
  const [pause, setPause] = React.useState(false)

  const [lesson, setLesson] = React.useState(null)
  let [currentPose, setCurrentPose] = React.useState(0)
  const [posesArray, setPosesArray] = React.useState([])

  React.useEffect(()=> {
    const getLessonsList = async() => {
      const response = await fetch(`http://localhost:8085/api/lessons/${id}`)
      const lessonsList = await response.json()
      
      if(response.ok){
        setLesson(lessonsList)
        setPosesArray(lessonsList.poses)
      }
    }

    getLessonsList()

  }, [])

  React.useEffect( () => {
    const interval = setInterval(() => {
      if(pause) {
        if (progress < 100) {
          setProgress(progress + (100/60))
        }
        else if (progress >= 100) {
          setProgress(0)

          if (currentPose >= posesArray.length-1){
            setPause(!pause)
            clearInterval(interval)
          }

          else {
            currentPose ++
            setCurrentPose(currentPose)
          }
        }        
      }
    }, 1000);

    return () => {
      clearInterval(interval)};
  });

  const handlePauseToggle = () => {
    setPause(!pause);
  }

  return (
      <>
      <Navbar/>
      <Container maxWidth='sm'>
        <Card sx={{ maxWidth: "sm" , mt: "150px", }} >
          <CardMedia
              component="img"
              alt="asana"
              height="sm"
              // image={asana}
          />

          <CardContent>
            <LinearProgress variant="determinate" value={progress} color='secondary'/>
            <Typography gutterBottom variant="h5" component="div">
              {lesson && posesArray[currentPose].pose}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {lesson && lesson.title}
            </Typography>
          </CardContent>

          <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
              <IconButton aria-label="play/pause" color='secondary' onClick={()=> handlePauseToggle()}>
                {pause ?
                <PauseIcon sx={{ height: 60, width: 60 }} /> 
                :
                <PlayArrowIcon sx={{ height: 60, width: 60 }} />
                }          
              </IconButton>
            </Box>      
          </CardActions>

        </Card>
      </Container>
      </>
    );
}

export default Lesson;