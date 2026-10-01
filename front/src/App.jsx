import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Canchas from './pages/Canchas';
import MiPerfil from './pages/MiPerfil';
import Reservar from "./pages/Reservar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/miperfil" element={<MiPerfil />} />
        <Route path="/reservas/:id" element={<Reservar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;