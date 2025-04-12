// Dummy cost rates
const materialRates = {
    cement: 120,
    bricks: 10,
    steel: 80
  };
  const laborRate = 500; // per hour
  const overheadPercentage = 10;
  
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('projectForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const length = parseFloat(data.get('length'));
        const width = parseFloat(data.get('width'));
        const labor = parseFloat(data.get('labor'));
        const material = data.get('material');
  
        const area = length * width;
        const materialCost = area * materialRates[material];
        const laborCost = labor * laborRate;
        const overheadCost = 0.1 * (materialCost + laborCost);
        const totalCost = materialCost + laborCost + overheadCost;
  
        sessionStorage.setItem('materialCost', materialCost);
        sessionStorage.setItem('laborCost', laborCost);
        sessionStorage.setItem('overheadCost', overheadCost);
        sessionStorage.setItem('totalCost', totalCost);
  
        window.location.href = 'dashboard.html';
      });
    }
  
    // Fill dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
      document.getElementById('materialCost').innerText = sessionStorage.getItem('materialCost');
      document.getElementById('laborCost').innerText = sessionStorage.getItem('laborCost');
      document.getElementById('overheadCost').innerText = sessionStorage.getItem('overheadCost');
      document.getElementById('totalCost').innerText = sessionStorage.getItem('totalCost');
    }
  });
  function toggleTheme() {
    const theme = document.getElementById('theme-style');
    if (theme.getAttribute('href') === 'light.css') {
      theme.setAttribute('href', 'dark.css');
    } else {
      theme.setAttribute('href', 'light.css');
    }
  }
  const costChart = document.getElementById('costChart').getContext('2d');
  new Chart(costChart, {
    type: 'pie',
    data: {
      labels: ['Material', 'Labor', 'Overhead'],
      datasets: [{
        data: [
          sessionStorage.getItem('materialCost'),
          sessionStorage.getItem('laborCost'),
          sessionStorage.getItem('overheadCost')
        ],
        backgroundColor: ['#007bff', '#28a745', '#ffc107']
      }]
    }
  });
  fetch('http://localhost:3000/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ length, width, material, labor })
  })
  .then(res => res.json())
  .then(data => {
    sessionStorage.setItem('materialCost', data.materialCost);
    sessionStorage.setItem('laborCost', data.laborCost);
    sessionStorage.setItem('overheadCost', data.overhead);
    sessionStorage.setItem('totalCost', data.total);
    window.location.href = 'dashboard.html';
  });
  