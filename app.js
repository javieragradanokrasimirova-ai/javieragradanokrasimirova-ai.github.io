const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){toggle.setAttribute('aria-label','Abrir navegación');toggle.setAttribute('aria-expanded','false');navigation.classList.remove('open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar navegación':'Abrir navegación');navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('open')){closeMenu();toggle.focus();}});
const details={
  game:{type:'PROYECTO PERSONAL · WEB APP',title:'Magical Athlete',content:`<p>Una adaptación digital no oficial del juego de carreras Magical Athlete para jugar en pareja. El objetivo: poder completar la partida desde la propia web.</p><h3>La experiencia</h3><ul><li>Partidas en una pantalla y salas para jugar a distancia.</li><li>Tablero interactivo, selección de atletas y poderes contextuales.</li><li>Animaciones, repetición de jugadas y clasificación.</li><li>Interfaz adaptada a móvil y escritorio.</li></ul><h3>Cómo se ha trabajado</h3><p>Desarrollado con asistentes de IA bajo mi dirección: yo definí la idea y las decisiones de producto, y revisé y probé cada cambio. El proceso incluye definir la experiencia, revisar el funcionamiento e iterar sobre reglas e interfaz. Web estática en React y TypeScript publicada en GitHub Pages; las salas a distancia usan un Cloudflare Worker con base de datos D1 y el servidor valida cada jugada con el mismo motor de reglas.</p><p>Juego original de Takashi Ishida, actualizado por Richard Garfield. Ilustraciones y tablero pertenecen a sus autores; el proyecto es una adaptación no oficial.</p><a class="button dark-button" href="https://javieragradanokrasimirova-ai.github.io/magical-athlete/" target="_blank" rel="noopener noreferrer">Abrir la demo <svg><use href="#arrow"/></svg></a> <a class="text-link dark-link" href="https://github.com/javieragradanokrasimirova-ai/magical-athlete" target="_blank" rel="noopener noreferrer">Ver el código <svg><use href="#arrow"/></svg></a>`},
  gis:{type:'TYCGIS · PRÁCTICAS FORMATIVAS · 2026',title:'Una web para encontrar sedes',content:`<p>Proyecto final desarrollado durante las prácticas formativas en TYCGIS, entre abril y junio de 2026: una web para localizar y consultar las sedes de la empresa mediante un mapa interactivo.</p><h3>El trabajo</h3><ul><li>Representar ubicaciones mediante marcadores.</li><li>Mostrar información de cada sede en ventanas de consulta.</li><li>Trabajar con controles y eventos del mapa.</li><li>Practicar con capas ráster y vectoriales, WMS/WFS y geocodificación.</li></ul><h3>Las herramientas</h3><p>HTML, CSS y JavaScript, con formación práctica en Google Maps, Leaflet y OpenLayers.</p><p>La imagen del portfolio es una representación conceptual; no es una captura del trabajo original. No se incluye una demo pública de este proyecto.</p>`}
};
const dialog=document.querySelector('#project-dialog');let opener=null;
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const project=details[button.dataset.project];opener=button;document.querySelector('#dialog-title').textContent=project.title;document.querySelector('#dialog-type').textContent=project.type;document.querySelector('#dialog-content').innerHTML=project.content;dialog.showModal();}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
dialog.addEventListener('close',()=>opener?.focus());
let toastTimer;function notify(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3500);}
document.querySelector('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('javieragradanokrasimirova@gmail.com');notify('Correo copiado. ¡Hablemos!');}catch{notify('Puedes copiar el correo que aparece junto al botón.');}});
document.querySelector('#year').textContent=new Date().getFullYear();

// The illustration stays readable without JavaScript or when motion is disabled.
const scene=document.querySelector('.hero-art');
const motionButton=scene.querySelector('.motion-toggle');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
let userPaused=false,sceneVisible=true,pointerFrame=0,sceneBounds=null;
const entranceAnimations=[];
function resetPerspective(){
  cancelAnimationFrame(pointerFrame);pointerFrame=0;
  scene.style.removeProperty('--tilt-x');scene.style.removeProperty('--tilt-y');
  scene.style.removeProperty('--light-x');scene.style.removeProperty('--light-y');
  scene.classList.remove('is-pointing');
}
function motionAllowed(){return !userPaused&&!reducedMotion.matches;}
function syncMotion(){
  const enabled=motionAllowed();
  scene.classList.toggle('motion-enabled',enabled);
  scene.classList.toggle('motion-suspended',!sceneVisible||document.hidden);
  motionButton.disabled=reducedMotion.matches;
  motionButton.setAttribute('aria-pressed',String(enabled));
  motionButton.replaceChildren();
  const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');
  icon.textContent=enabled?'Ⅱ':'▷';motionButton.append(icon,document.createTextNode(reducedMotion.matches?'Movimiento reducido':enabled?'Pausar animación':'Activar animación'));
  if(!enabled){resetPerspective();entranceAnimations.forEach(animation=>animation.cancel());}
  else entranceAnimations.forEach(animation=>{if((!sceneVisible||document.hidden)&&animation.playState==='running')animation.pause();else if(sceneVisible&&!document.hidden&&animation.playState==='paused')animation.play();});
}
motionButton.hidden=false;
motionButton.addEventListener('click',()=>{userPaused=!userPaused;syncMotion();});
reducedMotion.addEventListener('change',syncMotion);
finePointer.addEventListener('change',resetPerspective);
document.addEventListener('visibilitychange',syncMotion);
new IntersectionObserver(entries=>{sceneVisible=entries[0].isIntersecting;syncMotion();if(!sceneVisible)resetPerspective();},{threshold:0}).observe(scene);
scene.addEventListener('pointerenter',()=>{sceneBounds=scene.getBoundingClientRect();});
scene.addEventListener('pointermove',event=>{
  if(!motionAllowed()||!finePointer.matches||!sceneVisible||document.hidden)return;
  const bounds=sceneBounds||scene.getBoundingClientRect();
  const x=Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width));
  const y=Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height));
  cancelAnimationFrame(pointerFrame);
  pointerFrame=requestAnimationFrame(()=>{
    scene.style.setProperty('--tilt-x',`${(0.5-y)*10}deg`);
    scene.style.setProperty('--tilt-y',`${(x-0.5)*14}deg`);
    scene.style.setProperty('--light-x',`${x*100}%`);
    scene.style.setProperty('--light-y',`${y*100}%`);
    scene.classList.add('is-pointing');pointerFrame=0;
  });
});
scene.addEventListener('pointerleave',()=>{sceneBounds=null;resetPerspective();});
window.addEventListener('resize',()=>{sceneBounds=null;resetPerspective();});
if(!reducedMotion.matches){
  scene.querySelectorAll('.code-line,.code-comment').forEach((line,index)=>{
    entranceAnimations.push(line.animate([{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,delay:180+index*170,easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'}));
  });
}
syncMotion();

const gallery = document.querySelector('.projects');
const galleryGlow = document.createElement('div');
galleryGlow.className = 'gallery-glow';
gallery.parentElement.prepend(galleryGlow);
gallery.addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType === 'touch') return;
  const bounds = galleryGlow.getBoundingClientRect();
  galleryGlow.style.setProperty('--glow-x', (event.clientX - bounds.left) + 'px');
  galleryGlow.style.setProperty('--glow-y', (event.clientY - bounds.top) + 'px');
}, {passive: true});

const logui = gallery.querySelector('.pawket-cover');
const bark = new Audio('assets/logui-ladrido.ogg');
bark.preload = 'none';
bark.volume = .55;
let barkTimer;
logui.addEventListener('click', () => {
  clearTimeout(barkTimer);
  logui.classList.remove('is-barking');
  requestAnimationFrame(() => logui.classList.add('is-barking'));
  bark.currentTime = 0;
  bark.play().catch(() => {});
  barkTimer = setTimeout(() => logui.classList.remove('is-barking'), 820);
});

const tomato = gallery.querySelector('.tomato-cover');
const frontWave = tomato.querySelector('.tomato-wave-front');
const backWave = tomato.querySelector('.tomato-wave-back');
let level = 0;
let pinned = false;
let hovering = false;
let waveFrame;

// Match Pomodoro Infusion's two sine waves, compressed into a short preview.
function drawTomato(level, phase) {
  const amplitude = 6 * Math.min(1, level * 8, (1 - level) * 8);
  const baseline = 372 - level * 272;
  let front = '';
  let back = '';
  for (let x = 50; x <= 392; x += 6) {
    const command = x === 50 ? 'M' : 'L';
    front += command + x + ',' + (baseline + amplitude * Math.sin(x * .032 + phase)).toFixed(1);
    back += command + x + ',' + (baseline - amplitude * 2 + amplitude * .8 * Math.sin(x * .026 - phase * .8 + 1.7)).toFixed(1);
  }
  const bottom = 'L392,400L50,400Z';
  frontWave.setAttribute('d', front + bottom);
  backWave.setAttribute('d', back + bottom);
}

function updateTomato() {
  cancelAnimationFrame(waveFrame);
  const target = Number(pinned || hovering);
  tomato.classList.toggle('is-ripening', target === 1);
  if (reducedMotion.matches || level === target) {
    level = target;
    drawTomato(level, 0);
    return;
  }

  const origin = level;
  const start = performance.now();
  const duration = (target ? 2650 : 850) * Math.abs(target - origin);
  function animate(now) {
    const progress = Math.max(0, Math.min(1, (now - start) / duration));
    const eased = progress * progress * (3 - 2 * progress);
    level = origin + (target - origin) * eased;
    drawTomato(level, (now - start) / 145);
    if (progress < 1) waveFrame = requestAnimationFrame(animate);
  }
  waveFrame = requestAnimationFrame(animate);
}

tomato.addEventListener('pointerenter', event => {
  if (event.pointerType === 'touch') return;
  hovering = true;
  updateTomato();
});
tomato.addEventListener('pointerleave', () => {
  hovering = false;
  updateTomato();
});
tomato.addEventListener('click', () => {
  pinned = !pinned;
  tomato.setAttribute('aria-pressed', String(pinned));
  updateTomato();
});
reducedMotion.addEventListener('change', updateTomato);
