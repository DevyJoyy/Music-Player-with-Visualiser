// Code by Joyy

const file = document.getElementById('fileBtn');
const audiotrack = document.getElementById('audiotrack');
const imgCard = document.getElementById('wallpaperContainer');
const canvas = document.getElementById('canvas1');
const lockBtn = document.getElementById('lock-screen');
const musicControls = document.getElementById('music_control');

// Visualizer Variables
const ctx = canvas.getContext('2d');
canvas.width = 240;
canvas.height = 160;
let audioSource;
let analyzer;

// Lock button code
lockBtn.addEventListener('click', () => {
  file.classList.toggle('uiLocked');
  file.classList.toggle('hide');
  musicControls.classList.toggle('uiLocked');
  audiotrack.classList.toggle('uiLocked');
});

// Input type file code
file.addEventListener('change', function(){
  const files = this.files;
  const audiotrack = document.getElementById('audiotrack');
  audiotrack.src = URL.createObjectURL(files[0]);
  audiotrack.load();
});

audiotrack.addEventListener('playing', function(){
  imgCard.classList.add("playing");
  vizualizer();
});

audiotrack.addEventListener('pause', () => {
  imgCard.classList.remove("playing");
});

audiotrack.addEventListener('ended', () => {
  imgCard.classList.remove("playing");
});

// Visualizer code 
function vizualizer() {
  const audioContext = new AudioContext();
  audioSource = audioContext.createMediaElementSource(audiotrack);
  analyzer = audioContext.createAnalyser();
  audioSource.connect(analyzer);
  analyzer.connect(audioContext.destination);
  analyzer.fftSize = 64;
  const bufferLen = analyzer.frequencyBinCount;
  const dataArr = new Uint8Array(bufferLen);
  
  const barWidth = canvas.width/bufferLen;
  let barHeight;
  let x;
  
  function animate(){
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyzer.getByteFrequencyData(dataArr);
    console.log(dataArr[0], dataArr[1], dataArr[2]);
    drawVisualizer(bufferLen, x, barWidth, barHeight, dataArr);
    requestAnimationFrame(animate);
  }
  animate();
}

function drawVisualizer(bufferLen, x, barWidth, barHeight, dataArr){
  const midX = canvas.width/2;
  const midY = canvas.height/2;
  const gap = 2;
  const drawWidth = barWidth - gap;
  
  ctx.fillStyle = 'white';
  
  for(let i = 0; i < bufferLen; i++){
    const h = dataArr[i]*0.1;
    
    const xRight = midX + i * barWidth + (gap/2);
    const xLeft = midX - (i+1) * barWidth + (gap/2);
    
    ctx.fillRect(xRight, midY, drawWidth, h);
    ctx.fillRect(xRight, midY, drawWidth, -h);
    
    ctx.fillRect(xLeft, midY, drawWidth, h);
    ctx.fillRect(xLeft, midY, drawWidth, -h);
  }
}


// Code by Joyy
