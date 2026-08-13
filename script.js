let currentStep = 0;
const totalSteps = 6;
let graphDrawn = false;

function updateStep() {
  for (let i = 1; i <= totalSteps; i++) {
    const node = document.getElementById(`node-${i}`);
    const line = document.getElementById(`line-${i}`);

    if (i <= currentStep) {
      node.classList.add('visible');
      if (line) line.classList.add('active');
    } else {
      node.classList.remove('visible');
      if (line) line.classList.remove('active');
    }

    if (i === currentStep) {
      node.classList.add('active-highlight');
    } else {
      node.classList.remove('active-highlight');
    }
  }

  if (currentStep === 6 && !graphDrawn) {
    drawExactGraph();
    graphDrawn = true;
  }
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
  } else {
    currentStep = 0;
  }
  updateStep();
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    updateStep();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
    e.preventDefault();
    nextStep();
  } else if (e.code === 'ArrowLeft' || e.code === 'Backspace') {
    e.preventDefault();
    prevStep();
  }
});

function drawExactGraph() {
  const canvas = document.getElementById('parabolaChart');
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.parentElement.clientWidth || 300;
  canvas.height = canvas.parentElement.clientHeight || 220;

  const w = canvas.width;
  const h = canvas.height;

  // Definindo a origem (0,0) cartesiana
  const originX = w * 0.28; 
  const originY = h * 0.70;
  const scaleX = w / 5.5;
  const scaleY = h / 6.5;

  ctx.clearRect(0, 0, w, h);

  // 1. EIXO X (Linha Horizontal principal)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(15, originY);
  ctx.lineTo(w - 15, originY);
  ctx.stroke();

  // Seta X
  ctx.beginPath();
  ctx.moveTo(w - 15, originY - 4);
  ctx.lineTo(w - 5, originY);
  ctx.lineTo(w - 15, originY + 4);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // 2. EIXO Y (Linha Vertical principal)
  ctx.beginPath();
  ctx.moveTo(originX, h - 10);
  ctx.lineTo(originX, 10);
  ctx.stroke();

  // Seta Y
  ctx.beginPath();
  ctx.moveTo(originX - 4, 10);
  ctx.lineTo(originX, 2);
  ctx.lineTo(originX + 4, 10);
  ctx.fill();

  // Rótulo dos Eixos
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#58a6ff';
  ctx.fillText('X', w - 12, originY + 16);
  ctx.fillText('Y', originX - 16, 12);

  // Números nos eixos
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#8b949e';
  
  [1, 2, 3, 4].forEach(xVal => {
    let px = originX + xVal * scaleX;
    ctx.beginPath();
    ctx.moveTo(px, originY - 3);
    ctx.lineTo(px, originY + 3);
    ctx.strokeStyle = '#8b949e';
    ctx.stroke();
    ctx.fillText(xVal, px - 3, originY + 15);
  });

  [-1, 1, 2, 3].forEach(yVal => {
    let py = originY - yVal * scaleY;
    ctx.beginPath();
    ctx.moveTo(originX - 3, py);
    ctx.lineTo(originX + 3, py);
    ctx.strokeStyle = '#8b949e';
    ctx.stroke();
    ctx.fillText(yVal, originX - 16, py + 4);
  });

  // 3. PARÁBOLA f(x) = x² - 4x + 3
  ctx.beginPath();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;

  let first = true;
  for (let x = -0.5; x <= 4.5; x += 0.02) {
    let y = (x * x) - (4 * x) + 3;
    let px = originX + x * scaleX;
    let py = originY - y * scaleY;

    if (first) {
      ctx.moveTo(px, py);
      first = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // 4. LINHAS PONTIAGUDAS PARA O VÉRTICE (2, -1)
  let vx = originX + 2 * scaleX;
  let vy = originY - (-1) * scaleY;
  
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = '#58a6ff';
  ctx.lineWidth = 1;
  
  ctx.beginPath();
  ctx.moveTo(vx, originY);
  ctx.lineTo(vx, vy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(originX, vy);
  ctx.lineTo(vx, vy);
  ctx.stroke();

  ctx.setLineDash([]);

  // 5. PONTOS NOTÁVEIS (EXATOS NO LUGAR CERTO)
  const keyPoints = [
    { x: 0, y: 3, label: 'Corte Y (0, 3)', align: 'left' },
    { x: 1, y: 0, label: 'Raiz (1, 0)', align: 'top' },
    { x: 3, y: 0, label: 'Raiz (3, 0)', align: 'top' },
    { x: 2, y: -1, label: 'Vértice (2, -1)', align: 'bottom' }
  ];

  keyPoints.forEach(pt => {
    let px = originX + pt.x * scaleX;
    let py = originY - pt.y * scaleY;

    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#3fb950';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#3fb950';
    if (pt.align === 'left') ctx.fillText(pt.label, px + 8, py + 3);
    if (pt.align === 'top') ctx.fillText(pt.label, px - 20, py - 8);
    if (pt.align === 'bottom') ctx.fillText(pt.label, px - 30, py + 16);
  });
}
