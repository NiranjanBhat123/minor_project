import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Interview from './pages/Interview.jsx';
import Home from "./pages/Home.jsx";
import Footer from './components/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/interview' element={<Interview />} />
        </Routes>
        <Footer />
      </>
    </BrowserRouter>
  );
}

export default App;

