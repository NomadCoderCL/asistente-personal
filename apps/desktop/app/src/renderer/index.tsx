import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App'
import Chat from './pages/Chat'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'

const root = createRoot(document.getElementById('root')!)

root.render(
  <BrowserRouter>
    <App />
    <Routes>
      <Route path='/' element={<Chat />} />
      <Route path='/tasks' element={<Tasks />} />
      <Route path='/settings' element={<Settings />} />
    </Routes>
  </BrowserRouter>
)
