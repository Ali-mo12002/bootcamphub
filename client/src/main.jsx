// src/index.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'; // Import ApolloClient and ApolloProvider
import App from './App.jsx';
import './index.css';

// Create an ApolloClient instance
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

// Render your app using ReactDOM.createRoot
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}> 
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
