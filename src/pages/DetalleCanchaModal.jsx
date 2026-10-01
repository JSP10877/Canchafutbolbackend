import React from 'react';
import { Link } from 'react-router-dom';

import canchasfutbol from '../assets/images/futbol.jpg';
import canchaspadel from '../assets/images/padel.jpg';
import canchasvoleibol1 from '../assets/images/canchavoleibol.jpg';
import canchasvoleibol2 from '../assets/images/canchapisovoleibol.jpg';
import canchasbasket from '../assets/images/canchabasket.jpg';
import canchastenis from '../assets/images/canchatenis.jpg';

const infoCanchas = {
  // FÚTBOL
  1: {
    nombre: "Arena 5 Norte",
    desc: "Césped sintético FIFA Quality Pro con iluminación LED profesional",
    medidas: "25m x 15m",
    capacidad: "10 jugadores",
    servicios: "Iluminación LED, vestuarios, balón incluido, marcador",
    precio: "35.000",
    imagen: canchasfutbol
  },

  2: {
    nombre: "Arena 5 Sur",
    desc: "Cancha techada con graderías y vestuarios completos",
    medidas: "28m x 18m",
    capacidad: "12 jugadores",
    servicios: "Techado, gradas, vestuarios, iluminación",
    precio: "45.000",
    imagen: canchasfutbol
  },

  3: {
    nombre: "Estadio Urbano",
    desc: "Césped natural premium con sistema de drenaje",
    medidas: "28m x 18m",
    capacidad: "12 jugadores",
    servicios: "Sistema de drenado, iluminación premium",
    precio: "48.000",
    imagen: canchasfutbol
  },

  // PÁDEL
  4: {
    nombre: "Padel Cancha 1",
    desc: "Ideal para partidos rápidos y torneos empresariales",
    medidas: "20m x 10m",
    capacidad: "4 jugadores",
    servicios: "Techado, red, vestuarios, iluminación",
    precio: "25.000",
    imagen: canchaspadel
  },

  5: {
    nombre: "Padel Cancha 2",
    desc: "Iluminación nocturna HD y marcador electrónico",
    medidas: "20m x 10m",
    capacidad: "4 jugadores",
    servicios: "Marcador electrónico, iluminación HD",
    precio: "25.000",
    imagen: canchaspadel
  },

  6: {
    nombre: "Padel Cancha 3",
    desc: "Ambiente recreativo con zona de comidas",
    medidas: "20m x 10m",
    capacidad: "4 jugadores",
    servicios: "Zona de comidas, sillas, mesas",
    precio: "30.000",
    imagen: canchaspadel
  },

  // VOLEIBOL
  7: {
    nombre: "Voleibol Arena 1",
    desc: "Cancha de arena profesional",
    medidas: "16m x 8m",
    capacidad: "12 jugadores",
    servicios: "Red profesional, hidratación",
    precio: "35.000",
    imagen: canchasvoleibol1
  },

  8: {
    nombre: "Voleibol Piso",
    desc: "Cancha con piso profesional y marcador electrónico",
    medidas: "18m x 9m",
    capacidad: "12 jugadores",
    servicios: "Marcador electrónico, iluminación",
    precio: "35.000",
    imagen: canchasvoleibol2
  },

  9: {
    nombre: "Voleibol Arena 2",
    desc: "Ideal para partidos amistosos",
    medidas: "16m x 8m",
    capacidad: "12 jugadores",
    servicios: "Arena premium, hidratación",
    precio: "30.000",
    imagen: canchasvoleibol1
  },

  // TENIS
  10: {
    nombre: "Tenis Court 1",
    desc: "Cancha profesional de superficie acrílica",
    medidas: "23.77m x 8.23m",
    capacidad: "4 jugadores",
    servicios: "Red profesional, iluminación LED",
    precio: "40.000",
    imagen: canchastenis
  },

  11: {
    nombre: "Tenis Court 2",
    desc: "Perfecta para entrenamiento competitivo",
    medidas: "23.77m x 8.23m",
    capacidad: "4 jugadores",
    servicios: "Marcador digital, gradería",
    precio: "42.000",
    imagen: canchastenis
  },

  // BASKET
  12: {
    nombre: "Basket Arena 1",
    desc: "Cancha indoor profesional",
    medidas: "28m x 15m",
    capacidad: "10 jugadores",
    servicios: "Tableros profesionales, iluminación HD",
    precio: "38.000",
    imagen: canchasbasket
  },

  13: {
    nombre: "Basket Arena 2",
    desc: "Espacio premium para torneos",
    medidas: "28m x 15m",
    capacidad: "10 jugadores",
    servicios: "Marcador electrónico, graderías",
    precio: "40.000",
    imagen: canchasbasket
  }
};

const DetalleCanchaModal = ({ canchaId, onClose }) => {
  const cancha = infoCanchas[canchaId];

  if (!cancha) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        <img
          src={cancha.imagen}
          alt={cancha.nombre}
          style={styles.headerImage}
        />

        <div style={styles.body}>
          <h2 style={styles.title}>{cancha.nombre}</h2>
          <p style={styles.descText}>{cancha.desc}</p>

          <div style={styles.infoGrid}>
            <div style={styles.infoBox}>
              <span style={styles.label}>Medidas</span>
              <span style={styles.value}>{cancha.medidas}</span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>Capacidad</span>
              <span style={styles.value}>{cancha.capacidad}</span>
            </div>
          </div>

          <div style={styles.servicesBox}>
            <span style={styles.label}>Servicios</span>
            <p style={styles.value}>{cancha.servicios}</p>
          </div>

          <div style={styles.footer}>
            <h3 style={styles.priceText}>
              Precio: <span style={styles.priceGreen}>${cancha.precio} / hora</span>
            </h3>

            <div style={styles.actions}>
              <button onClick={onClose} style={styles.btnClose}>
                Cerrar
              </button>

              <Link
                to={`/reservas/${canchaId}`}
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition"
              >
                Reservar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },

  modal: {
    backgroundColor: '#111827',
    width: '100%',
    maxWidth: '600px',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #374151'
  },

  headerImage: {
    height: '180px',
    width: '100%',
    objectFit: 'cover'
  },

  body: {
    padding: '24px'
  },

  title: {
    color: '#10b981',
    fontSize: '1.8rem',
    fontWeight: 'bold'
  },

  descText: {
    color: '#9ca3af',
    marginBottom: '24px'
  },

  infoGrid: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#1f2937',
    padding: '16px',
    borderRadius: '12px'
  },

  servicesBox: {
    backgroundColor: '#1f2937',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px'
  },

  label: {
    color: '#10b981',
    fontWeight: 'bold'
  },

  value: {
    color: '#fff'
  },

  footer: {
    marginTop: '20px'
  },

  priceText: {
    color: '#fff',
    marginBottom: '20px'
  },

  priceGreen: {
    color: '#10b981'
  },

  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  btnClose: {
    backgroundColor: '#374151',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default DetalleCanchaModal;