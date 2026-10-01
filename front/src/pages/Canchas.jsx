import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DetalleCanchaModal from './DetalleCanchaModal';
import Footer from '../components/Footer';

// Incorporación de las imágenes
import canchasfutbol from '../assets/images/futbol.jpg';
import canchaspadel from '../assets/images/padel.jpg';
import canchasvoleibol1 from '../assets/images/canchavoleibol.jpg';
import canchasvoleibol2 from '../assets/images/canchapisovoleibol.jpg';
import canchasbasket from '../assets/images/canchabasket.jpg';
import canchastenis from '../assets/images/canchatenis.jpg';
import logotipo from '../assets/images/logotipo.png';

const canchasData = [
  { id: 1, nombre: "Fútbol arena 5 Norte", desc: "Césped sintético FIFA Quality Pro con iluminación LED profesional", precio: 35000, tipo: "Sintético", imagen: canchasfutbol },
  { id: 2, nombre: "Fútbol arena 5 Sur", desc: "Cancha techada con graderías y vestuarios completos", precio: 45000, tipo: "Sintético", imagen: canchasfutbol },
  { id: 3, nombre: "Fútbol estadio urbano", desc: "Césped natural premium con sistema de drenaje", precio: 48000, tipo: "Natural", imagen: canchasfutbol },
  { id: 4, nombre: "Pádel Cancha 1", desc: "Ideal para partidos rápidos y torneos empresariales", precio: 25000, tipo: "Piso", imagen: canchaspadel },
  { id: 5, nombre: "Pádel Cancha 2", desc: "Iluminación nocturna HD y marcador electrónico", precio: 25000, tipo: "Piso", imagen: canchaspadel },
  { id: 6, nombre: "Pádel Cancha 3", desc: "Ambiente recreativo con zona de comidas", precio: 30000, tipo: "Piso", imagen: canchaspadel },
  { id: 7, nombre: "Voleibol Arena 1", desc: "Espacio ideal para partidos recreativos sobre arena profesional", precio: 35000, tipo: "Arena", imagen: canchasvoleibol1 },
  { id: 8, nombre: "Voleibol Piso", desc: "Cancha indoor con marcador electrónico", precio: 35000, tipo: "Piso", imagen: canchasvoleibol2 },
  { id: 9, nombre: "Voleibol Arena 2", desc: "Perfecta para encuentros amistosos", precio: 30000, tipo: "Arena", imagen: canchasvoleibol1 },
  { id: 10, nombre: "Tenis Court 1", desc: "Cancha profesional de superficie rápida con iluminación LED", precio: 32000, tipo: "Piso", imagen: canchastenis },
  { id: 11, nombre: "Tenis Court 2", desc: "Espacio premium para entrenamiento y competición", precio: 35000, tipo: "Piso", imagen: canchastenis },
  { id: 12, nombre: "Basketball Arena 1", desc: "Cancha full court con tablero profesional", precio: 28000, tipo: "Piso", imagen: canchasbasket },
  { id: 13, nombre: "Basketball Arena 2", desc: "Iluminación HD y gradería lateral", precio: 30000, tipo: "Piso", imagen: canchasbasket },
];

const TarjetaCancha = ({ cancha, onOpen }) => (
  <div style={styles.card}>
    <img
      src={cancha.imagen}
      alt={cancha.nombre}
      style={styles.image}
    />
    <div style={styles.content}>
      <h3 style={styles.title}>{cancha.nombre}</h3>
      <p style={styles.description}>{cancha.desc}</p>
      <div style={styles.infoRow}>
        <span style={styles.badge}>{cancha.tipo}</span>
        <span style={styles.price}>${cancha.precio}</span>
      </div>
      <button
        style={styles.buttonMain}
        onClick={() => onOpen(cancha.id)}
        onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
      >
        Reservar
      </button>
    </div>
  </div>
);

export default function Canchas() {
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [ordenPrecio, setOrdenPrecio] = useState("default");

  useEffect(() => {
    const deporteParam = searchParams.get('deporte');
    if (deporteParam) {
      setBusqueda(deporteParam);
    }
  }, [searchParams]);

  const canchasFiltradas = useMemo(() => {
    let resultado = [...canchasData];
    if (busqueda.trim()) {
      resultado = resultado.filter(cancha =>
        cancha.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    if (tipoFiltro !== "Todos") {
      resultado = resultado.filter(cancha => cancha.tipo === tipoFiltro);
    }
    if (ordenPrecio === "asc") {
      resultado.sort((a, b) => a.precio - b.precio);
    }
    if (ordenPrecio === "desc") {
      resultado.sort((a, b) => b.precio - a.precio);
    }
    return resultado;
  }, [busqueda, tipoFiltro, ordenPrecio]);

  return (
    <div style={styles.mainWrapper}>
      <Navbar paginaActiva="canchas" />

      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <h1 className="text-center text-6xl font-bold mb-6 text-green-500">
            <span className="text-white">Nuestras</span> Canchas
          </h1>
          <p className="text-center text-xl text-white max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-2xl">
            Espacios diseñados para vivir el fútbol con intensidad, comodidad y calidad profesional.
          </p>
        </div>
      </section>

      <main style={styles.container}>
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Buscar cancha..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            style={styles.select}
          >
            <option>Todos</option>
            <option>Sintético</option>
            <option>Natural</option>
            <option>Piso</option>
            <option>Arena</option>
          </select>
          <select
            value={ordenPrecio}
            onChange={(e) => setOrdenPrecio(e.target.value)}
            style={styles.select}
          >
            <option value="default">Ordenar precio</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>
        </div>

        <div style={styles.grid}>
          {canchasFiltradas.map(cancha => (
            <TarjetaCancha
              key={cancha.id}
              cancha={cancha}
              onOpen={setSelectedId}
            />
          ))}
        </div>
      </main>

      {selectedId && (
        <DetalleCanchaModal
          canchaId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
      <Footer />
    </div>
  );
}

const styles = {
  mainWrapper: {
    backgroundColor: '#111827',
    minHeight: '100vh',
    fontFamily: 'sans-serif'
  },
  heroSection: {
    backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.6), rgba(17, 24, 39, 0.8)), url(${logotipo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '120px 20px 80px',
    borderBottom: '1px solid #1e293b'
  },
  heroContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  container: {
    padding: '60px 20px'
  },
  filters: {
    display: 'flex',
    gap: '16px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto 30px auto'
  },
  searchInput: {
    flex: 1,
    minWidth: '250px',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#fff'
  },
  select: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#fff',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #334155'
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  content: {
    padding: '20px'
  },
  title: {
    color: '#10b981',
    margin: '0 0 10px 0',
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  description: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    height: '40px',
    marginBottom: '20px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.75rem'
  },
  price: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  buttonMain: {
    width: '100%',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s'
  }
};