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

  const decorDefaults = { lights: true, workshop: false, cozy: false };
  let decor = { ...decorDefaults };
  try {
    const savedDecor = JSON.parse(localStorage.getItem('polar-decor-settings') || 'null');
    if (savedDecor && typeof savedDecor === 'object') decor = { ...decor, ...savedDecor };
  } catch (err) {}

  const slider = document.getElementById('snow-amount');
  const windToggle = document.getElementById('wind-toggle');
  const blizzardToggle = document.getElementById('blizzard-toggle');
  const burstBtn = document.getElementById('burst-btn');
  const colorBtn = document.getElementById('color-btn');
  const flakeCounter = document.getElementById('flake-count');
  const lightsBtn = document.getElementById('lights-btn');
  const twinkleBtn = document.getElementById('twinkle-btn');
  const workshopBtn = document.getElementById('workshop-btn');
  const cozyBtn = document.getElementById('cozy-btn');
  const garland = document.getElementById('garland');
  const workshopBg = document.getElementById('workshop-bg');
  const body = document.body;

  const quotes = [
    '"The best way to spread Christmas cheer is singing loud for all to hear." — Elf',
    '"Merry Christmas, ya filthy animal." — Home Alone 2',
    '"Keep the change, ya filthy animal." — Home Alone',
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

  const countdown = {
    days: Array.from(document.querySelectorAll('.countdown-days')),
    hours: Array.from(document.querySelectorAll('.countdown-hours')),
    minutes: Array.from(document.querySelectorAll('.countdown-minutes')),
    seconds: Array.from(document.querySelectorAll('.countdown-seconds')),
    notes: Array.from(document.querySelectorAll('.countdown-note'))
  };

  function updateCountdown() {
    if (!countdown.days.length) return;
    const now = new Date();
    const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
    const target = new Date(year, 11, 25, 0, 0, 0);
    const diff = target - now;
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.floor(totalSeconds / 86400);
    countdown.days.forEach((el) => (el.textContent = days));
    countdown.hours.forEach((el) => (el.textContent = hours.toString().padStart(2, '0')));
    countdown.minutes.forEach((el) => (el.textContent = minutes.toString().padStart(2, '0')));
    countdown.seconds.forEach((el) => (el.textContent = seconds.toString().padStart(2, '0')));
    countdown.notes.forEach((el) => {
      el.textContent = totalSeconds === 0 ? 'It is Christmas! Auto-rolls to next year soon.' : 'Auto-resets after 12/25.';
    });
  }

  function saveDecor() {
    localStorage.setItem('polar-decor-settings', JSON.stringify(decor));
  }

  const tributeQuotes = {
    homealone: [
      '"This is my house, I have to defend it."',
      '"Keep the change, ya filthy animal."',
      '"Guys, I\'m eating junk and watching rubbish. You better come out and stop me!"',
      '"Buzz, your girlfriend. Woof!"',
      '"I made my family disappear."',
      '"Fuller, go easy on the Pepsi."',
      '"I\'m not afraid anymore!"',
      '"He\'s a kid. Kids are stupid."',
      '"Look what you did, you little jerk."',
      '"Is this toothbrush approved by the American Dental Association?"'
    ],
    homealone2: [
      '"Merry Christmas, ya filthy animal."',
      '"Credit card? You got it!"',
      '"Nobody throws bricks at me and gets away with it!"',
      '"Hello, this is Peter McCallister, the father."',
      '"We never lose our luggage."',
      '"I\'d like a room with a giant bed, and a TV with some channels."',
      '"Stay out of trouble."',
      '"A limo and a pizza, compliments of the Plaza."',
      '"Suck brick, kid!"',
      '"You were here, and you were smooching with my brother!"'
    ],
    elf: [
      '"The best way to spread Christmas cheer is singing loud for all to hear."',
      '"I just like to smile. Smiling\'s my favorite."',
      '"You sit on a throne of lies!"',
      '"I\'m a cotton-headed ninny muggins."',
      '"We elves try to stick to the four main food groups: candy, candy canes, candy corns, and syrup."',
      '"Francisco! That\'s fun to say!"',
      '"I\'m sorry I ruined your lives and crammed 11 cookies into the VCR."',
      '"I passed through the seven levels of the Candy Cane forest."',
      '"Congratulations! World\'s best cup of coffee!"',
      '"Son of a nutcracker!"'
    ],
    vacation: [
      '"We checked every bulb, didn’t we?"',
      '"Hallelujah! Holy— where’s the Tylenol?"',
      '"You serious, Clark?"',
      '"If that thing had nine lives, she just spent ’em all."',
      '"Grace? She passed away thirty years ago."',
      '"Burn some dust here. Eat my rubber."',
      '"Where do you think you\'re going? Nobody\'s leaving."',
      '"Little lights, little lights, uh— not twinkling."',
      '"It\'s the gift that keeps on giving the whole year."',
      '"Clark, stop it! I don’t want to spend the holidays dead."'
    ],
    santaclause: [
      '"Seeing isn’t believing. Believing is seeing."',
      '"We’re your worst nightmare—elves with attitude."',
      '"Just because you can’t see something, doesn’t mean it doesn’t exist."',
      '"You killed him." "Did not!"',
      '"In putting on the suit and entering the sleigh, the wearer waives any and all rights."',
      '"We used to burn them, but nowadays it\'s politically incorrect."',
      '"Cookie?"',
      '"You’re the new Santa."',
      '"Elves with attitude!"',
      '"It\'s Santa. He\'s not even married."'
    ],
    grinch: [
      '"Hate, hate, hate. Double hate. Loathe entirely."',
      '"It came without ribbons. It came without tags."',
      '"Maybe Christmas doesn’t come from a store."',
      '"Am I just eating because I’m bored?"',
      '"The nerve of those Whos. Inviting me down there—and on such short notice!"',
      '"Cheer up, dude. It’s Christmas."',
      '"Oh, the noise! Noise! Noise! Noise!"',
      '"I\'m speaking in rhyme!"',
      '"Today was... great!"',
      '"Six o\'clock, dinner with me. I can’t cancel that again."'
    ],
    wonderful: [
      '"No man is a failure who has friends."',
      '"Every time a bell rings, an angel gets his wings."',
      '"I want to live again."',
      '"Look, Daddy. Teacher says every time a bell rings, an angel gets his wings."',
      '"You want the moon? Just say the word and I’ll throw a lasso around it."',
      '"Strange, isn’t it? Each man’s life touches so many other lives."',
      '"Attaboy, Clarence!"',
      '"This is a very interesting situation!"',
      '"Why must you torture the children?"',
      '"Remember, George: no man is a failure who has friends."'
    ],
    polar: [
      '"The bell still rings for me."',
      '"Seeing is believing, but sometimes the most real things in the world are the things we can’t see."',
      '"One thing about trains: It doesn’t matter where they’re going. What matters is deciding to get on."',
      '"Sometimes the most real things in the world are the things we can’t see."',
      '"Here we only got one rule: never ever let it cool."',
      '"The thing about trains... it doesn’t matter where they’re going."',
      '"All aboard!"',
      '"Seeing is believing."',
      '"The first gift of Christmas!"',
      '"I believe."'
    ],
    miracle: [
      '"Faith is believing when common sense tells you not to."',
      '"I believe... I believe... It’s silly, but I believe."',
      '"Oh, Christmas isn’t just a day, it’s a frame of mind."',
      '"Do you believe in Santa Claus?"',
      '"I speak French but not well."',
      '"You’re taking this all down in shorthand, aren’t you?"',
      '"I\'m not just a whimsical figure who wears a charming suit and affects a jolly demeanor."',
      '"All my life I\'ve wondered something."',
      '"Imagine Christmas in your heart."',
      '"If you can\'t accept anything on faith, then you\'re doomed."'
    ],
    klaus: [
      '"A true act of goodwill always sparks another."',
      '"A simple act of kindness always sparks another."',
      '"If you hadn’t been so selfish, none of this would have happened."',
      '"Desperate times call for desperate measures."',
      '"You are not the only one who has ever been left alone."',
      '"By doing good deeds, we make ourselves and others happier."',
      '"We need to be careful with what we say to people."',
      '"Dear Mr. Klaus..."',
      '"This is how we change things."',
      '"Just a postman and a toymaker."'
    ]
  };

  function bindTributeQuotes() {
    const buttons = document.querySelectorAll('.tribute-quote-btn');
    buttons.forEach((btn) => {
      const movie = btn.getAttribute('data-movie');
      const target = document.querySelector(`.tribute-quote[data-quote=\"${movie}\"]`);
      const list = tributeQuotes[movie] || [];
      if (!target || !list.length) return;
      btn.addEventListener('click', () => {
        const current = target.textContent || '';
        let next = list[Math.floor(Math.random() * list.length)];
        if (list.length > 1) {
          while (next === current) {
            next = list[Math.floor(Math.random() * list.length)];
          }
        }
        target.textContent = next;
        target.classList.remove('pop');
        void target.offsetWidth;
        target.classList.add('pop');
      });
    });
  }

  function syncDecor() {
    if (garland) {
      garland.classList.toggle('off', !decor.lights);
    }
    body.classList.toggle('lights-off', !decor.lights);
    body.classList.toggle('lights-on', decor.lights);
    body.classList.toggle('workshop-on', decor.workshop);
    if (workshopBg) workshopBg.classList.toggle('active', decor.workshop);
    body.classList.toggle('cozy', decor.cozy);
  }

  let flakes = [];
  let angle = 0;
  let burstBoost = 0;
  const mouse = { x: 0, y: 0, active: false };
  let palette = [
    'rgba(255,255,255,0.9)',
    'rgba(225,59,63,0.85)',
    'rgba(31,191,104,0.85)',
    'rgba(240,199,94,0.85)'
  ];

  const cyclePalette = [
    ['rgba(255,255,255,0.9)', 'rgba(31,191,104,0.85)'],
    ['rgba(225,59,63,0.88)', 'rgba(240,199,94,0.9)'],
    ['rgba(255,255,255,0.9)', 'rgba(225,59,63,0.88)']
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
    return Math.floor(base * (settings.blizzard ? 1.8 : 1)) + burstBoost;
  }

  function addFlake(x = Math.random() * canvas.width, y = Math.random() * canvas.height, impulse = null) {
    const colorSet = palette;
    const color = colorSet[Math.floor(Math.random() * colorSet.length)];
    const baseVx = Math.random() * 0.6 - 0.3;
    const baseVy = Math.random() * 1.2 + 0.4;
    const ivx = impulse ? impulse.vx : 0;
    const ivy = impulse ? impulse.vy : 0;
    flakes.push({
      x,
      y,
      r: Math.random() * 3 + 1,
      d: Math.random() * 360,
      vx: baseVx + ivx,
      vy: baseVy + ivy,
      burstLife: impulse ? impulse.life : 0,
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
      if (mouse.active) {
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 160) {
          const force = (160 - dist) / 160 * 0.55;
          f.vx += (dx / dist) * force;
          f.vy += (dy / dist) * force;
        }
      }
      if (f.burstLife && f.burstLife > 0) {
        f.x += f.vx * 1.2;
        f.y += f.vy * 1.2;
        f.vx *= 0.98;
        f.vy *= 0.98;
        f.burstLife -= 1;
      }

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
    if (burstBoost > 0) {
      burstBoost = Math.max(0, burstBoost - 1);
    }
    requestAnimationFrame(animate);
  }

  function addBurst(x, y) {
    for (let i = 0; i < 36; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * 80;
      const px = x + Math.cos(ang) * dist;
      const py = y + Math.sin(ang) * dist;
      const impulse = { vx: Math.cos(ang) * 1.8, vy: Math.sin(ang) * 1.8, life: 35 };
      addFlake(px, py, impulse);
    }
    burstBoost = Math.min(240, burstBoost + 60);
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
      'rgba(225,59,63,0.85)',
      'rgba(31,191,104,0.85)',
      'rgba(240,199,94,0.85)'
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
    window.addEventListener('mousemove', (e) => {
      mouse.active = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
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
    if (lightsBtn) {
      lightsBtn.addEventListener('click', () => {
        decor.lights = !decor.lights;
        saveDecor();
        syncDecor();
      });
    }
    if (twinkleBtn) {
      twinkleBtn.addEventListener('click', () => {
        body.classList.add('lights-twinkle');
        if (garland) garland.classList.add('twinkle');
        setTimeout(() => {
          body.classList.remove('lights-twinkle');
          if (garland) garland.classList.remove('twinkle');
        }, 2600);
      });
    }
    if (workshopBtn) {
      workshopBtn.addEventListener('click', () => {
        decor.workshop = !decor.workshop;
        saveDecor();
        syncDecor();
      });
    }
    if (cozyBtn) {
      cozyBtn.addEventListener('click', () => {
        decor.cozy = !decor.cozy;
        saveDecor();
        syncDecor();
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
  updateCountdown();
  setInterval(updateCountdown, 1000);
  syncDecor();
})();
