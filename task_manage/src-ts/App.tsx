import React from 'react';
import { Route, Routes } from 'react-router';
console.log('#app.tsx');

import Home from './client/home';
import About from './client/about';
import About from './client/about';
import TaskItem from './client/task_item';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/about" element={<About />} />      
      <Route path="/task_item" element={<TaskItem />} />      
    </Routes>
  );
}

export default App;
