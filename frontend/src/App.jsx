import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Interview from './pages/Interview.jsx';
import Record from './pages/Record.jsx';
import Report from './pages/Report.jsx';
import Home from './pages/Home.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import HomeProtect from './components/HomeProtect';
import Profile from './pages/Profile.jsx';


function App() {
  return (
    <BrowserRouter>
    <>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<ProtectedRoute component={Interview} />} />
        <Route path="/record" element={<ProtectedRoute component={Record} />} />
        <Route path="/report" element={<ProtectedRoute component={Report} />} />
        <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
      </Routes>
      <Footer/>
      </>
    </BrowserRouter>
  );
}

export default App;
