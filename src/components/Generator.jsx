import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Generator.css';

export default function Generator() {
  const [guestName, setGuestName] = useState('');
  const [linkOutput, setLinkOutput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // When deployed to GitHub Pages, it usually lives on a subpath or the root with HashRouter.
  // By using HashRouter, the URL looks like: https://username.github.io/repo/#/invitation?guest=Name
  const getBaseUrl = () => {
    return window.location.origin + window.location.pathname + '#/invitation?guest=';
  };

  const handleGenerate = () => {
    if (!guestName.trim()) {
      return;
    }
    const finalLink = getBaseUrl() + encodeURIComponent(guestName.trim());
    setLinkOutput(finalLink);
    setCopySuccess(false);
  };

  const handleCopy = () => {
    if (linkOutput) {
      navigator.clipboard.writeText(linkOutput).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  const previousGuests = [
    "Hilda de Lozano",
    "Orlando Ernesto Candray",
    "José Dalio Berganza y Señora",
    "José Ernesto Moisa",
    "Celia Roxana de Amaya",
    "Julio Eduardo Moisa y Señora",
    "Eduardo Moisa Martines",
    "Nelson Navarro",
    "Arlette Galeano y Madre"
  ];

  return (
    <div className="generator-container">
      <div className="container">
        <header>
          <h1>Generador de Invitaciones</h1>
          <p>Mario Orlando Moisa Candray - Graduación 2026</p>
        </header>
        
        <div className="card">
          <h2>
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Crear nueva invitación
          </h2>
          <div className="input-group">
            <label htmlFor="guestName">Nombre del Invitado(a) o Familia:</label>
            <input 
              type="text" 
              id="guestName" 
              placeholder="Ej. Familia Pérez López" 
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              autoComplete="off" 
            />
          </div>
          <div className="actions">
            <button className="btn-primary" onClick={handleGenerate}>
              Generar Enlace Seguro
            </button>
          </div>
          
          {linkOutput && (
            <div className="result-box">
              <label>Enlace generado listo para enviar:</label>
              <div className="link-output">{linkOutput}</div>
              <div className="result-actions">
                <button className="btn-secondary" onClick={handleCopy}>
                  {copySuccess ? (
                    <><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> ¡Copiado!</>
                  ) : (
                    <><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Copiar</>
                  )}
                </button>
                <a className="btn-secondary" href={linkOutput} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                  Probar
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>
            <svg viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
            Invitaciones Recientes
          </h2>
          <ul>
            {previousGuests.map((guest, index) => (
              <li key={index}>
                <Link to={`/invitation?guest=${encodeURIComponent(guest)}`} target="_blank">
                  <span>{guest}</span>
                  <span>Abrir invitación ↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
