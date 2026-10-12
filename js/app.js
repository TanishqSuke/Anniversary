import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { initGallery } from './gallery.js'; import { initTimeline } from './timeline.js'; import { initGame } from './game.js'; import { initChatbot } from './chatbot.js'; import { initPlayer } from './player.js';
const SUPABASE_URL = 'https://idadpfawjwkkgrmmdbxn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BKK1jRgry9oymoBfaNvUBQ_XDZSCh1S';
const supabase = SUPABASE_ANON_KEY.startsWith('sb_publishable_') ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const fallback={herName:'Pranali',yourName:'Tanishq',relationshipStartDate:'2024-10-13',anniversaryDate:'2026-10-13',projectName:'ANNIVERSARY.exe',version:'2.0'};
let config={...fallback}; let data={photos:[],videos:[],audio:null,timeline:[],secrets:[],letter:null,chatbot:[]};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
function applyConfig(){ $$('[data-her-name]').forEach(e=>e.textContent=config.herName); $$('[data-your-name]').forEach(e=>e.textContent=config.yourName); }
function calcDuration(){const start=new Date(config.relationshipStartDate+'T00:00:00'), now=new Date(); let y=now.getFullYear()-start.getFullYear(),m=now.getMonth()-start.getMonth(),d=now.getDate()-start.getDate(); if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth(),0).getDate()} if(m<0){y--;m+=12} $('#years').textContent=y;$('#months').textContent=m;$('#days').textContent=d;$('#hours').textContent=now.getHours()-start.getHours()<0?23:now.getHours()-start.getHours(); $('#minutes').textContent=String(now.getMinutes()).padStart(2,'0');$('#seconds').textContent=String(now.getSeconds()).padStart(2,'0'); $('#daysTogether').textContent=Math.floor((now-start)/86400000).toLocaleString();}
function countdown() {
  const now = new Date();
  const anniversary = new Date(config.anniversaryDate + 'T00:00:00');

  let target = new Date(
    now.getFullYear(),
    anniversary.getMonth(),
    anniversary.getDate()
  );

  if (target <= now) {
    target.setFullYear(target.getFullYear() + 1);
  }

  const totalSeconds = Math.max(0, Math.floor((target - now) / 1000));
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  $('#countdownBox').innerHTML =
    `<div><b>${String(d).padStart(2, '0')}</b><small>DAYS</small></div>` +
    `<div><b>${String(h).padStart(2, '0')}</b><small>HOURS</small></div>` +
    `<div><b>${String(m).padStart(2, '0')}</b><small>MINUTES</small></div>` +
    `<div><b>${String(s).padStart(2, '0')}</b><small>SECONDS</small></div>`;
}
async function load(){ if(supabase){const {data:settings}=await supabase.from('settings').select('key,value'); if(settings) settings.forEach(x=>{try{config[x.key]=JSON.parse(x.value)}catch{config[x.key]=x.value}}); const tables=['photos','videos','timeline','secrets','chatbot_responses']; for(const t of tables){const r=await supabase.from(t).select('*').order('created_at',{ascending:true}); if(!r.error)data[t==='chatbot_responses'?'chatbot':t]=r.data||[]} const l=await supabase.from('love_letter').select('*').limit(1).maybeSingle(); if(l.data)data.letter=l.data; const a=await supabase.from('audio').select('*').limit(1).maybeSingle(); if(a.data)data.audio=a.data;} applyConfig(); $('#memoryCount').textContent=data.photos.length; calcDuration();countdown(); }
function boot(){const lines=['INITIALIZING ANNIVERSARY.exe...','Loading memories............. OK','Loading photos.............. OK','Loading videos.............. OK','Loading relationship data... OK','Loading love module......... OK','SYSTEM STATUS: READY ❤️','PRIVATE PROJECT DETECTED'];let i=0;const log=$('#bootLog'),bar=$('#progressBar');const t=setInterval(()=>{if(i<lines.length){log.textContent+=lines[i]+'\n';bar.style.width=Math.round((i+1)/lines.length*100)+'%';i++;}else{clearInterval(t);$('#bootStatus').textContent=`USER: ${config.herName}\nACCESS LEVEL: SPECIAL ❤️\n\nWELCOME.`;$('#startBtn').classList.remove('hidden')}},260)}
function start(){ $('#boot').classList.add('fade');setTimeout(()=>{$('#boot').remove();$('#app').classList.remove('hidden');initGallery(data.photos);renderVideos();renderSecrets();initTimeline(data.timeline);initGame();initChatbot(data.chatbot,config);initPlayer({
  ...(data.audio || {}),
  url: './assets/audio/Tum%20Se%20Hi%20Jab%20We%20Met%20320%20Kbps.mp3',
  title: 'Tum Se Hi ❤️',
  artist: 'Mohit Chauhan'
});},700)}
function renderVideos(){const root=$('#videoGrid');root.innerHTML=(data.videos.length?data.videos:[]).map((v,i)=>`<article class="video-card">${v.thumbnail_url?`<img loading="lazy" src="${v.thumbnail_url}" alt="${v.title}">`:''}<video controls preload="none" playsinline src="${v.url}"></video><div><small>${String(i+1).padStart(2,'0')} — ${v.date||''}</small><h3>${v.title}</h3><p>${v.description||''}</p></div></article>`).join('')||'<div class="glass lock-card"><h3>VIDEO ARCHIVE READY</h3><p>Add videos from Admin Mode.</p></div>';} function renderSecrets(){const root=$('#secretsGrid');root.innerHTML=(data.secrets.length?data.secrets:[]).sort((a,b)=>a.unlock_order-b.unlock_order).map((x,i)=>`<article class="secret glass"><small>SECRET ${String(i+1).padStart(2,'0')}</small><h3>🔐 ${x.title}</h3><p>${x.message||'Locked memory.'}</p></article>`).join('')||'<article class="secret glass"><small>SECRET 01</small><h3>🔐 Awaiting your memories</h3><p>Secrets become available as you add them in Admin Mode.</p></article>';} function bind(){document.addEventListener('click',e=>{const b=e.target.closest('[data-scroll]');if(b) document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'});});$('#startBtn').onclick=start;$('#unlockLetter').onclick=()=>{ $('#letterLock').classList.add('hidden');$('#letterBody').classList.remove('hidden'); const txt=data.letter?.body||`Dear ${config.herName},\n\nI could have bought you something...\n\nBut I wanted to create something that exists only for you.\n\nSo I built this.\n\nEvery photo. Every memory. Every stupid fight. Every laugh.\n\nEverything here is a small part of our story.\n\nHappy Anniversary ❤️`; typeText($('#letterText'),txt)};$('#replay').onclick=()=>location.reload();let taps=0;$('.logo').addEventListener('click',()=>{if(++taps>=7){taps=0;alert(`Developer Mode Activated...\n\nDeveloper: ${config.yourName}\nProject: Our Story\nVersion: ${config.version}\nStatus: Forever Under Development ❤️\n\nKnown Bugs:\nMissing You\nThinking About You\nFalling For You Again\n\nNo bugs will be fixed because I kinda like these ones. 😂❤️`)}});let typed='';document.addEventListener('keydown',e=>{if(e.key.length===1){typed=(typed+e.key.toUpperCase()).slice(-9);if(typed==='ILOVEYOU'){alert('DEVELOPER MODE ACTIVATED ❤️');typed=''}}})}
function typeText(el,text){el.textContent='';let i=0;const t=setInterval(()=>{el.textContent+=text[i++]||'';if(i>text.length)clearInterval(t)},18)}
async function main(){await load();boot();bind();setInterval(()=>{calcDuration();countdown()},1000)} main();