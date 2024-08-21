// src/App.jsx
import React from 'react';
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Bootcamps from './pages/Bootcamps'; // Placeholder for Bootcamps page
import Login from './pages/Login'; // Placeholder for Login page
import Register from './pages/Register'; // Placeholder for Register page
import Footer from './components/Footer'; // Optional: Create Footer component
import GettingStarted from './pages/GettingStarted';
import PostDetail from './pages/Post'
import { setContext } from "@apollo/client/link/context";
import Network from './pages/Network'
const httpLink = createHttpLink({
  uri: "/graphql",
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = () => {

  return (
    <ApolloProvider client={client}>
        <>

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bootcamps" element={<Bootcamps />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="/post/:postId" element={<PostDetail />} /> 
          <Route path="/network" element={<Network />} /> 

        </Routes>
        <Footer /> {/* Optional: Include Footer component */}
      </div>
      </>
    </ApolloProvider>
  );
};

export default App;
