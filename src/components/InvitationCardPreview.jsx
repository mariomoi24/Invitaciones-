import React, { useRef, useEffect, useState, useCallback } from 'react';
import { renderInvitationCardToCanvas } from '../utils/generateCardCanvas';
import './InvitationCardPreview.css';

export default function InvitationCardPreview({ guestName, invitationUrl, passes }) {
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState('black-gold');
  const [isRendering, setIsRendering] = useState(true);
  const [copyStatus, setCopyStatus] = useState('');
  const [canShareFiles, setCanShareFiles] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.canShare === 'function') {
      try {
        const testFile = new File(['test'], 'test.png', { type: 'image/png' });
        setCanShareFiles(navigator.canShare({ files: [testFile] }));
      } catch {
        setCanShareFiles(false);
      }
    }
  }, []);

  const renderCard = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);
    try {
      await renderInvitationCardToCanvas(canvasRef.current, {
        guestName,
        invitationUrl,
        passes,
        theme
      });
    } catch (err) {
      console.error('Error rendering card canvas:', err);
    } finally {
      setIsRendering(false);
    }
  }, [guestName, invitationUrl, passes, theme]);

  useEffect(() => {
    renderCard();
  }, [renderCard]);

  const getCleanFileName = () => {
    const safeGuest = (guestName.trim() || 'Invitado')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    return `Invitacion_Graduacion_Mario_Moisa_${safeGuest}.png`;
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = getCleanFileName();
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      handleDownload();
      setCopyStatus('Descargando imagen (portapapeles no soportado)...');
      setTimeout(() => setCopyStatus(''), 3000);
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          handleDownload();
          return;
        }
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopyStatus('¡Imagen copiada al portapapeles! Ya puedes pegarla en WhatsApp');
          setTimeout(() => setCopyStatus(''), 3500);
        } catch (clipErr) {
          console.warn('Clipboard write failed, downloading instead:', clipErr);
          handleDownload();
          setCopyStatus('Imagen descargada en tu dispositivo');
          setTimeout(() => setCopyStatus(''), 3000);
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
      handleDownload();
    }
  };

  const handleShareCard = async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], getCleanFileName(), { type: 'image/png' });
        const shareData = {
          title: `Invitación de Graduación - ${guestName.trim()}`,
          text: `¡Hola! Te comparto tu invitación personal para mi celebración de graduación:\n${invitationUrl}`,
          files: [file]
        };

        if (canShareFiles && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else if (navigator.share) {
          await navigator.share({
            title: `Invitación de Graduación - ${guestName.trim()}`,
            text: `¡Hola! Te comparto tu invitación personal para mi graduación: ${invitationUrl}`,
            url: invitationUrl
          });
        } else {
          handleDownload();
        }
      }, 'image/png');
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error('Error sharing image:', err);
      }
    }
  };

  return (
    <div className="card-preview-wrapper">
      <div className="card-preview-header">
        <div className="card-preview-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <h3>Tarjeta de Invitación Digital (PNG)</h3>
        </div>
        
        <div className="theme-selector">
          <span className="theme-label">Estilo:</span>
          <button
            type="button"
            className={`btn-theme ${theme === 'black-gold' ? 'active' : ''}`}
            onClick={() => setTheme('black-gold')}
            title="Negro y Oro Imperial"
          >
            Oro Imperial
          </button>
          <button
            type="button"
            className={`btn-theme ${theme === 'royal-navy' ? 'active' : ''}`}
            onClick={() => setTheme('royal-navy')}
            title="Azul Noche Real"
          >
            Azul Noche
          </button>
        </div>
      </div>

      <p className="card-preview-subtitle">
        Esta tarjeta personalizada incluye el nombre del invitado y el <b>código QR dinámico</b> enlazado a su invitación interactiva:
      </p>

      {/* Canvas Viewport */}
      <div className="canvas-container">
        {isRendering && (
          <div className="canvas-loading-overlay">
            <div className="spinner"></div>
            <span>Generando diseño de alta resolución...</span>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="invitation-canvas"
          title={`Invitación para ${guestName}`}
        />
      </div>

      {copyStatus && (
        <div className="copy-feedback-banner">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          {copyStatus}
        </div>
      )}

      {/* Action Buttons for the Image */}
      <div className="card-action-buttons">
        <button type="button" className="btn-card-action btn-download" onClick={handleDownload}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
          </svg>
          Descargar Imagen (PNG)
        </button>

        <button type="button" className="btn-card-action btn-copy-img" onClick={handleCopyImage}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          Copiar Imagen
        </button>

        <button type="button" className="btn-card-action btn-share-img" onClick={handleShareCard}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
          </svg>
          Compartir Tarjeta
        </button>
      </div>
    </div>
  );
}
