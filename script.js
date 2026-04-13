// ---------- CONFIGURATION ---------- //
const COLOR_CATEGORIES = [
  {
    name: 'Core Brand Colors',
    colors: [
      { name: 'Deep Purple', hex: '#5B0333', usage: 'Best suitable for text instead of black (and for backgrounds)' },
      { name: 'Medium Pink', hex: '#CF379D', usage: 'Best suited to highlight and emphasize and also action buttons or CTAs' },
      { name: 'Light Pink', hex: '#FFAEE7', usage: 'Best suitable for backgrounds' },
      { name: 'Very Light Pink', hex: '#FFCAF0' },
      { name: 'Pale Pink', hex: '#FFECFB' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    name: 'Her V Flora',
    colors: [
      { name: 'Dark Green', hex: '#2A3D27' },
      { name: 'Light Green', hex: '#BADEAA' },
      { name: 'Very Light Green', hex: '#DAFEAA' }
    ]
  },
  {
    name: 'Inositol Blend',
    colors: [
      { name: 'Coral', hex: '#C85B3F' },
      { name: 'Inositol Peach', hex: '#FDE3D9' }
    ]
  },
  {
    name: 'Her-Meno',
    colors: [
      { name: 'Soft Mauve', hex: '#DAA5B6' },
      { name: 'Meno Pink', hex: '#FCD0E8' }
    ]
  },
  {
    name: 'Her Zenergy',
    colors: [
      { name: 'Berry Magenta', hex: '#92224D' },
      { name: 'Zenergy Rose', hex: '#FCEEF2' }
    ]
  }
];

const ALLOWED_COMBINATIONS = {
  '#5B0333': ['#FFFFFF', '#FFECFB', '#FFCAF0', '#DAFEAA', '#BADEAA', '#FDE3D9', '#FCD0E8', '#FCEEF2'],
  '#CF379D': ['#FFFFFF', '#FFECFB', '#FFCAF0'],
  '#FFFFFF': ['#5B0333', '#CF379D', '#2A3D27', '#000000'],
  '#FFECFB': ['#5B0333', '#CF379D'],
  '#FFCAF0': ['#5B0333', '#CF379D'],
  '#2A3D27': ['#FFFFFF', '#BADEAA', '#DAFEAA', '#F9F9F9'],
  '#BADEAA': ['#2A3D27', '#5B0333'],
  '#DAFEAA': ['#2A3D27', '#5B0333'],
  '#000000': ['#FFECFB', '#FFCAF0', '#DAFEAA', '#BADEAA', '#FFFFFF'],
  
  // Product interactions
  '#C85B3F': ['#FDE3D9', '#FFFFFF', '#F9F9F9'],
  '#DAA5B6': ['#FCD0E8', '#5B0333', '#FFFFFF', '#F9F9F9'],
  '#92224D': ['#FCEEF2', '#FFFFFF', '#F9F9F9']
};


// ---------- INITIALIZATION ---------- //
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Render static colour grids dynamically
  renderStaticPalettes();
  
  // Render Interactive Swatches
  renderInteractiveSwatches();
  
  // Setup Font Sliders
  setupFontSliders();
  
  // Setup Pattern Generator
  setupPatternGenerator();
  
  // Setup Hero Banner Pattern
  setupHeroBanner();
  
  // Event Listeners for Generator
  const assetSelect = document.getElementById('asset-select');
  assetSelect.addEventListener('change', updateAssetPreview);
  
  const assetBtns = document.querySelectorAll('.asset-toggle-btn');
  assetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      assetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      assetSelect.value = btn.dataset.asset;
      assetSelect.dispatchEvent(new Event('change'));
    });
  });

  document.getElementById('download-btn').addEventListener('click', downloadSVG);
  
  // Init default state
  updateAssetPreview();
}

// ---------- 1. HERO BANNER ---------- //
async function setupHeroBanner() {
  const hero = document.getElementById('hero-banner');
  try {
    const rawSvg = await fetchRawSVG('pattern.svg');
    const coloredSvg = modifySvgFills(rawSvg, 'pattern', '#FFBDEC', '#FFCAF0');
    const bgUrl = generateSvgDataUrl(coloredSvg);
    hero.style.backgroundImage = `url("${bgUrl}")`;
    hero.style.backgroundSize = "20%"; // scale to look nice
  } catch(e) {
    console.warn("Failed to load hero pattern background.", e);
  }
}

// ---------- 2. FONT SLIDERS ---------- //
function setupFontSliders() {
  const fSlider = document.getElementById('fraunces-slider');
  const fLabel = document.getElementById('fraunces-label');
  const fPreview = document.getElementById('fraunces-preview');
  
  const fStates = [
    { weight: 400, label: "H3 / Subheading (Regular)" },
    { weight: 600, label: "H2 / Heading (Semi-Bold)" },
    { weight: 700, label: "H1 / Emphasis (Bold)" }
  ];
  
  fSlider.addEventListener('input', (e) => {
    const state = fStates[e.target.value - 1];
    fLabel.innerText = state.label;
    fPreview.style.fontWeight = state.weight;
  });

  const bSlider = document.getElementById('bricolage-slider');
  const bLabel = document.getElementById('bricolage-label');
  const bPreview = document.getElementById('bricolage-preview');
  
  const bStates = [
    { weight: 400, label: "Body Text (Regular)" },
    { weight: 500, label: "Medium Elements (Medium)" },
    { weight: 600, label: "Emphasis Copy (Semi-Bold)" }
  ];
  
  bSlider.addEventListener('input', (e) => {
    const state = bStates[e.target.value - 1];
    bLabel.innerText = state.label;
    bPreview.style.fontWeight = state.weight;
  });
}

// ---------- 3. STATIC COLOR GRIDS ---------- //
function renderStaticPalettes() {
  const container = document.getElementById('static-palettes-container');
  if(!container) return;
  container.innerHTML = '';
  
  const mainGrid = document.createElement('div');
  mainGrid.className = 'sub-brand-grid';
  mainGrid.style.flexWrap = 'wrap';
  
  COLOR_CATEGORIES.forEach((category, index) => {
    
    if(index === 0) {
      // Render Core separately in a vertical layout column before the product grids
      const groupDiv = document.createElement('div');
      groupDiv.className = 'sub-brand';
      groupDiv.style.marginBottom = '60px'; // spacing before product groups
      groupDiv.innerHTML = `<h3 style="margin-bottom:20px; border-bottom: 2px solid #5B0333; display:inline-block; padding-bottom:5px;">${category.name}</h3><div class="color-grid vertical"></div>`;
      const gridEl = groupDiv.querySelector('.color-grid');
      
      category.colors.forEach(color => {
        let usageHtml = color.usage ? `<div style="font-size: 0.85rem; color: #666; font-family: var(--font-secondary); line-height: 1.4; margin-top: 4px;">* ${color.usage}</div>` : '';

        const card = document.createElement('div');
        card.className = 'color-card';
        card.innerHTML = `
          <div class="color-swatch" style="background-color: ${color.hex}"></div>
          <div class="color-info" style="flex:1; flex-direction:column; align-items:flex-start; justify-content:center;">
             <div style="display:flex; width:100%; justify-content:space-between; align-items:center;">
               <span class="color-name" style="font-size:1rem; color: #5B0333;">${color.name}</span>
               <span class="color-hex" style="font-size:0.9rem;">${color.hex}</span>
             </div>
             ${usageHtml}
          </div>
        `;
        card.addEventListener('click', () => {
          navigator.clipboard.writeText(color.hex);
          const nameEl = card.querySelector('.color-name');
          const originalText = nameEl.innerText;
          nameEl.innerText = 'Copied!';
          setTimeout(() => nameEl.innerText = originalText, 1500);
        });
        gridEl.appendChild(card);
      });
      container.appendChild(groupDiv);
      
      const prodHeader = document.createElement('h3');
      prodHeader.innerText = "Product Variable Palettes";
      prodHeader.style.marginTop = "40px";
      prodHeader.style.marginBottom = "20px";
      prodHeader.style.color = "#444";
      container.appendChild(prodHeader);
      return; 
    }

    const groupDiv = document.createElement('div');
    groupDiv.className = 'sub-brand';
    groupDiv.innerHTML = `<h3>${category.name}</h3><div class="color-grid mini"></div>`;
    const gridEl = groupDiv.querySelector('.color-grid');
    
    category.colors.forEach(color => {
      const card = document.createElement('div');
      card.className = 'color-card';
      // ...existing innerHTML payload but stack vertically in mini grid
      card.style.flexDirection = "column"; 
      card.style.alignItems = "flex-start";
      card.innerHTML = `
        <div class="color-swatch" style="background-color: ${color.hex}"></div>
        <div class="color-info" style="padding:0; margin-top:5px;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <span class="color-name" style="font-size:0.8rem;">${color.name}</span>
            <span class="color-hex" style="font-size:0.75rem;">${color.hex}</span>
          </div>
        </div>
      `;
      card.addEventListener('click', () => {
        navigator.clipboard.writeText(color.hex);
        const nameEl = card.querySelector('.color-name');
        const originalText = nameEl.innerText;
        nameEl.innerText = 'Copied!';
        setTimeout(() => nameEl.innerText = originalText, 1500);
      });
      gridEl.appendChild(card);
    });
    
    mainGrid.appendChild(groupDiv);
  });
  
  container.appendChild(mainGrid);
}

// ---------- 4. INTERACTIVE SWATCH GENERATOR ---------- //
let currentFgHex = '#5B0333';
let currentBgHex = '#FFECFB';

function renderInteractiveSwatches() {
  const fgContainer = document.getElementById('fg-swatches');
  const bgContainer = document.getElementById('bg-swatches');
  
  // We only allow fg colors that exist as valid keys in our MAP
  const validFgHexes = Object.keys(ALLOWED_COMBINATIONS);
  
  COLOR_CATEGORIES.forEach(category => {
    // Generate Wrapper HTML
    const fgCatWrap = document.createElement('div');
    fgCatWrap.className = 'swatch-category';
    fgCatWrap.innerHTML = `<h4 class="swatch-category-title">${category.name}</h4><div class="swatch-category-grid"></div>`;
    const fgGrid = fgCatWrap.querySelector('.swatch-category-grid');
    let hasFg = false;
    
    const bgCatWrap = document.createElement('div');
    bgCatWrap.className = 'swatch-category';
    bgCatWrap.innerHTML = `<h4 class="swatch-category-title">${category.name}</h4><div class="swatch-category-grid"></div>`;
    const bgGrid = bgCatWrap.querySelector('.swatch-category-grid');
    let hasBg = false;

    category.colors.forEach(color => {
      // Render FG swatches
      if (validFgHexes.includes(color.hex.toUpperCase())) {
        const fgSwatch = createSwatch(color.hex, color.name);
        if(color.hex.toUpperCase() === currentFgHex.toUpperCase()) fgSwatch.classList.add('active');
        
        fgSwatch.addEventListener('click', () => {
          document.querySelectorAll('#fg-swatches .swatch').forEach(s => s.classList.remove('active'));
          fgSwatch.classList.add('active');
          currentFgHex = color.hex;
          refreshBackgroundSwatches(); 
        });
        fgGrid.appendChild(fgSwatch);
        hasFg = true;
      }
      
      // Render BG swatches
      const bgSwatch = createSwatch(color.hex, color.name);
      bgSwatch.dataset.bgHex = color.hex.toUpperCase();
      bgSwatch.addEventListener('click', () => {
        if(bgSwatch.classList.contains('disabled')) return; 
        document.querySelectorAll('#bg-swatches .swatch').forEach(s => s.classList.remove('active'));
        bgSwatch.classList.add('active');
        currentBgHex = color.hex;
        updateAssetPreview();
      });
      bgGrid.appendChild(bgSwatch);
      hasBg = true;
    });

    if(hasFg) fgContainer.appendChild(fgCatWrap);
    if(hasBg) bgContainer.appendChild(bgCatWrap);
  });
  
  // Trigger initial filter
  refreshBackgroundSwatches();
}

function createSwatch(hex, name) {
  const el = document.createElement('div');
  el.className = 'swatch';
  el.style.backgroundColor = hex;
  el.title = name; // tooltip
  el.dataset.hex = hex.toUpperCase();
  return el;
}

function refreshBackgroundSwatches() {
  const allowedBgs = ALLOWED_COMBINATIONS[currentFgHex.toUpperCase()] || [];
  let foundActive = false;
  
  document.querySelectorAll('#bg-swatches .swatch').forEach(swatch => {
    swatch.classList.remove('active', 'disabled');
    
    if (allowedBgs.includes(swatch.dataset.bgHex)) {
      // It's allowed
      if (swatch.dataset.bgHex === currentBgHex.toUpperCase()) {
        swatch.classList.add('active');
        foundActive = true;
      }
    } else {
      // It's disallowed
      swatch.classList.add('disabled');
    }
  });
  
  // If the previously selected BG is no longer allowed, auto-select the first allowed one
  if (!foundActive && allowedBgs.length > 0) {
    currentBgHex = allowedBgs[0];
    const newActive = document.querySelector(`#bg-swatches .swatch[data-bg-hex="${currentBgHex}"]`);
    if(newActive) newActive.classList.add('active');
  }
  
  // Now visually update the asset
  updateAssetPreview();
}

async function fetchRawSVG(filename) {
  const res = await fetch(`elements/${filename}`);
  if (!res.ok) throw new Error('Cannot fetch SVG');
  return await res.text();
}

function modifySvgFills(svgText, assetType, fg, bg) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = doc.documentElement;
  
  if (assetType === 'pattern') {
    // Pattern background rect
    const rects = svgElement.querySelectorAll('rect');
    if(rects.length > 0 && rects[0].getAttribute('width') == '669') { 
      rects[0].setAttribute('fill', bg);
    }
    // Pattern wavy lines
    const paths = svgElement.querySelectorAll('path');
    paths.forEach(p => p.setAttribute('fill', fg));
  } else {
    // Icon & Wordmark
    const elementsToColor = svgElement.querySelectorAll('path, rect, circle, polygon, g');
    elementsToColor.forEach(el => {
      if(el.hasAttribute('fill') && el.getAttribute('fill') !== 'none') {
         el.setAttribute('fill', fg);
      } else if (!el.hasAttribute('fill') && el.tagName.toLowerCase() === 'path') {
         el.setAttribute('fill', fg); 
      }
    });
  }
  
  // Force xmlns
  if (!svgElement.hasAttribute('xmlns')) {
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  
  return svgElement;
}

function generateSvgDataUrl(svgElement) {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  // Btoa conversion for unicode safe urls
  const b64 = btoa(unescape(encodeURIComponent(svgData)));
  return `data:image/svg+xml;base64,${b64}`;
}

async function updateAssetPreview() {
  const assetType = document.getElementById('asset-select').value;
  const btn = document.getElementById('download-btn');
  const previewBox = document.getElementById('preview-box');
  const container = document.querySelector('.generator-preview');
  
  btn.disabled = true;
  container.style.backgroundColor = currentBgHex;
  
  try {
    const filename = assetType === 'icon' ? 'womenli-icon.svg' : 'wordmark.svg';
    const rawSvg = await fetchRawSVG(filename);
    const coloredSvg = modifySvgFills(rawSvg, assetType, currentFgHex, currentBgHex);
    
    previewBox.innerHTML = '';
    previewBox.appendChild(coloredSvg);
    btn.disabled = false;
  } catch (err) {
    console.error(err);
    previewBox.innerHTML = '<p>Error loading asset.</p>';
  }
}

function downloadSVG() {
  const svgEl = document.querySelector('#preview-box svg');
  if(!svgEl) return;
  
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  const assetName = document.getElementById('asset-select').value;
  link.download = `womenli-${assetName}-${currentFgHex.replace('#','')}-on-${currentBgHex.replace('#','')}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------- 5. PARAMETRIC TWO-ICON PATTERN GENERATOR ---------- //
let pFgHex = '#CF379D'; 
let pBgHex = '#FFAEE7'; 

function setupPatternGenerator() {
  const pFgContainer = document.getElementById('p-fg-swatches');
  const pBgContainer = document.getElementById('p-bg-swatches');
  
  // Render Swatches
  COLOR_CATEGORIES.forEach(category => {
    const fgCatWrap = document.createElement('div');
    fgCatWrap.className = 'swatch-category';
    fgCatWrap.innerHTML = `<h4 class="swatch-category-title">${category.name}</h4><div class="swatch-category-grid"></div>`;
    const fgGrid = fgCatWrap.querySelector('.swatch-category-grid');
    
    const bgCatWrap = document.createElement('div');
    bgCatWrap.className = 'swatch-category';
    bgCatWrap.innerHTML = `<h4 class="swatch-category-title">${category.name}</h4><div class="swatch-category-grid"></div>`;
    const bgGrid = bgCatWrap.querySelector('.swatch-category-grid');

    category.colors.forEach(color => {
      // Foreground: Display ALL colors for pattern
      const fgSwatch = createSwatch(color.hex, color.name);
      if(color.hex.toUpperCase() === pFgHex.toUpperCase()) fgSwatch.classList.add('active');
      
      fgSwatch.addEventListener('click', () => {
        document.querySelectorAll('#p-fg-swatches .swatch').forEach(s => s.classList.remove('active'));
        fgSwatch.classList.add('active');
        pFgHex = color.hex;
        refreshPatternBgSwatches(); 
      });
      fgGrid.appendChild(fgSwatch);
      
      // Background: Display ALL colors for pattern
      const bgSwatch = createSwatch(color.hex, color.name);
      if(color.hex.toUpperCase() === pBgHex.toUpperCase()) bgSwatch.classList.add('active');
      
      bgSwatch.dataset.bgHex = color.hex.toUpperCase();
      bgSwatch.addEventListener('click', () => {
        document.querySelectorAll('#p-bg-swatches .swatch').forEach(s => s.classList.remove('active'));
        bgSwatch.classList.add('active');
        pBgHex = color.hex;
        updateParametricPattern();
      });
      bgGrid.appendChild(bgSwatch);
    });

    pFgContainer.appendChild(fgCatWrap);
    pBgContainer.appendChild(bgCatWrap);
  });
  
  refreshPatternBgSwatches(); // Initial filter

  // Sliders & Inputs
  const wInput = document.getElementById('pattern-width');
  const hInput = document.getElementById('pattern-height');
  
  const sizeInput = document.getElementById('p-size');
  const sxInput = document.getElementById('p-stretch-x');
  const syInput = document.getElementById('p-stretch-y');
  const gapInput = document.getElementById('p-gap');
  
  const sy1Input = document.getElementById('p-shift-y1');
  const sy2Input = document.getElementById('p-shift-y2');
  
  const sizeVal = document.getElementById('stretch-size-val');
  const sxVal = document.getElementById('stretch-x-val');
  const syVal = document.getElementById('stretch-y-val');
  const gapVal = document.getElementById('stretch-gap-val');
  const sy1Val = document.getElementById('shift-y1-val');
  const sy2Val = document.getElementById('shift-y2-val');

  const dlBtn = document.getElementById('download-pattern-btn');
  
  const countInputs = document.querySelectorAll('input[name="p-count"]');

  [wInput, hInput, sizeInput, sxInput, syInput, gapInput, sy1Input, sy2Input].forEach(inp => {
    inp.addEventListener('input', () => {
      sizeVal.innerText = sizeInput.value + '%';
      sxVal.innerText = sxInput.value + '%';
      syVal.innerText = syInput.value + '%';
      sy1Val.innerText = sy1Input.value;
      sy2Val.innerText = sy2Input.value;
      
      let gt = "Medium";
      if(gapInput.value < -20) gt = "Tight / Overlap";
      else if(gapInput.value > 50) gt = "Loose";
      gapVal.innerText = gt;
      
      updateParametricPattern();
    });
  });

  countInputs.forEach(radio => {
    radio.addEventListener('change', updateParametricPattern);
  });
  
  // Download Action
  dlBtn.addEventListener('click', () => {
    const preview = document.getElementById('pattern-preview');
    const svgEl = preview.querySelector('svg');
    if(!svgEl) return;
    
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `womenli-two-icon-pattern-${wInput.value}x${hInput.value}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  
  updateParametricPattern(); // init
}

function refreshPatternBgSwatches() {
  // Free selection: Pattern elements intentionally disregard auto-filtration 
  // letting user mix low and high contrasted patterns.
  updateParametricPattern();
}

async function updateParametricPattern() {
  const preview = document.getElementById('pattern-preview');
  
  const w = parseFloat(document.getElementById('pattern-width').value) || 1200;
  const h = parseFloat(document.getElementById('pattern-height').value) || 600;
  
  const overallSize = parseFloat(document.getElementById('p-size').value) / 100 || 0.5;
  const stretchX = parseFloat(document.getElementById('p-stretch-x').value) / 100 || 1;
  const stretchY = parseFloat(document.getElementById('p-stretch-y').value) / 100 || 1;
  const gap = parseFloat(document.getElementById('p-gap').value) || 10;
  const shiftY1 = parseFloat(document.getElementById('p-shift-y1').value) || 0;
  const shiftY2 = parseFloat(document.getElementById('p-shift-y2').value) || 0;
  const iconCount = document.querySelector('input[name="p-count"]:checked')?.value || "2";
  
  try {
    const rawIcon = await fetchRawSVG('womenli-icon.svg');
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawIcon, "image/svg+xml");
    const pathEl = doc.querySelector('path');
    if (!pathEl) throw new Error("No path found");
    const dString = pathEl.getAttribute('d');
    
    const baseWidth = 149;
    const baseHeight = 104;
    
    const scaleX = stretchX * overallSize * 3; // multiplier for better visual scaling in UI
    const scaleY = stretchY * overallSize * 3;
    
    const elementW = baseWidth * scaleX;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="hidden">`;
    svgContent += `<defs>
                      <clipPath id="mask-bounds">
                          <rect width="${w}" height="${h}" />
                      </clipPath>
                   </defs>`;
    svgContent += `<rect width="100%" height="100%" fill="${pBgHex}"/>`;
    
    // Group all patterns inside the clip mask so it never exceeds boundaries
    svgContent += `<g clip-path="url(#mask-bounds)">`;
    
    if (iconCount === "1") {
      // Just center exactly one icon
      const centerX = (w / 2) - (elementW / 2);
      const centerY = (h / 2) - (baseHeight * scaleY / 2) + shiftY1;
      svgContent += `<g transform="translate(${centerX}, ${centerY}) scale(${scaleX}, ${scaleY})">
                        <path d="${dString}" fill="${pFgHex}"/>
                     </g>`;
    } else {
      // 2 Flipped Icons Side-by-Side
      const startX = (w / 2) - elementW - (gap * 3);
      const centerY = (h / 2) - (baseHeight * scaleY / 2) + shiftY1;
      
      const rightX = (w / 2) + elementW + (gap * 3);
      const rightY = (h / 2) + (baseHeight * scaleY / 2) + shiftY2;     

      svgContent += `<g transform="translate(${startX}, ${centerY}) scale(${scaleX}, ${scaleY})">
                        <path d="${dString}" fill="${pFgHex}"/>
                     </g>`;
                     
      svgContent += `<g transform="translate(${rightX}, ${rightY}) scale(${-scaleX}, ${-scaleY})">
                        <path d="${dString}" fill="${pFgHex}"/>
                     </g>`;
    }

    svgContent += `</g></svg>`;
    
    preview.innerHTML = svgContent;
    preview.style.background = 'none'; 
    
  } catch (err) {
    console.warn("Could not load pattern preview.", err);
    preview.innerHTML = `<div class="validation error">Failed to calculate pattern.</div>`;
  }
}
