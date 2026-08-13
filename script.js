let currentStep = 0;
const totalSteps = 6;
let chartInstance = null;

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

  // Quando chegar no passo 6, renderiza o gráfico
  if (currentStep === 6 && !chartInstance) {
    renderGraph();
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

// Função para desenhar o gráfico da parábola f(x) = x² - 4x + 3
function renderGraph() {
  const ctx = document.getElementById('parabolaChart').getContext('2d');

  // Gerar pontos de x de -2 até 6 para centralizar bem
  const xValues = [];
  const yValues = [];
  for (let x = -1.5; x <= 5.5; x += 0.1) {
    xValues.push(x.toFixed(1));
    yValues.push((x * x) - (4 * x) + 3);
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [
        {
          label: 'f(x) = x² - 4x + 3',
          data: yValues,
          borderColor: '#8a2be2',
          borderWidth: 3,
          fill: false,
          tension: 0.3,
          pointRadius: 0
        },
        // Dataset separado para pontos notáveis com anotações
        {
          label: 'Pontos Notáveis',
          data: [
            { x: '0.0', y: 3 },  // Eixo Y
            { x: '1.0', y: 0 },  // Raiz 1
            { x: '2.0', y: -1 }, // Vértice
            { x: '3.0', y: 0 }   // Raiz 2
          ],
          backgroundColor: '#3fb950',
          borderColor: '#ffffff',
          pointRadius: 6,
          pointHoverRadius: 8,
          showLine: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
          padding: {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10
          }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (context.parsed.y !== null) {
                        if (context.dataIndex === 0 && context.datasetIndex === 1) return 'Interseção Y: (0, 3)';
                        if (context.dataIndex === 1 && context.datasetIndex === 1) return 'Raiz x1: (1, 0)';
                        if (context.dataIndex === 2 && context.datasetIndex === 1) return 'Vértice (Mínimo): (2, -1)';
                        if (context.dataIndex === 3 && context.datasetIndex === 1) return 'Raiz x2: (3, 0)';
                    }
                    return label;
                }
            }
        }
      },
      scales: {
        x: {
          type: 'category',
          grid: { 
              color: '#30363d',
              lineWidth: 1
          },
          ticks: { 
              color: '#8b949e', 
              font: { size: 9 },
              // Exibir apenas inteiros nos ticks principais
              callback: function(value, index, values) {
                  const label = this.getLabelForValue(value);
                  if (label % 1 === 0) return label;
                  return '';
              }
          }
        },
        y: {
          grid: { 
              color: '#30363d',
              lineWidth: 1
          },
          ticks: { 
              color: '#8b949e', 
              font: { size: 9 },
              stepSize: 1
          }
        }
      }
    }
  });
}
