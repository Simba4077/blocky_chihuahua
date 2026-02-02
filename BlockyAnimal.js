// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }
`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

// global variables: user interface elements or data passed from JavaScript to GLSL shaders
let canvas;
let gl;
let a_Position
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  canvas = document.getElementById('webgl'); //do not use var, that makes a new local variable instead of using the current global one 

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl",{ preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
   console.log('Failed to get the storage location of u_ModelMatrix');
   return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}



//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global variables related to UI elements
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_headAngle = 0;
let g_walkingAnimation = false;

let g_rightFrontShoulderAngle = 0;
let g_rightBackShoulderAngle = 0;
let g_leftFrontShoulderAngle = 0;
let g_leftBackShoulderAngle = 0;
let g_tailAngle = 0;

let g_rightFrontKneeAngle = 0;
let g_rightBackKneeAngle = 0;
let g_leftFrontKneeAngle = 0;
let g_leftBackKneeAngle = 0;







function addActionsForHtmlUI(){
  //button events
  document.getElementById('animationWalkingOnButton').onclick = function(){g_walkingAnimation=true;};
  document.getElementById('animationWalkingOffButton').onclick = function(){g_walkingAnimation=false;};
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle=this.value; renderScene();});
  document.getElementById('headSlide').addEventListener('mousemove', function() { g_headAngle = this.value; renderScene();});

  document.getElementById('rightFrontShoulderSlide').addEventListener('mousemove', function() { g_rightFrontShoulderAngle = this.value; renderScene();});
  document.getElementById('rightBackShoulderSlide').addEventListener('mousemove', function() { g_rightBackShoulderAngle = this.value; renderScene();});
  document.getElementById('leftFrontShoulderSlide').addEventListener('mousemove', function() { g_leftFrontShoulderAngle = this.value; renderScene();});
  document.getElementById('leftBackShoulderSlide').addEventListener('mousemove', function() { g_leftBackShoulderAngle = this.value; renderScene();});

  document.getElementById('leftFrontKneeSlide').addEventListener('mousemove', function() { g_leftFrontKneeAngle = this.value; renderScene();});
  document.getElementById('leftBackKneeSlide').addEventListener('mousemove', function() { g_leftBackKneeAngle = this.value; renderScene();});
  document.getElementById('rightFrontKneeSlide').addEventListener('mousemove', function() { g_rightFrontKneeAngle = this.value; renderScene();});
  document.getElementById('rightBackKneeSlide').addEventListener('mousemove', function() { g_rightBackKneeAngle = this.value; renderScene();});

  document.getElementById('tailSlide').addEventListener('mousemove', function() { g_tailAngle = this.value; renderScene();});
}

function main() {
  // Retrieve <canvas> element
  setupWebGL();
  
  // Initialize shaders
  connectVariablesToGLSL();

  //set up actions for HTML UI elements
  addActionsForHtmlUI();
 
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1){ click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}


var g_shapesList = [];

function click(ev) {
  //extract event click and convert coordinates to webGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);

  //create and store the new point
  let point;
  if(g_selectedType == POINT){
    point = new Point();
  } else if (g_selectedType == CIRCLE){
    point = new Circle();
  } else{
    point = new Triangle();
  }
  point.position=[x, y];
  point.color=g_selectedColor.slice();
  g_shapesList.push(point);
  
  renderScene();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y]);
}

function updateAnimationAngles(){
  if (g_walkingAnimation) {
    const t = g_seconds * 8;

    g_headAngle = 10 * Math.sin(t * 0.5);

    g_leftFrontShoulderAngle  = 15 * Math.sin(t);
    g_rightBackShoulderAngle  = 15 * Math.sin(t);
    g_rightFrontShoulderAngle = -15 * Math.sin(t);
    g_leftBackShoulderAngle   = -15 * Math.sin(t);

    const kneeLag = Math.PI / 3;
    g_leftFrontKneeAngle  = 8 * Math.sin(t + kneeLag);
    g_rightBackKneeAngle  = 8 * Math.sin(t + kneeLag);
    g_rightFrontKneeAngle = 8 * Math.sin(t + kneeLag + Math.PI);
    g_leftBackKneeAngle   = 8 * Math.sin(t + kneeLag + Math.PI);

    g_tailAngle = 30 * Math.sin(t * 0.9);
  }

}


function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get" + htmlID + "from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
