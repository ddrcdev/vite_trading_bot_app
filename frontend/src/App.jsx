import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppBarMenu from './components/AppBar';
import Home from './pages/Home';
import Strategies from './pages/Strategies';
import Analytics from './pages/Analytics';
import Test from './pages/TestComponents.jsx'
import './App.css';

function App() {
  return (
    <BrowserRouter> 
      <div className='App'>
          <AppBarMenu/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/test" element={<Test/>}  />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
