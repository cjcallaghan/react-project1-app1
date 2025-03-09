import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Wordle from "./Wordle.jsx"
import Stats from "./Stats.jsx"
import { HashRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Wordle />}></Route>
        <Route path="/stats" element={<Stats />}></Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
