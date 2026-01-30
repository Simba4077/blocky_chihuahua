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

//---------------------------------------
// draw the body (3 pieces: front, back, middle)

  //draw a front body cube (green) | parent: none (origin)
  var frontBody = new Cube();
  frontBody.color = [0.0, 1.0, 0.0, 1.0];
  frontBody.matrix.translate(-0.05, -0.1, 0.0);
  var frontBodyFrame = new Matrix4(frontBody.matrix);
  frontBody.matrix.scale(0.18, 0.18, 0.28); 
  frontBody.render();

  //front body cube front piece | parent: front body
  var frontBodyFront = new Cube();
  frontBodyFront.color = [1, 1, 0, 1.0];
  frontBodyFront.matrix = new Matrix4(frontBodyFrame);
  frontBodyFront.matrix.translate(0.19, 0.015, -0.1);
  var frontBodyFrontMat = new Matrix4(frontBodyFront.matrix);
  frontBodyFront.matrix.scale(0.02, 0.1, 0.1);
  frontBodyFront.render();


  //front body top cube | parent: front body
  var frontBodyTop = new Cube();
  frontBodyTop.color = [1,1,0,1.0];
  frontBodyTop.matrix = new Matrix4(frontBodyFrame);
  frontBodyTop.matrix.translate(0.001, 0.18, 0.065);
  frontBodyTop.matrix.scale(0.1, 0.008, 0.15);
  frontBodyTop.render();

  //front body cube underbelly | parent: front body
  var frontBodyUnderbelly = new Cube();
  frontBodyUnderbelly.color = [0.8235, 0.7059, 0.5490, 1.0];
  frontBodyUnderbelly.matrix = new Matrix4(frontBodyFrame);
  frontBodyUnderbelly.matrix.translate(0.0, -0.025, 0.05);
  frontBodyUnderbelly.matrix.scale(0.1, 0.025, 0.2);
  frontBodyUnderbelly.render();

  //front body cube right side piece | parent: front body
  var frontBodyRight = new Cube();
  frontBodyRight.color = [1, 1, 0, 1.0];
  frontBodyRight.matrix = new Matrix4(frontBodyFrame);
  frontBodyRight.matrix.translate(0.0, 0.015, -0.01);
  var frontBodyRightMat = new Matrix4(frontBodyRight.matrix);
  frontBodyRight.matrix.scale(0.15, 0.15, 0.01);
  frontBodyRight.render();

  //front body cube right side piece 2 | parent: front body right side
  var frontBodyRight2 = new Cube();
  frontBodyRight2.color = [1, 0, 1, 1.0];
  frontBodyRight2.matrix = new Matrix4(frontBodyRightMat);
  frontBodyRight2.matrix.translate(0.0, 0.015, -0.01);
  var frontBodyRight2Mat = new Matrix4(frontBodyRight2.matrix);
  frontBodyRight2.matrix.scale(0.10, 0.12, 0.01);
  frontBodyRight2.render();

  //front body cube right side piece 3 | parent: front body right side 2
  var frontBodyRight3 = new Cube();
  frontBodyRight3.color = [0, 0, 1, 1.0];
  frontBodyRight3.matrix = new Matrix4(frontBodyRight2Mat);
  frontBodyRight3.matrix.translate(0.0, 0.01, -0.015);
  var frontBodyRight3Mat = new Matrix4(frontBodyRight3.matrix);
  frontBodyRight3.matrix.scale(0.07, 0.09, 0.01);
  frontBodyRight3.render();

  //front body cube left side piece | parent: front body
  var frontBodyLeft = new Cube();
  frontBodyLeft.color = [1, 1, 0, 1.0];
  frontBodyLeft.matrix = new Matrix4(frontBodyFrame);
  frontBodyLeft.matrix.translate(0.0, 0.015, 0.3);
  var frontBodyLeftMat = new Matrix4(frontBodyLeft.matrix);
  frontBodyLeft.matrix.scale(0.15, 0.15, 0.01);
  frontBodyLeft.render();

  //front body cube left side piece 2 | parent: front body left side
  var frontBodyLeft2 = new Cube();
  frontBodyLeft2.color = [1, 0, 1, 1.0];
  frontBodyLeft2.matrix = new Matrix4(frontBodyLeftMat);
  frontBodyLeft2.matrix.translate(0.0, 0.015, 0.01);
  var frontBodyLeft2Mat = new Matrix4(frontBodyLeft2.matrix);
  frontBodyLeft2.matrix.scale(0.10, 0.12, 0.01);
  frontBodyLeft2.render();

  //front body cube left side piece 3 | parent: front body left side 2
  var frontBodyLeft3 = new Cube();
  frontBodyLeft3.color = [0, 0, 1, 1.0];
  frontBodyLeft3.matrix = new Matrix4(frontBodyLeft2Mat);
  frontBodyLeft3.matrix.translate(0.0, 0.01, 0.015);
  var frontBodyLeft3Mat = new Matrix4(frontBodyLeft3.matrix);
  frontBodyLeft3.matrix.scale(0.07, 0.09, 0.01);
  frontBodyLeft3.render();



  //draw a middle body cube (red) | parent: front body
  var middleBody = new Cube();
  middleBody.color = [1, 0, 0, 1.0];
  middleBody.matrix = new Matrix4(frontBodyFrame);
  middleBody.matrix.translate(-0.2, -0.005, 0.0);
  var middleBodyFrame = new Matrix4(middleBody.matrix);
  middleBody.matrix.scale(0.2, 0.2, 0.3);
  middleBody.render();

  //middle body top cube | parent: middle body
  var middleBodyTop = new Cube();
  middleBodyTop.color = [1,1,0,1.0];
  middleBodyTop.matrix = new Matrix4(middleBodyFrame);
  middleBodyTop.matrix.translate(0.025, 0.2, 0.05);
  var middleBodyTopFrame = new Matrix4(middleBodyTop.matrix);
  middleBodyTop.matrix.scale(0.15, 0.015, 0.2);
  middleBodyTop.render();



  //middle body cube underbelly | parent: middle body
  var middleBodyUnderbelly = new Cube();
  middleBodyUnderbelly.color = [0.8235, 0.7059, 0.5490, 1.0];
  middleBodyUnderbelly.matrix = new Matrix4(middleBodyFrame);
  middleBodyUnderbelly.matrix.translate(0.0, -0.03, 0.05);
  var middleBodyUnderbellyMat = new Matrix4(middleBodyUnderbelly.matrix);
  middleBodyUnderbelly.matrix.scale(0.2, 0.03, 0.2);
  middleBodyUnderbelly.render();

  //middle body cube underbelly2 | parent: middle body underbelly
  var middleBodyUnderbelly2 = new Cube();
  middleBodyUnderbelly2.color = [1, 0, 1, 1.0];
  middleBodyUnderbelly2.matrix = new Matrix4(middleBodyUnderbellyMat);
  middleBodyUnderbelly2.matrix.translate(0.01, -0.015, 0.01);
  middleBodyUnderbelly2.matrix.scale(0.15, 0.015, 0.15);
  middleBodyUnderbelly2.render();

  //middle body right side piece | parent: middle body
  var middleBodyRight = new Cube();
  middleBodyRight.color = [1, 1, 0, 1.0];
  middleBodyRight.matrix = new Matrix4(middleBodyFrame);
  middleBodyRight.matrix.translate(0.0, 0.015, -0.01);
  var middleBodyRightMat = new Matrix4(middleBodyRight.matrix);
  middleBodyRight.matrix.scale(0.2, 0.175, 0.01);
  middleBodyRight.render();

  //middle body right side piece 2 | parent: middle body right side
  var middleBodyRight2 = new Cube();
  middleBodyRight2.color = [0, 0, 1, 1.0];
  middleBodyRight2.matrix = new Matrix4(middleBodyRightMat);
  middleBodyRight2.matrix.translate(0.0, 0.015, -0.01);
  var middleBodyRight2Mat = new Matrix4(middleBodyRight2.matrix);
  middleBodyRight2.matrix.scale(0.2, 0.15, 0.01);
  middleBodyRight2.render();

  //middle body right side piece 3 | parent: middle body right side 2
  var middleBodyRight3 = new Cube();
  middleBodyRight3.color = [1, 1, 0, 1.0];
  middleBodyRight3.matrix = new Matrix4(middleBodyRight2Mat);
  middleBodyRight3.matrix.translate(0.0, 0.01, -0.015);
  var middleBodyRight3Mat = new Matrix4(middleBodyRight3.matrix);
  middleBodyRight3.matrix.scale(0.2, 0.1, 0.01);
  middleBodyRight3.render();

  //middle body right side piece 4 | parent: middle body right side 3
  var middleBodyRight4 = new Cube();
  middleBodyRight4.color = [1,0,1,1.0];
  middleBodyRight4.matrix = new Matrix4(middleBodyRight3Mat);
  middleBodyRight4.matrix.translate(0.025, 0.008, -0.02);
  middleBodyRight4.matrix.scale(0.13, 0.08, 0.01);
  middleBodyRight4.render();

  //middle body left side piece | parent: middle body
  var middleBodyLeft = new Cube();
  middleBodyLeft.color = [1, 1, 0, 1.0];
  middleBodyLeft.matrix = new Matrix4(middleBodyFrame);
  middleBodyLeft.matrix.translate(0.0, 0.015, 0.3);
  var middleBodyLeftMat = new Matrix4(middleBodyLeft.matrix);
  middleBodyLeft.matrix.scale(0.2, 0.175, 0.01);
  middleBodyLeft.render();

  //middle body left side piece 2 | parent: middle body left side
  var middleBodyLeft2 = new Cube();
  middleBodyLeft2.color = [0, 0, 1, 1.0];
  middleBodyLeft2.matrix = new Matrix4(middleBodyLeftMat);
  middleBodyLeft2.matrix.translate(0.0, 0.015, 0.01);
  var middleBodyLeft2Mat = new Matrix4(middleBodyLeft2.matrix);
  middleBodyLeft2.matrix.scale(0.2, 0.15, 0.01);
  middleBodyLeft2.render();

  //middle body left side piece 3 | parent: middle body left side 2
  var middleBodyLeft3 = new Cube();
  middleBodyLeft3.color = [1, 1, 0, 1.0];
  middleBodyLeft3.matrix = new Matrix4(middleBodyLeft2Mat);
  middleBodyLeft3.matrix.translate(0.0, 0.01, 0.015);
  var middleBodyLeft3Mat = new Matrix4(middleBodyLeft3.matrix);
  middleBodyLeft3.matrix.scale(0.2, 0.1, 0.01);
  middleBodyLeft3.render();

  //middle body left side piece 4 | parent: middle body left side 3
  var middleBodyLeft4 = new Cube();
  middleBodyLeft4.color = [1,0,1,1.0];
  middleBodyLeft4.matrix = new Matrix4(middleBodyLeft3Mat);
  middleBodyLeft4.matrix.translate(0.025, 0.008, 0.02);
  middleBodyLeft4.matrix.scale(0.13, 0.08, 0.01);
  middleBodyLeft4.render();


  //draw a back body cube (brown) | parent: middle body
  var backBody = new Cube();
  backBody.color = [0.8235, 0.7059, 0.5490, 1.0];
  backBody.matrix = new Matrix4(middleBodyFrame);
  backBody.matrix.translate(-0.15, 0.0, 0.03);
  var backBodyFrame = new Matrix4(backBody.matrix);
  backBody.matrix.scale(0.15, 0.15, 0.25);
  backBody.render();

  //back body cube right side | parent: back body
  var backBodyRight = new Cube();
  backBodyRight.color = [1, 1, 0, 1.0];
  backBodyRight.matrix = new Matrix4(backBodyFrame);
  backBodyRight.matrix.translate(0.015, 0.015, -0.02);
  var backBodyRightMat = new Matrix4(backBodyRight.matrix);
  backBodyRight.matrix.scale(0.125, 0.125, 0.03);
  backBodyRight.render();

  //back body cube right side 2 | parent: back body right side
  var backBodyRight2 = new Cube();
  backBodyRight2.color = [0, 0, 1, 1.0];
  backBodyRight2.matrix = new Matrix4(backBodyRightMat);
  backBodyRight2.matrix.translate(0.025, 0.015, -0.01);
  var backBodyRight2Mat = new Matrix4(backBodyRight2.matrix);
  backBodyRight2.matrix.scale(0.11, 0.1, 0.02);
  backBodyRight2.render();

  //back body cube right side 3 | parent: back body right side
  var backBodyRight3 = new Cube();
  backBodyRight3.color = [1, 0, 1, 1.0];
  backBodyRight3.matrix = new Matrix4(backBodyRight2Mat);
  backBodyRight3.matrix.translate(0.01, 0.01, -0.005);
  backBodyRight3.matrix.scale(0.1, 0.08, 0.01);
  backBodyRight3.render();

  //back body cube left side | parent: back body
  var backBodyLeft = new Cube();
  backBodyLeft.color = [1, 1, 0, 1.0];
  backBodyLeft.matrix = new Matrix4(backBodyFrame);
  backBodyLeft.matrix.translate(0.015, 0.015, 0.25);
  var backBodyLeftMat = new Matrix4(backBodyLeft.matrix);
  backBodyLeft.matrix.scale(0.125, 0.125, 0.03);
  backBodyLeft.render();

  //back body cube left side 2 | parent: back body right side
  var backBodyLeft2 = new Cube();
  backBodyLeft2.color = [0, 0, 1, 1.0];
  backBodyLeft2.matrix = new Matrix4(backBodyLeftMat);
  backBodyLeft2.matrix.translate(0.025, 0.015, 0.015);
  var backBodyLeft2Mat = new Matrix4(backBodyLeft2.matrix);
  backBodyLeft2.matrix.scale(0.11, 0.1, 0.02);
  backBodyLeft2.render();

  //back body cube left side 3 | parent: back body right side
  var backBodyLeft3 = new Cube();
  backBodyLeft3.color = [1, 0, 1, 1.0];
  backBodyLeft3.matrix = new Matrix4(backBodyLeft2Mat);
  backBodyLeft3.matrix.translate(0.01, 0.01, 0.022);
  backBodyLeft3.matrix.scale(0.1, 0.08, 0.01);
  backBodyLeft3.render();


  //back body cube underbelly | parent: back body
  var backBodyUnderbelly = new Cube();
  backBodyUnderbelly.color = [1, 0, 1, 1.0];
  backBodyUnderbelly.matrix = new Matrix4(backBodyFrame);
  backBodyUnderbelly.matrix.translate(0.05, -0.02, 0.0);
  var backBodyUnderbellyFrame = new Matrix4(backBodyUnderbelly.matrix);
  backBodyUnderbelly.matrix.scale(0.1, 0.02, 0.25);
  backBodyUnderbelly.render();

  //back body cube top | parent: back body
  var backBodyTop = new Cube();
  backBodyTop.color = [0,1,1,1.0];
  backBodyTop.matrix = new Matrix4(backBodyFrame);
  backBodyTop.matrix.translate(0.025, 0.15, 0.0);
  var backBodyTopFrame = new Matrix4(backBodyTop.matrix);
  backBodyTop.matrix.scale(0.15, 0.015, 0.25);
  backBodyTop.render();

  //back body cube top 2 | parent: back body top
  var backBodyTop2 = new Cube();
  backBodyTop2.color = [1,0.5,0.3490,1.0];
  backBodyTop2.matrix = new Matrix4(backBodyTopFrame);
  backBodyTop2.matrix.translate(0.025, 0.015, 0.02);
  backBodyTop2.matrix.scale(0.1, 0.015, 0.2);
  backBodyTop2.render();

  //base of tail1 | parent: back body
  var tailBase1 = new Cube();
  tailBase1.color = [0.8235, 1.0, 0.5490, 1.0];
  tailBase1.matrix = new Matrix4(backBodyFrame);
  tailBase1.matrix.translate(-0.05, 0.08, 0.08);
  var tailBase1FrameMat = new Matrix4(tailBase1.matrix);
  tailBase1.matrix.scale(0.05, 0.05, 0.075);
  tailBase1.render();

  //tail segments | parent: tail base n - 1
  var tailBase2 = new Cube();
  tailBase2.color = [1, 0.5, 0.3490, 1.0];
  tailBase2.matrix = new Matrix4(tailBase1FrameMat);
  tailBase2.matrix.translate(-0.02, 0.02, 0.01);
  var tailBase2FrameMat = new Matrix4(tailBase2.matrix);
  tailBase2.matrix.scale(0.02, 0.04, 0.06);
  tailBase2.render();

  var tailBase3 = new Cube();
  tailBase3.color = [0,1,1,1];
  tailBase3.matrix = new Matrix4(tailBase2FrameMat);
  tailBase3.matrix.translate(-0.02, 0.01, 0.005);
  var tailBase3FrameMat = new Matrix4(tailBase3.matrix);
  tailBase3.matrix.scale(0.02, 0.05, 0.05);
  tailBase3.render();

  var tailBase4 = new Cube();
  tailBase4.color = [0.8235, 0.7059, 0.5490, 1.0];
  tailBase4.matrix = new Matrix4(tailBase3FrameMat);
  tailBase4.matrix.translate(-0.006, 0.02, 0.005);
  var tailBase4FrameMat = new Matrix4(tailBase4.matrix);
  tailBase4.matrix.scale(0.02, 0.07, 0.03);
  tailBase4.render();

  var tail1Base5 = new Cube();
  tail1Base5.color = [1,0,1,1.0];
  tail1Base5.matrix = new Matrix4(tailBase4FrameMat);
  tail1Base5.matrix.translate(-0.01, 0.03, 0.002);
  var tail1Base5FrameMat = new Matrix4(tail1Base5.matrix);
  tail1Base5.matrix.scale(0.02, 0.08, 0.02);
  tail1Base5.render();

  //tail tip | parent: tail1 base5
  var tailTip = new Cube();
  tailTip.color = [1,1,0,1.0];
  tailTip.matrix = new Matrix4(tail1Base5FrameMat);
  tailTip.matrix.translate(0.003, 0.062, 0.001);
  tailTip.matrix.rotate(-40,0,0,1);
  tailTip.matrix.scale(0.02, 0.05, 0.015);
  tailTip.render();

  //---------------------------------------

  //draw a head cube | parent: front body
  var head = new Cube();
  head.color = [0.8235, 0.7059, 0.5490, 1.0];
  head.matrix = new Matrix4(frontBodyFrame);
  head.matrix.translate(0.13, 0.1, 0.05);
  var headFrame = new Matrix4(head.matrix);
  head.matrix.rotate(-g_headAngle, 0, 1, 0);
  head.matrix.scale(.18,0.18,0.18);
  head.render();

  //draw head back piece | parent: head
  var headBack = new Cube();
  headBack.color = [1, 1, 0, 1.0];
  headBack.matrix = new Matrix4(headFrame);
  headBack.matrix.translate(-0.01, 0.08, 0.014);
  var headBackMat = new Matrix4(headBack.matrix);
  headBack.matrix.rotate(-g_headAngle, 0, 1, 0);
  headBack.matrix.scale(0.01, 0.09, 0.15);
  headBack.render();

  //draw head back piece 2 | parent: head back
  var headBack2 = new Cube();
  headBack2.color = [1, 0, 1, 1.0];
  headBack2.matrix = new Matrix4(headBackMat);
  headBack2.matrix.translate(-0.01, 0.01, 0.025);
  var headBack2Mat = new Matrix4(headBack2.matrix);
  headBack2.matrix.rotate(-g_headAngle, 0, 1, 0);
  headBack2.matrix.scale(0.008, 0.07, 0.1);
  headBack2.render();

  //draw head back piece 3 | parent: head back 2
  var headBack3 = new Cube();
  headBack3.color = [0, 0, 1, 1.0];
  headBack3.matrix = new Matrix4(headBack2Mat);
  headBack3.matrix.translate(-0.005, 0.008, 0.015);
  headBack3.matrix.rotate(-g_headAngle, 0, 1, 0);
  headBack3.matrix.scale(0.005, 0.05, 0.07);
  headBack3.render();


  //draw front of head (face) | parent: head
  var headFace = new Cube();
  headFace.color = [1, 0.8431, 0.0, 1.0];
  headFace.matrix = new Matrix4(headFrame);
  headFace.matrix.translate(0.18, 0.015, 0.015);
  var headFaceMat = new Matrix4(headFace.matrix);
  headFace.matrix.rotate(-g_headAngle, 0, 1, 0);
  headFace.matrix.scale(0.01, 0.15, .15);
  headFace.render();

  // //draw front of head 2 | parent: head face
  var headFace2 = new Cube();
  headFace2.color = [1, 1, 0, 1.0];
  headFace2.matrix = new Matrix4(headFaceMat);
  headFace2.matrix.translate(0.01, 0.015, 0.025);
  var headFace2Mat = new Matrix4(headFace2.matrix);
  headFace2.matrix.rotate(-g_headAngle, 0, 1, 0);
  headFace2.matrix.scale(0.008, 0.12, 0.1);
  headFace2.render();

  //left eye | parent: head face 2
  var leftEye = new Cube();
  leftEye.color = [0, 0, 0, 1.0];
  leftEye.matrix = new Matrix4(headFace2Mat);
  leftEye.matrix.translate(0.005, 0.09, 0.09);
  leftEye.matrix.rotate(-g_headAngle, 0, 1, 0);
  leftEye.matrix.scale(0.02, 0.03, 0.03);
  leftEye.render();

  //right eye | parent: head face 2
  var rightEye = new Cube();
  rightEye.color = [0, 0, 0, 1.0];
  rightEye.matrix = new Matrix4(headFace2Mat);
  rightEye.matrix.translate(0.005, 0.09, -0.002);
  rightEye.matrix.rotate(-g_headAngle, 0, 1, 0);
  rightEye.matrix.scale(0.02, 0.03, 0.03);
  rightEye.render();


  //draw top jaw | parent: head face 2
  var headTopJaw = new Cube();
  headTopJaw.color = [1, 0, 1, 1.0];
  headTopJaw.matrix = new Matrix4(headFace2Mat);
  headTopJaw.matrix.translate(0.001, 0.025, 0.0025);
  var headTopJawMat = new Matrix4(headTopJaw.matrix);
  headTopJaw.matrix.rotate(-g_headAngle, 0, 1, 0);
  headTopJaw.matrix.scale(0.05, 0.05, 0.1);
  headTopJaw.render();

  //draw nose | parent: head top jaw
  var headNose = new Cube();
  headNose.color = [0, 0, 0, 1.0];
  headNose.matrix = new Matrix4(headTopJawMat);
  headNose.matrix.translate(0.05, 0.015, 0.04);
  headNose.matrix.rotate(-g_headAngle, 0, 1, 0);
  headNose.matrix.scale(0.02, 0.02, 0.02);
  headNose.render();


  //draw bottom jaw | parent: head face 2
  var headBottomJaw = new Cube();
  headBottomJaw.color = [1, 0, 1, 1.0];
  headBottomJaw.matrix = new Matrix4(headFace2Mat);
  headBottomJaw.matrix.translate(0.001, -0.005, 0.005);
  headBottomJaw.matrix.rotate(-g_headAngle, 0, 1, 0);
  headBottomJaw.matrix.scale(0.05, 0.045, 0.09);
  headBottomJaw.render();

  //draw head right piece | parent: head
  var headRight = new Cube();
  headRight.color = [1, 1, 0, 1.0];
  headRight.matrix = new Matrix4(headFrame);
  headRight.matrix.translate(0.015, 0.015, -0.012);
  var headRightMat = new Matrix4(headRight.matrix);
  headRight.matrix.rotate(-g_headAngle, 0, 1, 0);
  headRight.matrix.scale(0.15, 0.15, 0.02);
  headRight.render();

  //draw head right piece 2 | parent: head right
  var headRight2 = new Cube();
  headRight2.color = [1, 0, 1, 1.0];
  headRight2.matrix = new Matrix4(headRightMat);
  headRight2.matrix.translate(0.025, 0.015, -0.01);
  var headRight2Mat = new Matrix4(headRight2.matrix);
  headRight2.matrix.rotate(-g_headAngle, 0, 1, 0);
  headRight2.matrix.scale(0.1, 0.12, 0.01);
  headRight2.render();

  //draw head right piece 3 | parent: head right 2
  var headRight3 = new Cube();
  headRight3.color = [0, 0, 1, 1.0];
  headRight3.matrix = new Matrix4(headRight2Mat);
  headRight3.matrix.translate(0.015, 0.01, -0.005);
  headRight3.matrix.rotate(-g_headAngle, 0, 1, 0);
  headRight3.matrix.scale(0.07, 0.09, 0.01);
  headRight3.render();

  //draw head left piece | parent: head
  var headLeft = new Cube();
  headLeft.color = [1, 1, 0, 1.0];
  headLeft.matrix = new Matrix4(headFrame);
  headLeft.matrix.translate(0.015, 0.015, 0.18);
  var headLeftMat = new Matrix4(headLeft.matrix);
  headLeft.matrix.rotate(-g_headAngle, 0, 1, 0);
  headLeft.matrix.scale(0.15, 0.15, 0.02);
  headLeft.render();

  //draw head left piece 2 | parent: head left
  var headLeft2 = new Cube();
  headLeft2.color = [1, 0, 1, 1.0];
  headLeft2.matrix = new Matrix4(headLeftMat);
  headLeft2.matrix.translate(0.025, 0.015, 0.02);
  var headLeft2Mat = new Matrix4(headLeft2.matrix);
  headLeft2.matrix.rotate(-g_headAngle, 0, 1, 0);
  headLeft2.matrix.scale(0.1, 0.12, 0.01);
  headLeft2.render();

  //draw head left piece 3 | parent: head left 2
  var headLeft3 = new Cube();
  headLeft3.color = [0, 0, 1, 1.0];
  headLeft3.matrix = new Matrix4(headLeft2Mat);
  headLeft3.matrix.translate(0.015, 0.01, 0.01);
  headLeft3.matrix.rotate(-g_headAngle, 0, 1, 0);
  headLeft3.matrix.scale(0.07, 0.09, 0.01);
  headLeft3.render();



  //draw top of head | parent: head
  var headTop = new Cube();
  headTop.color = [1,1,0,1.0];
  headTop.matrix = new Matrix4(headFrame);
  headTop.matrix.translate(0.015, 0.18, 0.015);
  var headTopFrame = new Matrix4(headTop.matrix);
  headTop.matrix.rotate(-g_headAngle, 0, 1, 0);
  headTop.matrix.scale(0.15, 0.01, 0.15);
  headTop.render();

  //draw top of head 2 | parent: head top
  var headTop2 = new Cube();
  headTop2.color = [1,0,1,1.0];
  headTop2.matrix = new Matrix4(headTopFrame);
  headTop2.matrix.translate(0.025, 0.015, 0.025);
  var headTop2Frame = new Matrix4(headTop2.matrix);
  headTop2.matrix.rotate(-g_headAngle, 0, 1, 0);
  headTop2.matrix.scale(0.1, 0.01, 0.1);
  headTop2.render();

  //draw top of head 3 | parent: head top 2
  var headTop3 = new Cube();
  headTop3.color = [0,0,1,1.0];
  headTop3.matrix = new Matrix4(headTop2Frame);
  headTop3.matrix.translate(0.015, 0.01, 0.015);
  headTop3.matrix.rotate(-g_headAngle, 0, 1, 0);
  headTop3.matrix.scale(0.07, 0.01, 0.07);
  headTop3.render();

  //---------------------------------------

  //back right leg (red)| parent: back body cube underbelly
  var backRightLeg1 = new Cube();
  backRightLeg1.color = [1,0, 0, 1.0];
  backRightLeg1.matrix = new Matrix4(backBodyUnderbellyFrame);
  backRightLeg1.matrix.translate(0.0, -0.05, 0.0);
  var backRightKnee = new Matrix4(backRightLeg1.matrix);
  backRightLeg1.matrix.scale(.05, 0.05, 0.05);
  backRightLeg1.render();

  //brown piece (lower leg) | parent: back right leg 1
  var backRightLeg2 = new Cube();
  backRightLeg2.color = [0.8235, 0.7059, 0.5490, 1.0];
  backRightLeg2.matrix = new Matrix4(backRightKnee);
  backRightLeg2.matrix.translate(0, -0.07, 0.0);
  var backRightLegMat = new Matrix4(backRightLeg2.matrix);
  backRightLeg2.matrix.scale(.05, 0.07, 0.05);
  backRightLeg2.render();

  //paw piece (yellow) | parent: back right leg 2
  var backRightPaw = new Cube();
  backRightPaw.color = [1, 0.8431, 0.0, 1.0];
  backRightPaw.matrix = new Matrix4(backRightLegMat);
  backRightPaw.matrix.translate(0.0, -0.02, 0);
  backRightPaw.matrix.scale(.07, 0.025, 0.05);
  backRightPaw.render();

  //---------------------------------------

  //back left leg (red)| parent: back body cube underbelly
  var backLeftLeg1 = new Cube();
  backLeftLeg1.color = [1, 0.0, 0.0, 1.0];
  backLeftLeg1.matrix = new Matrix4(backBodyUnderbellyFrame);
  backLeftLeg1.matrix.translate(0.0, -0.05, 0.2);
  var backLeftKnee = new Matrix4(backLeftLeg1.matrix);
  backLeftLeg1.matrix.scale(.05, 0.05, 0.05);
  backLeftLeg1.render();


  // brown piece (lower leg) | parent: back left leg 1
  var backLeftLeg2 = new Cube();
  backLeftLeg2.color = [0.8235, 0.7059, 0.5490, 1.0];
  backLeftLeg2.matrix = new Matrix4(backLeftKnee);
  backLeftLeg2.matrix.translate(0.0, -0.07, 0.0);
  var backLeftLegMat = new Matrix4(backLeftLeg2.matrix);
  backLeftLeg2.matrix.scale(.05, 0.07, 0.05);
  backLeftLeg2.render();


  //paw piece (yellow) | parent: back left leg 2
  var backLeftPaw = new Cube();
  backLeftPaw.color = [1, 0.8431, 0.0, 1.0];
  backLeftPaw.matrix = new Matrix4(backLeftLegMat);
  backLeftPaw.matrix.translate(0.0, -0.02, 0);
  backLeftPaw.matrix.scale(.07, 0.025, 0.05);
  backLeftPaw.render();

  //---------------------------------------

  //front left leg (red) | parent: front body frame
  var frontLeftLeg1 = new Cube();
  frontLeftLeg1.color = [1, 0.0, 0.0, 1.0];
  frontLeftLeg1.matrix = new Matrix4(frontBodyFrame);
  frontLeftLeg1.matrix.translate(0.1, -0.075, 0.2);
  var frontLeftKnee = new Matrix4(frontLeftLeg1.matrix);
  frontLeftLeg1.matrix.scale(.05, 0.08, 0.05);
  frontLeftLeg1.render();

  // brown piece (lower leg) | parent: front left leg
  var frontLeftLeg2 = new Cube();
  frontLeftLeg2.color = [0.8235, 0.7059, 0.5490, 1.0];
  frontLeftLeg2.matrix = new Matrix4(frontLeftKnee);
  frontLeftLeg2.matrix.translate(0, -0.07, 0.0);
  var frontLeftLegMat = new Matrix4(frontLeftLeg2.matrix);
  frontLeftLeg2.matrix.scale(.05, 0.07, 0.05);
  frontLeftLeg2.render();

  //paw piece (yellow) | parent: front left leg 2
  var frontLeftPaw = new Cube();
  frontLeftPaw.color = [1, 0.8431, 0.0, 1.0];
  frontLeftPaw.matrix = new Matrix4(frontLeftLegMat);
  frontLeftPaw.matrix.translate(0.0, -0.02, 0);
  frontLeftPaw.matrix.scale(.07, 0.025, 0.05);
  frontLeftPaw.render();

  //---------------------------------------


  //front right leg | parent: front body frame
  var frontRightLeg = new Cube();
  frontRightLeg.color = [1, 0.0, 0.0, 1.0];
  frontRightLeg.matrix = new Matrix4(frontBodyFrame);
  frontRightLeg.matrix.translate(0.1, -0.073, 0.025);
  var frontRightKnee = new Matrix4(frontRightLeg.matrix);
  frontRightLeg.matrix.scale(.05, 0.08, 0.05);
  frontRightLeg.render();

  //brown piece (lower leg) | parent: front right leg
  var frontRightLeg2 = new Cube();
  frontRightLeg2.color = [0.8235, 0.7059, 0.5490, 1.0];
  frontRightLeg2.matrix = new Matrix4(frontRightKnee);
  frontRightLeg2.matrix.translate(0, -0.07, 0.0);
  var frontRightLegMat = new Matrix4(frontRightLeg2.matrix);
  frontRightLeg2.matrix.scale(.05, 0.07, 0.05);
  frontRightLeg2.render();

  //paw piece (yellow) | parent: front right leg 2
  var frontRightPaw = new Cube();
  frontRightPaw.color = [1, 0.8431, 0.0, 1.0];
  frontRightPaw.matrix = new Matrix4(frontRightLegMat);
  frontRightPaw.matrix.translate(0.0, -0.02, 0);
  frontRightPaw.matrix.scale(.07, 0.025, 0.05);
  frontRightPaw.render();

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
