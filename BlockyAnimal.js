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
let g_headAnimation = false;



function addActionsForHtmlUI(){
  //button events
  document.getElementById('animationHeadOnButton').onclick = function(){g_headAnimation=true;};
  document.getElementById('animationHeadOffButton').onclick = function(){g_headAnimation=false;};
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle=this.value; renderAllShapes();});
  document.getElementById('headSlide').addEventListener('mousemove', function() { g_headAngle = this.value; renderAllShapes();});
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
  gl.clearColor(0.0, 0.2, 0.2, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
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

function updateAnimationAngles(){
  if(g_headAnimation){
    g_headAngle = 10*Math.sin(g_seconds);
  }
}


function renderAllShapes(){

  //check the time at the start of function 
  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //draw a body cube
  var body = new Cube();
  body.color = [0.8235, 0.7059, 0.5490, 1.0];
  body.matrix.translate(-0.3, -0.1, 0.0);
  var bodyFrame = new Matrix4(body.matrix);
  body.matrix.scale(0.6, 0.2, 0.3); 
  body.render();

  //draw a head cube | parent: body
  var head = new Cube();
  head.color = [0.8235, 0.7059, 0.5490, 1.0];
  head.matrix = new Matrix4(bodyFrame);
  head.matrix.translate(0.6, 0.1, 0.025);
  head.matrix.rotate(-g_headAngle, 0, 1, 0);
  head.matrix.scale(.22,0.25,0.25);
  head.render();

  //---------------------------------------

  //back right leg (red)| parent: body
  var backRightLeg1 = new Cube();
  backRightLeg1.color = [1,0, 0, 1.0];
  backRightLeg1.matrix = new Matrix4(bodyFrame);
  backRightLeg1.matrix.translate(0.05, -0.07, 0.0);
  var backRightKnee = new Matrix4(backRightLeg1.matrix);
  backRightLeg1.matrix.scale(.05, 0.07, 0.05);
  backRightLeg1.render();

  //brown piece (lower leg) | parent: back right leg 1
  var backRightLeg2 = new Cube();
  backRightLeg2.color = [0.8235, 0.7059, 0.5490, 1.0];
  backRightLeg2.matrix = new Matrix4(backRightKnee);
  backRightLeg2.matrix.translate(0, -0.07, 0.0);
  backRightLeg2.matrix.scale(.05, 0.07, 0.05);
  backRightLeg2.render();

  //---------------------------------------

  //back left leg (red)| parent: body
  var backLeftLeg1 = new Cube();
  backLeftLeg1.color = [1, 0.0, 0.0, 1.0];
  backLeftLeg1.matrix = new Matrix4(bodyFrame);
  backLeftLeg1.matrix.translate(0.05, -0.07, 0.25);
  var backLeftKnee = new Matrix4(backLeftLeg1.matrix);
  backLeftLeg1.matrix.scale(.05, 0.07, 0.05);
  backLeftLeg1.render();


  // brown piece (lower leg) | parent: back left leg 1
  var backLeftLeg2 = new Cube();
  backLeftLeg2.color = [0.8235, 0.7059, 0.5490, 1.0];
  backLeftLeg2.matrix = new Matrix4(backLeftKnee);
  backLeftLeg2.matrix.translate(0.0, -0.07, 0.0);
  backLeftLeg2.matrix.scale(.05, 0.07, 0.05);
  backLeftLeg2.render();

  //---------------------------------------

  //front left leg (red) | parent: body
  var frontLeftLeg1 = new Cube();
  frontLeftLeg1.color = [1, 0.0, 0.0, 1.0];
  frontLeftLeg1.matrix = new Matrix4(bodyFrame);
  frontLeftLeg1.matrix.translate(0.5, -0.07, 0.25);
  var frontLeftKnee = new Matrix4(frontLeftLeg1.matrix);
  frontLeftLeg1.matrix.scale(.05, 0.07, 0.05);
  frontLeftLeg1.render();

  // brown piece (lower leg) | parent: front left leg
  var frontLeftLeg2 = new Cube();
  frontLeftLeg2.color = [0.8235, 0.7059, 0.5490, 1.0];
  frontLeftLeg2.matrix = new Matrix4(frontLeftKnee);
  frontLeftLeg2.matrix.translate(0, -0.07, 0.0);
  frontLeftLeg2.matrix.scale(.05, 0.07, 0.05);
  frontLeftLeg2.render();

  //---------------------------------------


  //front right leg | parent: body
  var frontRightLeg = new Cube();
  frontRightLeg.color = [1, 0.0, 0.0, 1.0];
  frontRightLeg.matrix = new Matrix4(bodyFrame);
  frontRightLeg.matrix.translate(0.5, -0.07, 0);
  var frontRightKnee = new Matrix4(frontRightLeg.matrix);
  frontRightLeg.matrix.scale(.05, 0.07, 0.05);
  frontRightLeg.render();

  //brown piece (lower leg) | parent: front right leg
  var frontRightLeg2 = new Cube();
  frontRightLeg2.color = [0.8235, 0.7059, 0.5490, 1.0];
  frontRightLeg2.matrix = new Matrix4(frontRightKnee);
  frontRightLeg2.matrix.translate(0, -0.07, 0.0);
  frontRightLeg2.matrix.scale(.05, 0.07, 0.05);
  frontRightLeg2.render();
  
  //---------------------------------------


  //my reference cube with low alpha, og coordinates
  var ref = new Cube();
  ref.color = [1, 1.0, 1.0, 0.02];
  ref.render();



  // //draw a left arm
  // var yellow = new Cube();
  // yellow.color = [1.0, 1.0, 0.0, 1.0];
  // yellow.matrix.setTranslate(0, -0.5, 0.0);
  // yellow.matrix.rotate(-5, 1, 0, 1);
  // yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);

  // var yellowCoordinatesMat = new Matrix4(yellow.matrix);
  // yellow.matrix.scale(0.65, 0.7, 0.5);
  // yellow.matrix.translate(-0.5, 0.0, 0.0);
  // yellow.render();

  // var magenta = new Cube();
  // magenta.color = [1.0, 0.0, 1.0, 1.0];
  // magenta.matrix = yellowCoordinatesMat;
  // magenta.matrix.translate(0.0, 0.65, 0.0);
  // magenta.matrix.rotate(45,0,0,1);
  // magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
  // magenta.matrix.scale(0.3, 0.3, 0.3);
  // magenta.matrix.translate(-0.5, 0.0, -0.001);
  // magenta.render();


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
