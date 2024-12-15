import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
<<<<<<< HEAD
=======
import UserPage from './components/UserPage/UserPage';
>>>>>>> frontend
import { UserProvider } from './context/UserContext';
import './App.css';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Routes>
              <Route path="/register" element={<RegistrationForm />} />
<<<<<<< HEAD
=======
              <Route path="/user/:uid" element={<UserPage />} />
>>>>>>> frontend
              <Route path="/" element={<RegistrationForm />} />
            </Routes>
          </header>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
