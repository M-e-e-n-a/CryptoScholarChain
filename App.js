import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';
import ApplyForScholarship from './components/ApplyForScholarship';
import MakeDonation from './components/MakeDonation';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<RegisterUser />} />
                    <Route path="/apply-for-scholarship" element={<ApplyForScholarship />} />
                    <Route path="/make-donation" element={<MakeDonation />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
