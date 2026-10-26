import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Canchas from './pages/Canchas';
import MiPerfil from './pages/MiPerfil';
import Reservar from "./pages/Reservar";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/miperfil" element={<MiPerfil />} />
        <Route path="/reservas/:id" element={<Reservar />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;