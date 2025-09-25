import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Explore from './pages/Explore.tsx'
import CharacterDetail from './pages/CharacterDetail.tsx'
import CreateCharacter from './pages/CreateCharacter.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Me from './pages/Me.tsx'
import NotFound from './pages/NotFound.tsx'
import Layout from './components/Layout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/character/:id" element={<CharacterDetail />} />
          <Route path="/create" element={<CreateCharacter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<Me />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
