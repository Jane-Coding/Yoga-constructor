import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';

import './fonts.scss';

import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import Lesson from './pages/Lesson';

import { LessonContextProvider } from './context/LessonsContext';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "/lesson/:id",
    element: <Lesson/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LessonContextProvider>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </LessonContextProvider>
  </React.StrictMode>,
)
