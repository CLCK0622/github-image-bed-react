import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx'
import Upload from './components/Upload.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/upload' element={<Upload />} />
        </Routes>
    </Router>
  </React.StrictMode>,
)
