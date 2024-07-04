import React from 'react';
// import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Daftar from './pages/Daftar';
import Survey from './pages/Survey';
import Tabel from './pages/Tabel';
import { AnimatePresence, motion } from "framer-motion";
import Motiondiv from './components/Motiondiv';
import Sisera from './pages/Sisera';
import SurveyOnline from './pages/SurveyOnline';

function App() {
  return (
    <AnimatePresence>
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            {/* <Route path="/" element={<><Navbar/><Welcome/></>} /> */}
            <Route path="/" element={<Welcome/> } />
            <Route path="/daftar" element={<Daftar />} />
            <Route path="/tabel" element={<Tabel />} />
            <Route path="/survey" element={<Motiondiv> <Survey /> </Motiondiv>} />
            <Route path="/sisera" element={<Motiondiv> <Sisera /> </Motiondiv>} />
            <Route path="/survey-online/:slug" element={<Motiondiv> <SurveyOnline /> </Motiondiv>} />

          </Routes>
          {/* <Navbar/> */}
        </Router>
      </div>

    </AnimatePresence>
  );
}

export default App;
