import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TelegramProvider } from './contexts/TelegramContext';
import Layout from './components/Layout';
import GameScreen from './components/GameScreen';
import ProfileScreen from './components/ProfileScreen';
import './App.css';

function App() {
  return (
    <TelegramProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                <Route path="/" element={<GameScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </AuthProvider>
    </TelegramProvider>
  );
}

export default App;
