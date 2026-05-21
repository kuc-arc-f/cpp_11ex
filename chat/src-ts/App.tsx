import React from 'react';
import { Route, Routes } from 'react-router';
console.log('#app.tsx');

import Home from './client/home';
import About from './client/about';
import Post from './client/post';
import Thread from './client/thread';
import Signup from './client/signup';
import Login from './client/login';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/about" element={<About />} />      
      <Route path="/post" element={<Post />} />      
      <Route path="/thread" element={<Thread />} />      
      <Route path="/signup" element={<Signup />} />      
      <Route path="/login" element={<Login />} />      
    </Routes>
  );
}

export default App;
