// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Bootcamps from './pages/Bootcamps'; // Placeholder for Bootcamps page
import Login from './pages/Login'; // Placeholder for Login page
import Register from './pages/Register'; // Placeholder for Register page
import Footer from './components/Footer'; // Optional: Create Footer component

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bootcamps" element={<Bootcamps />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer /> {/* Optional: Include Footer component */}
      </div>
    </Router>
  );
};

export default App;
