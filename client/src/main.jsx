// src/index.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import Home from './pages/Home';
import Bootcamps from './pages/Bootcamps'; 
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import GettingStarted from './pages/GettingStarted';
import PostDetail from './pages/Post'; // Import PostDetail component

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/bootcamps',
        element: <Bootcamps />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/getting-started',
        element: <GettingStarted />
      },
      {
        path: '/post/:postId', // Route for specific post
        element: <PostDetail />
      }
    ]
  }
]);

// Render your app using ReactDOM.createRoot
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />

);
