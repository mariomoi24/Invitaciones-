import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InvitationCardPreview from './InvitationCardPreview';
import './Generator.css';

const DEFAULT_GUESTS = [
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

const STORAGE_KEY = 'grad_invitation_guests_v1';

export default function Generator() {
  const [guestName, setGuestName] = useState('');
  const [activeGuest, setActiveGuest] = useState('');
  const [passes, setPasses] = useState('');
  const [linkOutput, setLinkOutput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [guests, setGuests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_GUESTS;
  });
  // New state to indicate generation in progress (helps debugging UI)

  const [searchTerm, setSearchTerm] = useState('');
  // State to show a brief success message after generation
  const [generateSuccess, setGenerateSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch (e) {
      console.error('Error saving guests to localStorage', e);
    }
  }, [guests]);

  const getBaseUrl = (name, passCount = '') => {
    const cleanPath = window.location.pathname.replace(/\/+$/, '');
    let url = `${window.location.origin}${cleanPath}/#/invitation?guest=${encodeURIComponent(name)}`;
    if (passCount && passCount.trim()) {
      url += `&passes=${encodeURIComponent(passCount.trim())}`;
    }
    return url;
  };

  const handleGenerate = (targetName = guestName) => {
    const trimmed = (targetName || '').trim();
    if (!trimmed) return;

    // Debug output


    setActiveGuest(trimmed);
    const finalLink = getBaseUrl(trimmed, passes);
    setLinkOutput(finalLink);
    console.log('🔗 Enlace generado:', finalLink);
    setCopySuccess(false);
    // Show temporary success banner
    setGenerateSuccess(true);
    setTimeout(() => setGenerateSuccess(false), 2500);

    // Add to guests history if not present
    setGuests((prev) => {
      const exists = prev.some((g) => g.toLowerCase() === trimmed.toLowerCase());
      if (!exists) {
        return [trimmed, ...prev];
      }
      return prev;
    });

    // Generation finished – give a tiny async break to ensure state updates

  };

  const handleSelectRecentGuest = (name, e) => {
    e.preventDefault();
    setGuestName(name);
    handleGenerate(name);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (linkOutput) {
      navigator.clipboard.writeText(linkOutput).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2200);
      });
    }
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleNativeShare = async () => {
    if (!linkOutput) return;
    try {
      await navigator.share({
        title: `Invitación a Graduación - ${activeGuest || guestName.trim()}`,
        text: `¡Hola! Te comparto tu invitación personal para mi celebración de graduación:`,
        url: linkOutput
      });
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const whatsappShareText = encodeURIComponent(
    `¡Hola! Te comparto tu invitación personal para mi celebración de graduación:\n${linkOutput}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${whatsappShareText}`;

  const handleRemoveGuest = (nameToRemove, e) => {
    e.preventDefault();
    e.stopPropagation();
    setGuests((prev) => prev.filter((g) => g !== nameToRemove));
  };

  const filteredGuests = guests.filter((g) =>
    g.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="generator-container">
      <div className="container">
        <header>
          <h1>Generador de Invitaciones</h1>
          <p>Mario Orlando Moisa Candray · Graduación 2026</p>
        </header>
        
        <div className="card">
          <h2>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Crear nueva invitación
          </h2>

          <div className="input-group">
            <label htmlFor="guestName">Nombre del Invitado(a) o Familia:</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                id="guestName" 
                placeholder="Ej. Familia Pérez López, Lic. Roberto Gómez..." 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                autoComplete="off" 
              />
              {guestName && (
                <button 
                  type="button" 
                  className="btn-clear" 
                  onClick={() => setGuestName('')}
                  title="Borrar texto"
                  aria-label="Borrar texto"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>Pases / Acompañantes asignados (opcional):</label>
            <div className="passes-chips">
              {[
                { label: 'Sin especificar', val: '' },
                { label: '1 persona', val: '1 persona' },
                { label: '2 personas', val: '2 personas' },
                { label: '3 personas', val: '3 personas' },
                { label: 'Familiar', val: 'Pase Familiar' }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`btn-pass-chip ${passes === item.val ? 'active' : ''}`}
                  onClick={() => {
                    setPasses(item.val);
                    if (linkOutput && activeGuest) {
                      setLinkOutput(getBaseUrl(activeGuest, item.val));
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={() => handleGenerate()}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
              Generar Enlace e Imagen
            </button>
          </div>
          
          {linkOutput && (
            <div className="result-box">
              <label>Enlace personalizado generado:</label>
              <div className="link-output">{linkOutput}</div>
              
              <div className="result-actions">
                <button className="btn-secondary" onClick={handleCopy}>
                  {copySuccess ? (
                    <>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                      Copiar Enlace
                    </>
                  )}
                </button>

                <a 
                  className="btn-secondary btn-whatsapp-share" 
                  href={whatsappShareUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Compartir por WhatsApp"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.43 0-2.82-.37-4.05-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.17 8.17 0 0 1-1.25-4.47c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.18-.48-.3z"/>
                  </svg>
                  Enviar por WhatsApp
                </a>

                {canShare && (
                  <button className="btn-secondary" onClick={handleNativeShare} title="Compartir enlace">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
                    </svg>
                    Compartir
                  </button>
                )}

                <a className="btn-secondary" href={linkOutput} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                  </svg>
                  Probar Enlace
                </a>
              </div>

              {/* Tarjeta de imagen enlazada con vista previa, descarga en PNG y QR dinámico */}
              <InvitationCardPreview
                guestName={activeGuest || guestName}
                invitationUrl={linkOutput}
                passes={passes}
              />
            </div>
          )}
        </div>

        <div className="card">
          <div className="recent-header">
            <h2>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
              </svg>
              Invitaciones Recientes ({guests.length})
            </h2>

            {guests.length > 5 && (
              <input
                type="text"
                className="search-input"
                placeholder="Buscar invitado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>

          <p className="recent-tip">
            💡 Haz clic en cualquier invitado para generar su tarjeta y enlace personalizado de inmediato.
          </p>

          <ul>
            {filteredGuests.map((guest, index) => (
              <li key={`${guest}-${index}`}>
                <div className="guest-item-card" onClick={(e) => handleSelectRecentGuest(guest, e)}>
                  <span className="guest-item-name">{guest}</span>
                  <div className="guest-item-actions">
                    <button
                      type="button"
                      className="btn-select-guest"
                      title="Generar tarjeta en imagen y enlace"
                    >
                      Tarjeta 🖼️
                    </button>
                    <Link
                      to={`/invitation?guest=${encodeURIComponent(guest)}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="open-link-icon"
                      title="Abrir enlace web"
                    >
                      ↗
                    </Link>
                    <button
                      type="button"
                      className="btn-delete-guest"
                      onClick={(e) => handleRemoveGuest(guest, e)}
                      title="Eliminar de la lista"
                      aria-label={`Eliminar ${guest} de la lista`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {filteredGuests.length === 0 && (
              <li className="no-results">No se encontraron invitados con ese nombre.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

