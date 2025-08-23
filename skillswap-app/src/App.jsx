import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

//pages
import Home from './pages/main/Home';
import Signup from './pages/main/Signup';
import Login from './pages/main/Login';
import HowItWorks from './pages/main/HowItWorks';
import About from './pages/main/About';

//components
import Navbar from './components/Navbar';
import Footer from './components/Footer';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App