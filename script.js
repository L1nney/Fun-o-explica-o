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

  // Quando chegar no passo 6, desenha o gráfico cartesiano nativo
  if (currentStep === 6 && !graphDrawn) {
    drawCartesianGraph();
    graphDrawn = true;
  }
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
  } else {
    currentStep = 0; // Reinicia o mapa
  }
  updateStep();
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    updateStep();
  }
}

// Navegação por teclado (Espaço, Enter, Setas)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
    e.preventDefault();
    nextStep();
  } else if (e.code === 'ArrowLeft' || e.code === 'Backspace') {
    e.preventDefault();
    prevStep();
  }
});

// Desenha o gráfico cartesiano completo no estilo quadro/caderno
function drawCartesianGraph() {
  const canvas = document.getElementById('parabolaChart');
  const ctx = canvas.getContext('2d');

  // Ajustar resolução interna do canvas
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const width = canvas.width;
  const height = canvas.height;

  // Centro do plano cartesiano (Origem 0,0 na tela)
  const originX = width * 0.35;
  const originY = height * 0.65;
  const scale = 32; // Pixels por unidade matemática

  // Limpar tela
  ctx.clearRect(0, 0, width, height);

  // 1. DESENHAR LINHAS DA GRADE (GRID SUAVE)
  ctx.strokeStyle = '#21262d';
  ctx.lineWidth = 1;
  for (let x = -5; x <= 8; x++) {
    let px = originX + x * scale;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();
  }
  for (let y = -4; y <= 6; y++) {
    let py = originY - y * scale;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
    ctx.stroke();
  }

  // 2. DESENHAR EIXO X e EIXO Y PRINCIPAIS (DESTACADOS)
  ctx.strokeStyle = '#c9d1d9';
  ctx.lineWidth = 2;

  // Eixo X (Linha Horizontal)
  ctx.beginPath();
  ctx.moveTo(10, originY);
  ctx.lineTo(width - 10, originY);
  ctx.stroke();

  // Seta do Eixo X
  ctx.beginPath();
  ctx.moveTo(width - 10, originY - 5);
  ctx.lineTo(width - 2, originY);
  ctx.lineTo(width - 10, originY + 5);
  ctx.fillStyle = '#c9d1d9';
  ctx.fill();

  // Eixo Y (Linha Vertical)
  ctx.beginPath();
  ctx.moveTo(originX, height - 10);
  ctx.lineTo(originX, 10);
  ctx.stroke();

  // Seta do Eixo Y
  ctx.beginPath();
  ctx.moveTo(originX - 5, 10);
  ctx.lineTo(originX, 2);
  ctx.lineTo(originX + 5, 10);
  ctx.fill();

  // Rótulos dos Eixos X e Y
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('X', width - 18, originY + 18);
  ctx.fillText('Y', originX - 18, 15);

  // Marcações numéricas nos eixos
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#8b949e';
  for (let x = -2; x <= 5; x++) {
    if (x !== 0) {
      let px = originX + x * scale;
      ctx.fillText(x, px - 3, originY + 14);
    }
  }
  for (let y = -2; y <= 4; y++) {
    if (y !== 0) {
      let py = originY - y * scale;
      ctx.fillText(y, originX - 15, py + 4);
    }
  }

  // 3. DESENHAR A PARÁBOLA f(x) = x² - 4x + 3
  ctx.beginPath();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;

  let firstPoint = true;
  for (let x = -1.2; x <= 5.2; x += 0.05) {
    let y = (x * x) - (4 * x) + 3;
    let px = originX + x * scale;
    let py = originY - y * scale;

    if (firstPoint) {
      ctx.moveTo(px, py);
      firstPoint = false;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // 4. DESENHAR PONTOS NOTÁVEIS E SUAS ETIQUETAS
  const points = [
    { x: 0, y: 3, label: '(0,3) Y', align: 'right' },
    { x: 1, y: 0, label: 'x₁=(1,0)', align: 'top' },
    { x: 3, y: 0, label: 'x₂=(3,0)', align: 'top' },
    { x: 2, y: -1, label: 'V(2,-1)', align: 'bottom' }
  ];

  points.forEach(pt => {
    let px = originX + pt.x * scale;
    let py = originY - pt.y * scale;

    // Bolinha do Ponto
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#3fb950';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Texto do Ponto
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#58a6ff';
    if (pt.align === 'right') ctx.fillText(pt.label, px + 8, py + 4);
    if (pt.align === 'top') ctx.fillText(pt.label, px - 18, py - 8);
    if (pt.align === 'bottom') ctx.fillText(pt.label, px - 18, py + 18);
  });
}
