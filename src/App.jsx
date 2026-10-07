import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Generator from './components/Generator';
import Invitation from './components/Invitation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/invitation" element={<Invitation />} />
      </Routes>
    </Router>
  );
}

export default App;
