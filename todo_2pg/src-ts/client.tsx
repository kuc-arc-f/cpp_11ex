import ReactDOM from 'react-dom/client'
import React from 'react'
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import App from './App.tsx'
//import App from './client/home.tsx'

ReactDOM.createRoot(document.getElementById('app')).render(
  <HashRouter>
    <App />
  </HashRouter>
)
console.log('createRoot')
