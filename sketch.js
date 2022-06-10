// SPEECH TO TEXT

const NUMBER_OF_FONTS = 5;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector(".variable");

// COLOURS

let paletteA = [
  "#002626",
  "#0e4749",
  "#95c623",
  "#e55812",
  "#efe7da",
  "#93b7be",
  "#f1fffa",
  "#785964",
  "#fcfcfc",
  "#f1fffa",
];
let paletteB = [
  "#001219",
  "#005f73",
  "#0a9396",
  "#94d2bd",
  "#e9d8a6",
  "#ee9b00",
  "#ca6702",
  "#bb3e03",
  "#ae2012",
  "#9b2226",
];
let paletteC = [
  "#ffe8d6",
  "#829e95",
  "#f1f1f1",
  "#ff7f11",
  "#ffffff",
  "#829e95",
  "#022b3a",
  "#ffe8d6",
  "#fAf5f0",
  "#1c1c1c",
];
let paletteD = [
  "#ffcdb2",
  "#ffb4a2",
  "#e5989b",
  "#b5838d",
  "#6d6875",
  "#ffcdb2",
  "#ffb4a2",
  "#e5989b",
  "#b5838d",
  "#6d6875",
];
let paletteE = [
  "#fbf8cc",
  "#fde4cf",
  "#ffcfd2",
  "#f1c0e8",
  "#cfbaf0",
  "#a3c4f3",
  "#90dbf4",
  "#8eecf5",
  "#98f5e1",
  "#b9fbc0",
];
let paletteF = [
  "#f8f9fa",
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#6c757d",
  "#495057",
  "#343a40",
  "#212529",
  "#FEEBF4",
];
let paletteG = ["#272727", "#fffffc", "#ffb800", "#DB5A42"];
let paletteH = [
  "#272727",
  "#fffffc",
  "#a18276",
  "#09e85e",
  "#9ba2ff",
  "#8a84e2",
  "#cfd11a",
];
let paletteI = ["#d8f3dc", "#95d5b2", "#52b788", "#1b4332", "#081c15"];

let instructions = {
  "#d8f3dc": "#52b788",
  "#95d5b2": "#1b4332",
  "#52b788": "#081c15",
  "#1b4332": "#d8f3dc",
  "#081c15": "#95d5b2",
};

let palette = paletteI; // CHANGE PALETTE LETTER A - F TO VARY PALETTES
let sensitivity = 1; // RANGE 0 - 1

let index = Math.random();
index *= palette.length;
index = Math.floor(index);

var textColor = document.getElementById("words");
words.style.color = palette[index];
document.body.style.backgroundColor = palette[index - 1];

// Instructions colours
document.getElementById("instructions").style.color =
  instructions[palette[index]];
document.getElementById("log").style.color = instructions[palette[index]];
document.getElementById("words").style.color = instructions[palette[index]];

// Used for JS screen capture.
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const video = document.createElement("video");

// MIC INPUT

let mic, fft;
let voiceWeight;

let overlay;
let type;
var button;

function preload() {
  type = loadFont("assets/HandjetVF-All.ttf");
}

// SETUP ---------------------------------------------------------------------------------

function setup() {
  createCanvas(windowWidth, 200);

  mic = new p5.AudioIn();
  fft = new p5.FFT(0.9, 512);
  mic.start();
  fft.setInput(mic);

  // button = createButton('Save');
  // button.position(width - 120, 15);
  // button.style('background-color: whitesmoke;' + 'border: none;' + 'color: #081c15;' + 'padding: 15px 32px;' + 'font-family: handjet;' + 'font-size: 14pt;' + 'transition-duration: 0.4s');
  // button.mousePressed(saveType);

  variable = select(".variable");
  //initialiseScreenCapture();
}

// SPEECH INPUT

document.body.onkeydown = function () {
  userStartAudio();
  startRecognition();
};

let recognitionBusy = false;

function startRecognition() {
  if (recognitionBusy) return;

  recognition.start();
  mic.start();
  console.log("Ready to receive a color command.");
  document.getElementById("log").innerHTML = "I'm listening.";

  recognitionBusy = true;
}

let font = 0;

// SPEECH RESULT

recognition.onresult = function (event) {
  var words = event.results[0][0].transcript;
  diagnostic.textContent = words;
  console.log("Confidence: " + event.results[0][0].confidence);
  document.getElementById("log").innerHTML = " ";

  // RANDOMISE FONTS

  document.body.className = random([
    "font-0",
    "font-1",
    "font-2",
    "font-3",
    "font-4",
  ]);

  // DISPLAY FONTS IN SEQUENCE

  //   document.body.className = `font-${font}`;
  //   font++;
  //   font = font % 5;

  //   recognitionBusy = false;
};

// DRAW ---------------------------------------------------------------------------------

function draw() {
  clear();

  // TEXT VARIABLE STYLING

  let spectrum = fft.analyze();

  let lowMid = fft.getEnergy("lowMid");
  let mid = fft.getEnergy("mid");
  let highMid = fft.getEnergy("highMid");
  let treble = fft.getEnergy("treble");

  voiceWeight = map(lowMid, 0, 200, 0, 1000);
  voiceInvWeight = map(treble, 0, 20, 1000, 0);
  voiceWidth = map(highMid, 0, 50, 100, 35);
  voiceOpticalSize = map(treble, 0, 20, 50, 10);
  voiceContrast = map(treble, 0, 20, 0, 1000);
  voiceHrot = map(lowMid, 0, 200, -45, 45);
  voiceVrot = map(highMid, 0, 50, -45, 45);
  voiceShape = map(highMid, 0, 50, 1, 16);
  voiceGrid = map(mid, 0, 50, 1.0, 2.0);
  voiceStripe = map(treble, 0, 20, 0, 1000);
  voiceWorm = map(highMid, 0, 50, 0, 1000);

  variable.style(
    "font-variation-settings",

    " 'wght' " +
      voiceWeight * sensitivity + // AMSTELVAR, KYIV, HANDJET
      ", 'wdth' " +
      voiceWidth * sensitivity + // AMSTELVAR
      ", 'opsz' " +
      voiceOpticalSize * sensitivity + // AMSTELVAR
      ", 'CONT' " +
      voiceContrast * sensitivity + // KYIV
      ", 'HROT' " +
      voiceHrot * sensitivity + // TILTWARP
      ", 'VROT' " +
      voiceVrot * sensitivity + // TILTWARP
      ", 'ESHP' " +
      voiceShape * sensitivity + // HANDJET
      ", 'EGRD' " +
      voiceGrid * sensitivity + // HANDJET
      ", 'WMX2' " +
      voiceWeight * sensitivity + // DECOVAR
      ", 'SKLD' " +
      voiceStripe * sensitivity + // DECOVAR
      ", 'SKLB' " +
      voiceWorm * sensitivity // DECOVAR
  );

  variable.style("font-size", 100 + voiceWeight * 0.05 + "px");

  let rLowMid = map(mid, 0, 200, 0, 20);
  let rMid = map(mid, 0, 50, 0, 20);
  let rHighMid = map(highMid, 0, 50, 0, 20);
  let rTreble = map(treble, 0, 20, 0, 20);

  fill(255, 100);
  strokeWeight(2);
  stroke(255);
  let ypos = 200;
  beginShape();
  curveVertex(100, ypos);
  curveVertex(100, ypos);

  curveVertex(100, ypos);
  curveVertex(width / 6, ypos - rLowMid);
  curveVertex((width / 6) * 2, ypos);

  curveVertex(width - 100, ypos);
  curveVertex(width - 100, ypos);
  endShape();

  beginShape();
  curveVertex(100, ypos);
  curveVertex(100, ypos);

  curveVertex(width / 6, ypos);
  curveVertex((width / 6) * 2, ypos - rMid);
  curveVertex((width / 6) * 3, ypos);

  curveVertex(width - 100, ypos);
  curveVertex(width - 100, ypos);
  endShape();

  beginShape();
  curveVertex(100, ypos);
  curveVertex(100, ypos);

  curveVertex((width / 6) * 2, ypos);
  curveVertex((width / 6) * 3, ypos - rHighMid);
  curveVertex((width / 6) * 4, ypos);

  curveVertex(width - 100, ypos);
  curveVertex(width - 100, ypos);
  endShape();

  beginShape();
  curveVertex(100, ypos);
  curveVertex(100, ypos);

  curveVertex((width / 6) * 3, ypos);
  curveVertex((width / 6) * 4, ypos - rTreble);
  curveVertex((width / 6) * 5, ypos);

  curveVertex(width - 100, ypos);
  curveVertex(width - 100, ypos);
  endShape();
}

// STOP RECORDING & RANDOMISE COLOURS

recognition.onspeechend = function () {
  recognition.stop();
  document.getElementById("log").innerHTML = " ";
  document.getElementById("instructions").innerHTML =
    "Welcome to An Array of Constraint. Style type with your voice by pressing a key and start speaking.";

  let index = Math.random();
  index *= palette.length;
  index = Math.floor(index);

  var textColor = document.getElementById("words");
  words.style.color = instructions[palette[index]];
  document.body.style.backgroundColor = palette[index - 1];
  document.getElementById("instructions").style.color =
    instructions[palette[index]];
  document.getElementById("log").style.color = instructions[palette[index]];
  document.getElementById("words").style.color = instructions[palette[index]];
};

var debounceSave = new DebounceSave(1000, function () {
  saveType();
});

async function initialiseScreenCapture() {
  // TODO: I hard-coded this because I can't find the right versions of
  // window.height/innerHeight/outerHeight or whatever to get it to work.

  canvas.width = 1920;
  canvas.height = 1080;
  // canvas.width = window.width
  // canvas.height = window.height

  const captureStream = await navigator.mediaDevices.getDisplayMedia();
  video.srcObject = captureStream;
  video.play();
}

function saveType() {
  console.log("mousePressed");

  try {
    // context.drawImage(video, 0, 0, window.width, window.height)
    // TODO: I hard-coded this because I can't find the right versions of
    // window.height/innerHeight/outerHeight or whatever to get it to work.
    context.drawImage(video, 0, 0, 1920, 1080);
    const image = canvas.toDataURL();

    // Create a new link/a tag.
    const link = document.createElement("a");

    // Add the base64 string as the destination of the link,
    // plus some other properties for downloading.
    link.target = "_blank";
    link.download = "img.png";
    link.href = image;

    // Click it. Automagically.
    link.click();
  } catch (err) {
    console.error("Error: " + err);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 200);
}
