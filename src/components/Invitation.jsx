import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { renderInvitationCardToCanvas } from '../utils/generateCardCanvas';
import './Invitation.css';

function calculateTimeLeft() {
  // Sábado 31 de octubre de 2026 a las 5:30 p.m. (El Salvador UTC-6)
  const targetDate = new Date('2026-10-31T17:30:00-06:00').getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isPast: false
  };
}

export default function Invitation() {
  const [searchParams] = useSearchParams();
  const guestParam = searchParams.get('guest');
  const passesParam = searchParams.get('passes');

  // Derive guest name without causing cascading renders
  const guestName = guestParam?.trim() || 'Invitado Especial';

  // Countdown state
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const [downloadingCard, setDownloadingCard] = useState(false);

  useEffect(() => {
    if (guestParam && guestParam.trim() !== '') {
      document.title = `Invitación - ${guestParam.trim()}`;
    } else {
      document.title = 'Invitación a Graduación | Mario Orlando Moisa Candray';
    }
  }, [guestParam]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const phoneNumber = "50372124145";
  const confirmationMessage = `Hola Mario, soy ${guestName}. Quiero confirmar mi asistencia a tu celebración de graduación el sábado 31 de octubre de 2026 a las 5:30 p. m. en La Pampa El Volcán.${passesParam ? ` (${passesParam})` : ''}`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(confirmationMessage)}`;

  // Google Calendar URL
  const calendarTitle = encodeURIComponent("Celebración de Graduación - Mario Moisa");
  const calendarDetails = encodeURIComponent(`Celebración de graduación de Ingeniería Informática (UCA) de Mario Orlando Moisa Candray.\nInvitado: ${guestName}.\n¡Te esperamos para celebrar!`);
  const calendarLocation = encodeURIComponent("La Pampa El Volcán, El Salvador");
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=20261031T173000/20261031T230000&ctz=America/El_Salvador&details=${calendarDetails}&location=${calendarLocation}`;

  // Waze URL
  const wazeUrl = "https://waze.com/ul?q=La+Pampa+El+Volcan+El+Salvador";

  const handleDownloadCard = async () => {
    setDownloadingCard(true);
    try {
      const offscreenCanvas = document.createElement('canvas');
      await renderInvitationCardToCanvas(offscreenCanvas, {
        guestName,
        invitationUrl: window.location.href,
        passes: passesParam || ''
      });
      const link = document.createElement('a');
      const safeGuest = guestName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `Pase_Graduacion_Mario_Moisa_${safeGuest}.png`;
      link.href = offscreenCanvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (e) {
      console.error('Error downloading card from invitation:', e);
    } finally {
      setDownloadingCard(false);
    }
  };

  return (
    <div className="invitation-container">
      <main className="glass-card">
        <div className="kicker">Invitación Especial</div>
        <h1>GRADUACIÓN</h1>
        
        <div className="invite-text">Con mucha alegría,</div>
        <div className="guest">{guestName}</div>

        {passesParam && (
          <div className="passes-badge">
            <span className="passes-badge-icon">🎟️</span>
            <span>Válido para: <strong>{passesParam}</strong></span>
          </div>
        )}

        <div className="invite-text">estás cordialmente invitado(a) a celebrar conmigo la culminación de mi carrera.</div>
        
        <div className="degree">
          <b>Ingeniería Informática</b>
          <span>Universidad Centroamericana José Simeón Cañas</span>
        </div>

        {/* Cuenta Regresiva */}
        {!timeLeft.isPast && (
          <div className="countdown-section">
            <div className="countdown-title">Faltan para la celebración:</div>
            <div className="countdown-grid">
              <div className="countdown-item">
                <span className="count-value">{timeLeft.days}</span>
                <span className="count-label">Días</span>
              </div>
              <div className="countdown-divider">:</div>
              <div className="countdown-item">
                <span className="count-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="count-label">Horas</span>
              </div>
              <div className="countdown-divider">:</div>
              <div className="countdown-item">
                <span className="count-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="count-label">Min</span>
              </div>
              <div className="countdown-divider">:</div>
              <div className="countdown-item">
                <span className="count-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="count-label">Seg</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="event-details">
          <div className="event-item">
            <h3>🎓 ACTO ACADÉMICO</h3>
            <p>Viernes 30 de oct. 2026</p>
          </div>
          <div className="event-item">
            <h3>🥂 CELEBRACIÓN</h3>
            <p>Sábado 31 de oct. 2026<br />5:30 p. m.</p>
          </div>
          <div className="event-item location-box">
            <h3>📍 LUGAR DE RECEPCIÓN</h3>
            <p>La Pampa El Volcán</p>
          </div>
          <div className="event-item dress-code-box">
            <h3>👔 CÓDIGO DE VESTIMENTA</h3>
            <p>Formal / Elegante</p>
          </div>
        </div>
        
        <div className="buttons">
          <a className="btn btn-confirm" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.43 0-2.82-.37-4.05-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.17 8.17 0 0 1-1.25-4.47c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.18-.48-.3z"/>
            </svg>
            Confirmar Asistencia
          </a>

          <button 
            type="button" 
            className="btn btn-save-pass" 
            onClick={handleDownloadCard} 
            disabled={downloadingCard}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
            </svg>
            {downloadingCard ? 'Generando pase...' : 'Descargar Pase en Imagen (PNG)'}
          </button>

          <div className="btn-secondary-group">
            <a className="btn btn-map" href="https://www.google.com/maps/search/?api=1&query=La+Pampa+El+Volc%C3%A1n+El+Salvador" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Google Maps
            </a>

            <a className="btn btn-waze" href={wazeUrl} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.16 6.84 9.47.19.06.4-.04.47-.23.07-.19-.04-.4-.23-.47C5.45 19.53 3 16.05 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9c0 3.82-2.38 7.1-5.78 8.41-.19.07-.29.29-.22.48.07.19.29.29.48.22C19.16 19.64 22 16.14 22 12c0-5.52-4.48-10-10-10zm-3 8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm6 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
              </svg>
              Abrir en Waze
            </a>

            <a className="btn btn-calendar" href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7v-5z"/>
              </svg>
              Google Calendar
            </a>
          </div>
        </div>
        
        <div className="signature">Mario Orlando Moisa Candray</div>
      </main>
    </div>
  );
}

