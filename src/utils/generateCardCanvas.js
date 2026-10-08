import QRCode from 'qrcode';

/**
 * Renders a high-resolution luxury graduation invitation card onto an HTML5 Canvas.
 * Resolution: 1080 x 1440 (standard 3:4 portrait flyer for WhatsApp/Instagram).
 */
export async function renderInvitationCardToCanvas(canvas, {
  guestName = 'Invitado Especial',
  invitationUrl = '',
  passes = '',
  theme = 'black-gold' // 'black-gold' or 'royal-navy'
}) {
  if (!canvas) return;

  // Ensure Google Fonts are loaded
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Fonts ready check error', e);
    }
  }

  const width = 1080;
  const height = 1440;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Palettes
  const isNavy = theme === 'royal-navy';
  const bgDark = isNavy ? '#080c16' : '#07080d';
  const bgMid = isNavy ? '#0e172a' : '#12141e';
  const goldPrimary = '#d4af37';
  const goldLight = '#f8ecc2';
  const goldDark = '#9f7f22';
  const textWhite = '#ffffff';
  const textMuted = '#9ca3af';

  // 1. Background Gradient
  const bgGrad = ctx.createRadialGradient(width / 2, 280, 50, width / 2, height / 2, 850);
  bgGrad.addColorStop(0, bgMid);
  bgGrad.addColorStop(1, bgDark);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle gold glowing spots
  const topGlow = ctx.createRadialGradient(width / 2, 120, 10, width / 2, 120, 420);
  topGlow.addColorStop(0, 'rgba(212, 175, 55, 0.18)');
  topGlow.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, width, height);

  const bottomGlow = ctx.createRadialGradient(width / 2, height - 150, 10, width / 2, height - 150, 380);
  bottomGlow.addColorStop(0, 'rgba(212, 175, 55, 0.12)');
  bottomGlow.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = bottomGlow;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative stars/sparkles
  drawSparkle(ctx, 160, 160, 4, goldLight);
  drawSparkle(ctx, 920, 180, 5, goldLight);
  drawSparkle(ctx, 140, 800, 3, goldLight);
  drawSparkle(ctx, 940, 840, 4, goldLight);
  drawSparkle(ctx, 220, 1340, 3, goldLight);
  drawSparkle(ctx, 880, 1320, 4, goldLight);

  // 2. Borders & Corner Ornaments
  const m1 = 44; // outer margin
  const m2 = 56; // inner margin

  // Outer border
  ctx.strokeStyle = goldPrimary;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(m1, m1, width - m1 * 2, height - m1 * 2);

  // Inner border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(m2, m2, width - m2 * 2, height - m2 * 2);

  // Draw corner ornaments
  drawCornerOrnament(ctx, m1, m1, 1, 1, goldPrimary);
  drawCornerOrnament(ctx, width - m1, m1, -1, 1, goldPrimary);
  drawCornerOrnament(ctx, m1, height - m1, 1, -1, goldPrimary);
  drawCornerOrnament(ctx, width - m1, height - m1, -1, -1, goldPrimary);

  // 3. Header Emblem & Kicker
  drawGradCapEmblem(ctx, width / 2, 125, goldPrimary, goldLight);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Kicker
  ctx.font = '600 15px "Montserrat", sans-serif';
  ctx.fillStyle = goldPrimary;
  ctx.letterSpacing = '5px';
  ctx.fillText('INVITACIÓN ESPECIAL DE HONOR', width / 2, 205);
  ctx.letterSpacing = '0px';

  // Title "GRADUACIÓN"
  const gradTitle = ctx.createLinearGradient(width / 2 - 250, 0, width / 2 + 250, 0);
  gradTitle.addColorStop(0, '#fff4cb');
  gradTitle.addColorStop(0.5, goldPrimary);
  gradTitle.addColorStop(1, '#dfb941');
  ctx.fillStyle = gradTitle;
  ctx.font = '700 50px "Playfair Display", serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('GRADUACIÓN', width / 2, 260);
  ctx.letterSpacing = '0px';

  // Year "2026"
  ctx.font = '600 17px "Montserrat", sans-serif';
  ctx.fillStyle = goldLight;
  ctx.letterSpacing = '7px';
  ctx.fillText('• 2 0 2 6 •', width / 2, 305);
  ctx.letterSpacing = '0px';

  // Separator line with diamond
  drawDiamondSeparator(ctx, width / 2, 335, 360, goldPrimary);

  // Graduate Name & Degree
  ctx.fillStyle = textWhite;
  ctx.font = '700 30px "Playfair Display", serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('Mario Orlando Moisa Candray', width / 2, 380);
  ctx.letterSpacing = '0px';

  ctx.fillStyle = goldPrimary;
  ctx.font = '600 20px "Montserrat", sans-serif';
  ctx.fillText('Ingeniería Informática', width / 2, 420);

  ctx.fillStyle = textMuted;
  ctx.font = '400 15px "Montserrat", sans-serif';
  ctx.fillText('Universidad Centroamericana José Simeón Cañas (UCA)', width / 2, 448);

  // 4. Invitation Callout & Guest Name Card
  ctx.fillStyle = '#d1d5db';
  ctx.font = 'italic 400 18px "Playfair Display", serif';
  ctx.fillText('Tiene el agrado de invitar cordialmente a:', width / 2, 500);

  // Guest card container box
  const guestBoxX = 100;
  const guestBoxY = 530;
  const guestBoxW = 880;
  const guestBoxH = passes ? 124 : 106;

  ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
  roundRect(ctx, guestBoxX, guestBoxY, guestBoxW, guestBoxH, 16);
  ctx.fill();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, guestBoxX, guestBoxY, guestBoxW, guestBoxH, 16);
  ctx.stroke();

  // Guest Name with dynamic font size so it never clips
  const cleanName = guestName.trim() || 'Invitado Especial';
  let guestFontSize = 38;
  ctx.font = `italic 700 ${guestFontSize}px "Playfair Display", serif`;
  while (ctx.measureText(cleanName).width > guestBoxW - 80 && guestFontSize > 22) {
    guestFontSize -= 2;
    ctx.font = `italic 700 ${guestFontSize}px "Playfair Display", serif`;
  }

  ctx.fillStyle = '#fff0ba';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
  ctx.shadowBlur = 15;
  const nameCenterY = passes ? guestBoxY + 50 : guestBoxY + guestBoxH / 2 + 2;
  ctx.fillText(cleanName, width / 2, nameCenterY);
  ctx.shadowBlur = 0;

  // Passes badge if provided
  if (passes) {
    ctx.fillStyle = goldPrimary;
    ctx.font = '600 14px "Montserrat", sans-serif';
    ctx.fillText(`🎟️ Válido para: ${passes}`, width / 2, guestBoxY + 95);
  }

  // 5. Event Schedule Grid (Acto & Celebración)
  const gridY = guestBoxY + guestBoxH + 30;
  const colW = 425;
  const colH = 135;
  const col1X = 100;
  const col2X = 555;

  // Box 1: Acto Académico
  drawInfoCard(ctx, col1X, gridY, colW, colH, [
    { text: '🎓 ACTO ACADÉMICO', font: '600 13px "Montserrat"', color: goldPrimary },
    { text: 'Viernes 30 de Octubre 2026', font: '700 16px "Montserrat"', color: textWhite },
    { text: 'Auditorio UCA', font: '400 14px "Montserrat"', color: textMuted }
  ]);

  // Box 2: Celebración
  drawInfoCard(ctx, col2X, gridY, colW, colH, [
    { text: '🥂 CELEBRACIÓN Y FIESTA', font: '600 13px "Montserrat"', color: goldPrimary },
    { text: 'Sábado 31 de Octubre · 5:30 p.m.', font: '700 16px "Montserrat"', color: textWhite },
    { text: 'La Pampa El Volcán', font: '600 14px "Montserrat"', color: goldLight }
  ]);

  // Reception details banner
  const bannerY = gridY + colH + 20;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  roundRect(ctx, 100, bannerY, 880, 48, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  roundRect(ctx, 100, bannerY, 880, 48, 10);
  ctx.stroke();

  ctx.fillStyle = goldLight;
  ctx.font = '500 14px "Montserrat", sans-serif';
  ctx.fillText('📍 Ubicación: La Pampa El Volcán    •    👔 Código de Vestimenta: Formal / Elegante', width / 2, bannerY + 25);

  // 6. QR Code Section (Enlace interactivo)
  const qrSectionY = bannerY + 70;
  const qrBoxH = 220;

  ctx.fillStyle = 'rgba(10, 12, 18, 0.7)';
  roundRect(ctx, 100, qrSectionY, 880, qrBoxH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1;
  roundRect(ctx, 100, qrSectionY, 880, qrBoxH, 16);
  ctx.stroke();

  // Generate QR Code data URL
  const qrUrlToEncode = invitationUrl || window.location.href;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrUrlToEncode, {
      margin: 1,
      width: 320,
      color: {
        dark: '#07080c',
        light: '#fbf9f1'
      }
    });

    const qrImg = new Image();
    await new Promise((resolve, reject) => {
      qrImg.onload = resolve;
      qrImg.onerror = reject;
      qrImg.src = qrDataUrl;
    });

    // Draw QR Code with gold border
    const qrSize = 160;
    const qrX = 140;
    const qrY = qrSectionY + (qrBoxH - qrSize) / 2;

    // QR background plate
    ctx.fillStyle = '#fbf9f1';
    roundRect(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 10);
    ctx.fill();

    ctx.strokeStyle = goldPrimary;
    ctx.lineWidth = 2;
    roundRect(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 10);
    ctx.stroke();

    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // Text beside QR code
    const textStartX = 340;
    ctx.textAlign = 'left';

    ctx.fillStyle = goldPrimary;
    ctx.font = '700 15px "Montserrat", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('INVITACIÓN DIGITAL INTERACTIVA', textStartX, qrSectionY + 45);
    ctx.letterSpacing = '0px';

    ctx.fillStyle = textWhite;
    ctx.font = '600 16px "Montserrat", sans-serif';
    ctx.fillText('Escanea el código QR con tu celular para:', textStartX, qrSectionY + 80);

    ctx.fillStyle = textMuted;
    ctx.font = '400 14px "Montserrat", sans-serif';
    ctx.fillText('• Confirmar tu asistencia directamente por WhatsApp', textStartX, qrSectionY + 115);
    ctx.fillText('• Abrir la ubicación directa en Google Maps / Waze', textStartX, qrSectionY + 145);
    ctx.fillText('• Agendar el evento automáticamente en Google Calendar', textStartX, qrSectionY + 175);
  } catch (err) {
    console.error('Error generating QR for canvas:', err);
  }

  // 7. Footer Signature & Decorative touch
  ctx.textAlign = 'center';
  ctx.fillStyle = goldLight;
  ctx.font = 'italic 500 19px "Playfair Display", serif';
  ctx.fillText('¡Será un honor compartir este logro inolvidable contigo!', width / 2, height - 90);

  ctx.fillStyle = '#6b7280';
  ctx.font = '400 12px "Montserrat", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('SAN SALVADOR, EL SALVADOR • OCTUBRE 2026', width / 2, height - 60);
  ctx.letterSpacing = '0px';
}

// Helper: Rounded Rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Helper: Diamond separator
function drawDiamondSeparator(ctx, cx, cy, width, color) {
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;

  // Left line
  ctx.beginPath();
  ctx.moveTo(cx - width / 2, cy);
  ctx.lineTo(cx - 18, cy);
  ctx.stroke();

  // Right line
  ctx.beginPath();
  ctx.moveTo(cx + 18, cy);
  ctx.lineTo(cx + width / 2, cy);
  ctx.stroke();

  // Center diamond
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 7);
  ctx.lineTo(cx + 7, cy);
  ctx.lineTo(cx, cy + 7);
  ctx.lineTo(cx - 7, cy);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Helper: Corner Ornament
function drawCornerOrnament(ctx, x, y, dirX, dirY, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;

  const len = 34;
  ctx.beginPath();
  ctx.moveTo(x, y + dirY * len);
  ctx.lineTo(x, y);
  ctx.lineTo(x + dirX * len, y);
  ctx.stroke();

  // Small corner dot/diamond
  ctx.beginPath();
  ctx.arc(x + dirX * 10, y + dirY * 10, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Helper: Sparkle star
function drawSparkle(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 2.2);
  ctx.quadraticCurveTo(cx, cy, cx + r * 2.2, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + r * 2.2);
  ctx.quadraticCurveTo(cx, cy, cx - r * 2.2, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - r * 2.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Helper: Graduation Cap Crest
function drawGradCapEmblem(ctx, cx, cy, color, accentColor) {
  ctx.save();
  // Outer circle
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 27, 0, Math.PI * 2);
  ctx.stroke();

  // Draw Cap Diamond
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 13);
  ctx.lineTo(cx + 17, cy - 5);
  ctx.lineTo(cx, cy + 3);
  ctx.lineTo(cx - 17, cy - 5);
  ctx.closePath();
  ctx.fill();

  // Cap base
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - 11, cy - 2);
  ctx.lineTo(cx - 11, cy + 7);
  ctx.quadraticCurveTo(cx, cy + 12, cx + 11, cy + 7);
  ctx.lineTo(cx + 11, cy - 2);
  ctx.quadraticCurveTo(cx, cy + 3, cx - 11, cy - 2);
  ctx.closePath();
  ctx.fill();

  // Tassel
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 5);
  ctx.lineTo(cx + 19, cy + 2);
  ctx.lineTo(cx + 19, cy + 13);
  ctx.stroke();

  ctx.restore();
}

// Helper: Info Card inside schedule
function drawInfoCard(ctx, x, y, w, h, lines) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 14);
  ctx.stroke();

  ctx.textAlign = 'center';
  const startY = y + 36;
  const spacing = 32;

  lines.forEach((line, idx) => {
    ctx.font = line.font;
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, x + w / 2, startY + idx * spacing);
  });
}
