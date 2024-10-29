import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Ensure you import Home correctly
import Contact from './pages/Contact';
import MyApponint from './pages/MyApponint';
import Apponint from './pages/Apponint';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login'; // Ensure you import Login correctly
import About from './pages/About'; // Ensure you import About correctly
import ScheduleManager from './pages/scheduleManager';
import MyProfile from './pages/MyProfile';

export default function App() {

  

  return (
    <div className='mx-4 sm:mx-[5%]'>
      <UserProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/my-apponint' element={<MyApponint />} />
        <Route path='/appointment/:teacherId' element={<Apponint />} /> {/* Corrected here */}
        <Route path='/scheduleManager/:teacherId' element={<ScheduleManager />} />
      </Routes>
      </UserProvider>
      <Footer />
    </div>
  );
}
