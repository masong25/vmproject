(() => {
  const canvas = document.getElementById('snow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const defaults = { density: 180, gust: false, blizzard: false, colorCycle: false };
  let settings = { ...defaults };

  try {
    const saved = JSON.parse(localStorage.getItem('polar-snow-settings') || 'null');
    if (saved && typeof saved === 'object') settings = { ...settings, ...saved };
  } catch (err) {}

  const slider = document.getElementById('snow-amount');
  const windToggle = document.getElementById('wind-toggle');
  const blizzardToggle = document.getElementById('blizzard-toggle');
  const burstBtn = document.getElementById('burst-btn');
  const colorBtn = document.getElementById('color-btn');
  const flakeCounter = document.getElementById('flake-count');

  const quotes = [
    '"The best way to spread Christmas cheer is singing loud for all to hear." — Elf',
    '"Merry Christmas, ya filthy animal." — Home Alone 2',
    '"Seeing isn\'t believing. Believing is seeing." — The Santa Clause',
    '"Light the lamp, not the rat!" — The Muppet Christmas Carol',
    '"Christmas isn\'t just a day, it\'s a frame of mind." — Miracle on 34th Street',
    '"The bell still rings for me." — The Polar Express',
    '"Looks great! Little full, lotta sap." — Christmas Vacation',
    '"Faith is believing in things when common sense tells you not to." — Miracle on 34th Street',
    '"First we make snow angels for two hours, then we go ice skating." — Elf'
  ];

  const quoteBtn = document.getElementById('quote-btn');
  const quoteText = document.getElementById('quote-text');
  if (quoteBtn && quoteText) {
    quoteBtn.addEventListener('click', () => {
      const next = quotes[Math.floor(Math.random() * quotes.length)];
      quoteText.textContent = next;
      quoteText.classList.remove('pop');
      void quoteText.offsetWidth;
      quoteText.classList.add('pop');
    });
  }

  const feastSpecial = document.getElementById('special');
  const feastShuffle = document.getElementById('feast-shuffle');
  const specials = [
    'Maple-brûlé hot cocoa',
    'Spiced pear + rosemary fizz',
    'Gingerbread cheesecake jars',
    'Brown butter cranberry blondies',
    'Peppermint mocha affogato',
    'Clementine clove punch'
  ];
  if (feastShuffle && feastSpecial) {
    feastShuffle.addEventListener('click', () => {
      feastSpecial.textContent = specials[Math.floor(Math.random() * specials.length)];
    });
  }

  const meters = Array.from(document.querySelectorAll('[data-meter] span'));
  const opsRefresh = document.getElementById('ops-refresh');
  if (opsRefresh && meters.length) {
    opsRefresh.addEventListener('click', () => {
      meters.forEach((span) => {
        const value = Math.floor(Math.random() * 25) + 65;
        span.style.width = value + '%';
        span.textContent = span.textContent.replace(/\d+%/, value + '%');
      });
    });
  }

  let flakes = [];
  let angle = 0;
  let palette = [
    'rgba(255,255,255,0.9)',
    'rgba(108,243,197,0.8)',
    'rgba(255,73,109,0.8)',
    'rgba(102,167,255,0.8)'
  ];

  const cyclePalette = [
    ['rgba(255,255,255,0.9)', 'rgba(108,243,197,0.85)'],
    ['rgba(255,73,109,0.85)', 'rgba(102,167,255,0.85)'],
    ['rgba(255,255,255,0.9)', 'rgba(245,215,110,0.9)']
  ];
  let paletteIndex = 0;
  let paletteTimer = null;

  function saveSettings() {
    localStorage.setItem('polar-snow-settings', JSON.stringify(settings));
  }

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function targetCount() {
    const base = settings.density;
    return Math.floor(base * (settings.blizzard ? 1.8 : 1));
  }

  function addFlake(x = Math.random() * canvas.width, y = Math.random() * canvas.height) {
    const colorSet = palette;
    const color = colorSet[Math.floor(Math.random() * colorSet.length)];
    flakes.push({
      x,
      y,
      r: Math.random() * 3 + 1,
      d: Math.random() * 360,
      vx: Math.random() * 0.6 - 0.3,
      vy: Math.random() * 1.2 + 0.4,
      color
    });
  }

  function populate() {
    const desired = targetCount();
    if (flakes.length < desired) {
      for (let i = flakes.length; i < desired; i++) addFlake();
    } else if (flakes.length > desired) {
      flakes.length = desired;
    }
    if (flakeCounter) flakeCounter.textContent = String(flakes.length);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    flakes.forEach((f) => {
      ctx.fillStyle = f.color;
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    });
    ctx.fill();
  }

  function move() {
    angle += 0.002;
    const wind = settings.gust ? 0.7 : 0.3;
    flakes.forEach((f, i) => {
      f.y += Math.cos(angle + f.d) + 1 + f.r * 0.4;
      f.x += Math.sin(angle) * wind + f.vx;

      if (f.y > canvas.height) {
        flakes[i] = { ...f, x: Math.random() * canvas.width, y: -10 };
      }
      if (f.x > canvas.width || f.x < 0) {
        flakes[i].x = Math.random() * canvas.width;
      }
    });
  }

  function animate() {
    populate();
    move();
    draw();
    requestAnimationFrame(animate);
  }

  function addBurst(x, y) {
    for (let i = 0; i < 28; i++) addFlake(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 80);
    populate();
  }

  function startPaletteCycle() {
    if (paletteTimer) return;
    paletteTimer = setInterval(() => {
      paletteIndex = (paletteIndex + 1) % cyclePalette.length;
      palette = cyclePalette[paletteIndex];
    }, 1800);
  }

  function stopPaletteCycle() {
    clearInterval(paletteTimer);
    paletteTimer = null;
    palette = [
      'rgba(255,255,255,0.9)',
      'rgba(108,243,197,0.8)',
      'rgba(255,73,109,0.8)',
      'rgba(102,167,255,0.8)'
    ];
  }

  function syncUI() {
    if (slider) slider.value = settings.density;
    if (windToggle) windToggle.checked = settings.gust;
    if (blizzardToggle) blizzardToggle.checked = settings.blizzard;
  }

  function applyEvents() {
    if (slider) {
      slider.addEventListener('input', (e) => {
        settings.density = clamp(Number(e.target.value) || defaults.density, 40, 500);
        saveSettings();
        populate();
      });
    }
    if (windToggle) {
      windToggle.addEventListener('change', (e) => {
        settings.gust = e.target.checked;
        saveSettings();
      });
    }
    if (blizzardToggle) {
      blizzardToggle.addEventListener('change', (e) => {
        settings.blizzard = e.target.checked;
        saveSettings();
        populate();
      });
    }
    if (burstBtn) {
      burstBtn.addEventListener('click', () => addBurst(canvas.width / 2, canvas.height / 2));
    }
    if (colorBtn) {
      colorBtn.addEventListener('click', () => {
        settings.colorCycle = !settings.colorCycle;
        if (settings.colorCycle) startPaletteCycle();
        else stopPaletteCycle();
        saveSettings();
      });
    }
    window.addEventListener('click', (e) => {
      const target = e.target;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button'))) return;
      addBurst(e.clientX, e.clientY);
    });
  }

  resize();
  syncUI();
  populate();
  applyEvents();
  if (settings.colorCycle) startPaletteCycle();
  window.addEventListener('resize', resize);
  animate();
})();
