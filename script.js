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

  // Quando chega na etapa 6, desenha o gráfico cartesiano perfeito
  if (currentStep === 6 && !graphDrawn) {
    drawExactCartesianGraph();
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

// Navegação por teclado
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
    e.preventDefault();
    nextStep();
  } else if (e.code === 'ArrowLeft' || e.code === 'Backspace') {
    e.preventDefault();
    prevStep();
  }
});

// Desenha o Plano Cartesiano Exato com Eixos X e Y
function drawExactCartesianGraph() {
  const canvas = document.getElementById('parabolaChart');
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.parentElement.clientWidth || 320;
  canvas.height = canvas.parentElement.clientHeight || 260;

  const w = canvas.width;
  const h = canvas.height;

  // Posição central da Origem (0,0) no gráfico
  const originX = w * 0.30; 
  const originY = h * 0.68;
  const scaleX = w / 6;  // Escala em pixels por unidade
  const scaleY = h / 7;

  ctx.clearRect(0, 0, w, h);

  // 1. EIXO X (LINHA HORIZONTAL PRINCIPAL)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, originY);
  ctx.lineTo(w - 10, originY);
  ctx.stroke();

  // Seta do Eixo X
  ctx.beginPath();
  ctx.moveTo(w - 10, originY - 4);
  ctx.lineTo(w - 2, originY);
  ctx.lineTo(w - 10, originY + 4);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // 2. EIXO Y (LINHA VERTICAL PRINCIPAL)
  ctx.beginPath();
  ctx.moveTo(originX, h - 10);
  ctx.lineTo(originX, 10);
  ctx.stroke();

  // Seta do Eixo Y
  ctx.beginPath();
  ctx.moveTo(originX - 4, 10);
  ctx.lineTo(originX, 2);
  ctx.lineTo(originX + 4, 10);
  ctx.fill();

  // Nomes dos Eixos
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#58a6ff';
  ctx.fillText('X', w - 12, originY + 16);
  ctx.fillText('Y', originX - 16, 12);

  // Marcações e Números do Eixo X (1, 2, 3, 4)
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

  // Marcações e Números do Eixo Y (-1, 1, 2, 3)
  [-1, 1, 2, 3].forEach(yVal => {
    let py = originY - yVal * scaleY;
    ctx.beginPath();
    ctx.moveTo(originX - 3, py);
    ctx.lineTo(originX + 3, py);
    ctx.strokeStyle = '#8b949e';
    ctx.stroke();
    ctx.fillText(yVal, originX - 16, py + 4);
  });

  // 3. DESENHO DA PARÁBOLA f(x) = x² - 4x + 3
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

  // 4. LINHAS PONTIAGUDAS CONECTANDO O VÉRTICE (Xv=2 e Yv=-1)
  let vx = originX + 2 * scaleX;
  let vy = originY - (-1) * scaleY;
  
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = '#58a6ff';
  ctx.lineWidth = 1;
  
  // Linha vertical ligando x=2 ao vértice
  ctx.beginPath();
  ctx.moveTo(vx, originY);
  ctx.lineTo(vx, vy);
  ctx.stroke();

  // Linha horizontal ligando y=-1 ao vértice
  ctx.beginPath();
  ctx.moveTo(originX, vy);
  ctx.lineTo(vx, vy);
  ctx.stroke();

  ctx.setLineDash([]); // Volta à linha normal

  // 5. PONTOS DE DESTAQUE (EM CIMA DOS EIXOS)
  const keyPoints = [
    { x: 0, y: 3, label: 'Intercepto Y (0, 3)', align: 'left' },
    { x: 1, y: 0, label: 'Raiz x₁ (1, 0)', align: 'top' },
    { x: 3, y: 0, label: 'Raiz x₂ (3, 0)', align: 'top' },
    { x: 2, y: -1, label: 'Vértice (2, -1)', align: 'bottom' }
  ];

  keyPoints.forEach(pt => {
    let px = originX + pt.x * scaleX;
    let py = originY - pt.y * scaleY;

    // Bolinha verde no ponto exato
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#3fb950';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Rótulo do Ponto
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#3fb950';
    if (pt.align === 'left') ctx.fillText(pt.label, px + 8, py + 3);
    if (pt.align === 'top') ctx.fillText(pt.label, px - 25, py - 8);
    if (pt.align === 'bottom') ctx.fillText(pt.label, px - 35, py + 16);
  });
}
