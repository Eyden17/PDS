import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './assets/components/Navbar';
//import ScreenSizeWarning from './assets/components/ScreenSizeWarning';
import Hero from './assets/components/Hero';
import NewsGallery from './assets/components/NewsGallery';
import DanceAreas from './assets/components/DanceAreas';
import Team from './assets/components/Team';
import Events from './assets/components/Events';

import ImportantInfo from './assets/components/ImportantInfo';
import About from './assets/components/About';
import Classes from './assets/components/Classes';
import Contact from './assets/components/Contact';
import Footer from './assets/components/Footer';
import Login from './assets/components/Login';
//import ForgotPassword from './assets/components/ForgotPassword';
import AdminPanel from './assets/components/AdminPanel';
import ProtectedRoute from './assets/components/ProtectedRoute';
import NotFound from './assets/components/NotFound';
import NewsDetail from './assets/components/NewsDetail';
import './assets/styles/App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          {/* <ScreenSizeWarning /> */}
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Events />
                  <ImportantInfo />
                  <NewsGallery />
                  <DanceAreas />
                </>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/news/:id" element={<NewsDetail />} />

              {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
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
