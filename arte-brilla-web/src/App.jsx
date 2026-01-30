import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './assets/components/Navbar';
import ScreenSizeWarning from './assets/components/ScreenSizeWarning.jsx';
import Hero from './assets/components/Hero';
import NewsGallery from './assets/components/NewsGallery';
import DanceAreas from './assets/components/DanceAreas';
import Testimonials from './assets/components/Testimonials';
import Team from './assets/components/Team';

import ImportantInfo from './assets/components/ImportantInfo';
import About from './assets/components/About';
import Classes from './assets/components/Classes';
import Contact from './assets/components/Contact';
import Footer from './assets/components/Footer';
import Login from './assets/components/Login';
import ForgotPassword from './assets/components/ForgotPassword.jsx';
import AdminPanel from './assets/components/AdminPanel';
import ProtectedRoute from './assets/components/ProtectedRoute';
import NotFound from './assets/components/NotFound';
import NewsDetail from './assets/components/NewsDetail';
import ClassStudentsPage from "./assets/components/ClassStudentsPage";

import './assets/styles/App.css'

function App() {
  const enableAdmin = import.meta.env.VITE_ENABLE_ADMIN === 'true';

  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <ScreenSizeWarning />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <NewsGallery />
                  <DanceAreas />
                  <h2 style={{ textAlign: 'center', margin: '2.5rem 0 1.5rem 0' }}>Testimonios de familias y estudiantes</h2>
                  <Testimonials />
                </>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              {enableAdmin && (
                <Route path="/login" element={<Login />} />
              )}
              {enableAdmin && (
                <Route path="/forgot-password" element={<ForgotPassword />} />
              )}
              {enableAdmin && (
                <Route path="/classes/:id/students" element={<ClassStudentsPage />} />
              )}
              {enableAdmin && (
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
              )}
              {enableAdmin && (
                <Route
                  path="/teacher"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
