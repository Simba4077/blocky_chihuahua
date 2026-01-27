// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main() {
    gl_Position = u_ModelMatrix * a_Position;
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

function setupWebGL() {
  canvas = document.getElementById('webgl'); //do not use var, that makes a new local variable instead of using the current global one 

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl",{ preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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
let g_selectedSegments = 2;
let g_alpha = 1.0;

function addActionsForHtmlUI(){

  //button events
  document.getElementById('green').onclick = function () { g_selectedColor = [0.0, 1.0, 0.0, g_alpha]; };
  document.getElementById('red').onclick = function () { g_selectedColor = [1.0, 0.0, 0.0, g_alpha]; };
  document.getElementById('clearButton').onclick = function () { g_shapesList = []; renderAllShapes(); };

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
  document.getElementById('draw').onclick = function() {drawPicture();};

  //color slider events
  document.getElementById('redSlide').addEventListener('mouseup',function() { g_selectedColor[0] = this.value/100; g_selectedColor[3] = g_alpha;});
  document.getElementById('greenSlide').addEventListener('mouseup',function() { g_selectedColor[1] = this.value/100; g_selectedColor[3] = g_alpha; });
  document.getElementById('blueSlide').addEventListener('mouseup',function() { g_selectedColor[2] = this.value/100; g_selectedColor[3] = g_alpha;});

  //size slider events
  document.getElementById('sizeSlide').addEventListener('mouseup',function() {g_selectedSize=this.value;});

  //segment slider events
  document.getElementById('segmentSlide').addEventListener('mouseup',function() {g_selectedSegments=this.value;});

  //alpha slider events
  document.getElementById('alphaSlide').addEventListener('mouseup',function() {g_alpha = this.value/100;});

  //replay button event
  document.getElementById('replayButton').onclick = function() {replayDrawing()};

  //undo button event
  document.getElementById('undoButton').onclick = function() {undoLastShape()};
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

  renderAllShapes();
}



var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of a point

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
  point.color[3] = g_alpha;
  point.size=g_selectedSize;
  point.segments=g_selectedSegments;
  g_shapesList.push(point);
  
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y]);
}



function renderAllShapes(){

  //check the time at the start of function 
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawTriangle3D([-1.0,0.0,0.0,  -0.5,-1.0,0.0,  0.0,0.0,0.0] ); 

  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix.translate(-0.25, -0.5, 0.0);
  body.matrix.scale(0.5, 1.0, 0.5); //scale happens first
  body.render();

  //draw a left arm
  var leftArm = new Cube();
  leftArm.color = [1.0, 1.0, 0.0, 1.0];
  leftArm.matrix.translate(0.7, 0.0, 0.0);
  leftArm.matrix.rotate(45, 0, 0, 1);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.render();


  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: "+Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot")

}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get" + htmlID + "from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
