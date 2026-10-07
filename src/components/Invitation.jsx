import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Invitation.css';

export default function Invitation() {
  const [searchParams] = useSearchParams();
  const guestParam = searchParams.get('guest');
  const [guestName, setGuestName] = useState('Invitado Especial');

  useEffect(() => {
    if (guestParam && guestParam.trim() !== '') {
      setGuestName(guestParam);
      document.title = `Invitación - ${guestParam}`;
    } else {
      document.title = `Invitación a Graduación`;
    }
  }, [guestParam]);

  const phoneNumber = "50372124145";
  const message = `Hola Mario, soy ${guestName}. Quiero confirmar mi asistencia a tu celebración de graduación el sábado 31 de octubre de 2026 a las 5:30 p. m. en La Pampa El Volcán.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="invitation-container">
      <main className="glass-card">
        <div className="kicker">Invitación Especial</div>
        <h1>GRADUACIÓN</h1>
        
        <div className="invite-text">Con mucha alegría,</div>
        <div className="guest">{guestName}</div>
        <div className="invite-text">estás cordialmente invitado(a) a celebrar conmigo la culminación de mi carrera.</div>
        
        <div className="degree">
            <b>Ingeniería Informática</b>
            <span>Universidad Centroamericana José Simeón Cañas</span>
        </div>
        
        <div className="event-details">
            <div className="event-item">
                <h3>🎓 ACTO ACADÉMICO</h3>
                <p>Viernes 30 de oct. 2026</p>
            </div>
            <div class="event-item">
                <h3>🥂 CELEBRACIÓN</h3>
                <p>Sábado 31 de oct. 2026<br />5:30 p. m.</p>
            </div>
            <div className="event-item location-box">
                <h3>📍 LUGAR DE RECEPCIÓN</h3>
                <p>La Pampa El Volcán</p>
            </div>
        </div>
        
        <div className="buttons">
            <a className="btn btn-confirm" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Confirmar Asistencia
            </a>
            <a className="btn btn-map" href="https://www.google.com/maps/search/?api=1&query=La+Pampa+El+Volc%C3%A1n+El+Salvador" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Ver Ubicación
            </a>
        </div>
        
        <div className="signature">Mario Orlando Moisa Candray</div>
      </main>
    </div>
  );
}
