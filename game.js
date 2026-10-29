// Space X Aviator - DEMO logic - b10fhonix.online
let balance = 1000;
let bet = 0;
let multiplier = 1.0;
let crashed = false;
let flying = false;
let crashPoint = 0;
let startTime = 0;
let raf = null;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function genCrashPoint(){
  // Provably fair demo: 97% RTP style
  const r = Math.random();
  const point = 0.99 / (1 - r * 0.97);
  return Math.max(1.05, Math.min(point, 100));
}

function placeBet(){
  if(flying) return;
  bet = 100;
  if(balance < bet){ document.getElementById('status').innerText = "No points"; return; }
  balance -= bet;
  crashPoint = genCrashPoint();
  console.log("DEMO Hash - Crash at:", crashPoint.toFixed(2) + "x");
  flying = true; crashed = false; multiplier = 1.0; startTime = Date.now();
  document.getElementById('status').innerText = "Flying... crash at ? - Cash out before!";
  updateBalance();
  loop();
}

function cashOut(){
  if(!flying || crashed) return;
  const win = Math.floor(bet * multiplier);
  balance += win;
  document.getElementById('status').innerText = `Cashed at ${multiplier.toFixed(2)}x - Won ${win} pts`;
  flying = false;
  cancelAnimationFrame(raf);
  updateBalance();
}

function loop(){
  if(!flying) return;
  const elapsed = (Date.now() - startTime)/1000;
  multiplier = Math.pow(Math.E, 0.06 * elapsed * 10 / 10); // slow growth like Aviator
  
  if(multiplier >= crashPoint){
    crashed = true; flying = false;
    document.getElementById('status').innerText = `CRASHED at ${crashPoint.toFixed(2)}x - Lost bet`;
    draw(multiplier, true);
    return;
  }
  draw(multiplier, false);
  document.getElementById('multiplier').innerText = multiplier.toFixed(2) + "x";
  raf = requestAnimationFrame(loop);
}

function draw(m, isCrash){
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // rocket path
  const x = (m/10) * canvas.width * 0.8;
  const y = canvas.height - (Math.log(m) * 80) - 40;
  ctx.fillStyle = isCrash ? "#ff0040" : "#00f0ff";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI*2);
  ctx.fill();
  ctx.fillText("▲ SPACE X", x+15, y);
  // trail
  ctx.strokeStyle = "#00f0ff44";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height-20);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function updateBalance(){ document.getElementById('balance').innerText = balance; }
