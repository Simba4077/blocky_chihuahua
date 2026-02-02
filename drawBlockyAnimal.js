//drawBlockAnimal.js
function drawCloud(x,y,z){
    var c1 = new Cube();
    c1.color = [1.0, 1.0, 1.0, 1.0];
    c1.matrix.translate(x,y,z);
    c1.matrix.scale(0.3,0.12,0.18);
    c1.render();

    var c2 = new Cube();
    c2.color = [1.0, 1.0, 1.0, 1.0];
    c2.matrix.translate(x+0.2,y+0.05,z);
    c2.matrix.scale(0.25,0.1,0.16);
    c2.render();

    var c3 = new Cube();
    c3.color = [1.0, 1.0, 1.0, 1.0];
    c3.matrix.translate(x+0.38,y,z);
    c3.matrix.scale(0.28,0.11,0.18);
    c3.render();
}
function cloudwrapping(basex){
    return((basex + cloudOffset+CLOUD_TILE/2)%CLOUD_TILE)-CLOUD_TILE/2;
}
function renderScene() {
  // check the time at the start of function
  const startTime = performance.now();

  // global rotation
  const globalRotMat = new Matrix4().rotate(g_globalAngleX, 1, 0, 0).rotate(g_globalAngleY, 0, 1, 0).scale(g_animalScale, g_animalScale, g_animalScale);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas> (ONLY ONCE)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // ---------------------------------------
  // draw the body (3 pieces: front, middle, back)
  // ---------------------------------------

  //render clouds
  drawCloud(cloudwrapping(-1.2+3), 0.8, .5);
  drawCloud(cloudwrapping(0.3+3), 0.9, -.2);
  drawCloud(cloudwrapping(.6+3), 0.4, 1.1);
  drawCloud(cloudwrapping(1.0+3), 0.75, .7);
  drawCloud(cloudwrapping(1.6+3), 0.35, -.3);
  drawCloud(cloudwrapping(-.3+3), 0.6, .3);
  drawCloud(cloudwrapping(2.4+3), 0.758, -.8);


  //render ground
  var ground = new Cube();
  ground.color = [.2, .65, .25, 1];
  ground.matrix.translate(-1.3, -0.32, -0.3);
  ground.matrix.scale(3.0, 0.1, 3.0);
  ground.render();

  
  // front body cube | parent: none (origin)
  var frontBody = new Cube();
  frontBody.color = [0.898, 0.827, 0.702, 1.0];
  frontBody.matrix.translate(-0.05, -0.1, 0.0);
  var frontBodyFrame = new Matrix4(frontBody.matrix);
  frontBody.matrix.scale(0.18, 0.18, 0.28);
  frontBody.render();

  // front body front piece | parent: frontBodyFrame
  var frontBodyFront = new Cube();
  frontBodyFront.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyFront.matrix = new Matrix4(frontBodyFrame);
  frontBodyFront.matrix.translate(0.18, 0.015, 0.0375);
  var frontBodyFrontMat = new Matrix4(frontBodyFront.matrix);
  frontBodyFront.matrix.scale(0.02, 0.1, 0.2);
  frontBodyFront.render();

  // front body front piece 2 | parent: frontBodyFrontMat
  var frontBodyFront2 = new Cube();
  frontBodyFront2.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyFront2.matrix = new Matrix4(frontBodyFrontMat);
  frontBodyFront2.matrix.translate(0.02, 0.01, 0.025);
  var frontBodyFront2Mat = new Matrix4(frontBodyFront2.matrix);
  frontBodyFront2.matrix.scale(0.02, 0.08, 0.15);
  frontBodyFront2.render();

  // front body front piece 3 | parent: frontBodyFront2Mat
  var frontBodyFront3 = new Cube();
  frontBodyFront3.color = [1, 1, 1, 1.0];
  frontBodyFront3.matrix = new Matrix4(frontBodyFront2Mat);
  frontBodyFront3.matrix.translate(0.01, 0.008, 0.025);
  frontBodyFront3.matrix.scale(0.02, 0.05, 0.1);
  frontBodyFront3.render();

  // front body top | parent: frontBodyFrame
  var frontBodyTop = new Cube();
  frontBodyTop.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyTop.matrix = new Matrix4(frontBodyFrame);
  frontBodyTop.matrix.translate(0.001, 0.18, 0.065);
  frontBodyTop.matrix.scale(0.1, 0.008, 0.15);
  frontBodyTop.render();

  // front body underbelly | parent: frontBodyFrame
  var frontBodyUnderbelly = new Cube();
  frontBodyUnderbelly.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyUnderbelly.matrix = new Matrix4(frontBodyFrame);
  frontBodyUnderbelly.matrix.translate(0.0, -0.025, 0.05);
  frontBodyUnderbelly.matrix.scale(0.1, 0.025, 0.2);
  frontBodyUnderbelly.render();

  // front body right side | parent: frontBodyFrame
  var frontBodyRight = new Cube();
  frontBodyRight.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyRight.matrix = new Matrix4(frontBodyFrame);
  frontBodyRight.matrix.translate(0.0, 0.015, -0.01);
  var frontBodyRightMat = new Matrix4(frontBodyRight.matrix);
  frontBodyRight.matrix.scale(0.15, 0.15, 0.01);
  frontBodyRight.render();

  // front body right side 2 | parent: frontBodyRightMat
  var frontBodyRight2 = new Cube();
  frontBodyRight2.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyRight2.matrix = new Matrix4(frontBodyRightMat);
  frontBodyRight2.matrix.translate(0.0, 0.015, -0.01);
  var frontBodyRight2Mat = new Matrix4(frontBodyRight2.matrix);
  frontBodyRight2.matrix.scale(0.1, 0.12, 0.01);
  frontBodyRight2.render();

  // front body right side 3 | parent: frontBodyRight2Mat
  var frontBodyRight3 = new Cube();
  frontBodyRight3.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyRight3.matrix = new Matrix4(frontBodyRight2Mat);
  frontBodyRight3.matrix.translate(0.0, 0.01, -0.015);
  var frontBodyRight3Mat = new Matrix4(frontBodyRight3.matrix);
  frontBodyRight3.matrix.scale(0.07, 0.09, 0.01);
  frontBodyRight3.render();

  // front body left side | parent: frontBodyFrame
  var frontBodyLeft = new Cube();
  frontBodyLeft.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyLeft.matrix = new Matrix4(frontBodyFrame);
  frontBodyLeft.matrix.translate(0.0, 0.015, 0.3);
  var frontBodyLeftMat = new Matrix4(frontBodyLeft.matrix);
  frontBodyLeft.matrix.scale(0.15, 0.15, 0.01);
  frontBodyLeft.render();

  // front body left side 2 | parent: frontBodyLeftMat
  var frontBodyLeft2 = new Cube();
  frontBodyLeft2.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyLeft2.matrix = new Matrix4(frontBodyLeftMat);
  frontBodyLeft2.matrix.translate(0.0, 0.015, 0.01);
  var frontBodyLeft2Mat = new Matrix4(frontBodyLeft2.matrix);
  frontBodyLeft2.matrix.scale(0.1, 0.12, 0.01);
  frontBodyLeft2.render();

  // front body left side 3 | parent: frontBodyLeft2Mat
  var frontBodyLeft3 = new Cube();
  frontBodyLeft3.color = [0.898, 0.827, 0.702, 1.0];
  frontBodyLeft3.matrix = new Matrix4(frontBodyLeft2Mat);
  frontBodyLeft3.matrix.translate(0.0, 0.01, 0.015);
  var frontBodyLeft3Mat = new Matrix4(frontBodyLeft3.matrix);
  frontBodyLeft3.matrix.scale(0.07, 0.09, 0.01);
  frontBodyLeft3.render();

  // middle body | parent: frontBodyFrame
  var middleBody = new Cube();
  middleBody.color = [0.898, 0.827, 0.702, 1.0];
  middleBody.matrix = new Matrix4(frontBodyFrame);
  middleBody.matrix.translate(-0.2, -0.005, 0.0);
  var middleBodyFrame = new Matrix4(middleBody.matrix);
  middleBody.matrix.scale(0.2, 0.2, 0.3);
  middleBody.render();

  // middle body top | parent: middleBodyFrame
  var middleBodyTop = new Cube();
  middleBodyTop.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyTop.matrix = new Matrix4(middleBodyFrame);
  middleBodyTop.matrix.translate(0.025, 0.2, 0.05);
  var middleBodyTopFrame = new Matrix4(middleBodyTop.matrix);
  middleBodyTop.matrix.scale(0.15, 0.015, 0.2);
  middleBodyTop.render();

  // middle body underbelly | parent: middleBodyFrame
  var middleBodyUnderbelly = new Cube();
  middleBodyUnderbelly.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyUnderbelly.matrix = new Matrix4(middleBodyFrame);
  middleBodyUnderbelly.matrix.translate(0.0, -0.03, 0.05);
  var middleBodyUnderbellyMat = new Matrix4(middleBodyUnderbelly.matrix);
  middleBodyUnderbelly.matrix.scale(0.2, 0.03, 0.2);
  middleBodyUnderbelly.render();

  // middle body underbelly 2 | parent: middleBodyUnderbellyMat
  var middleBodyUnderbelly2 = new Cube();
  middleBodyUnderbelly2.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyUnderbelly2.matrix = new Matrix4(middleBodyUnderbellyMat);
  middleBodyUnderbelly2.matrix.translate(0.01, -0.015, 0.01);
  middleBodyUnderbelly2.matrix.scale(0.15, 0.015, 0.15);
  middleBodyUnderbelly2.render();

  // middle body right side | parent: middleBodyFrame
  var middleBodyRight = new Cube();
  middleBodyRight.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyRight.matrix = new Matrix4(middleBodyFrame);
  middleBodyRight.matrix.translate(0.0, 0.015, -0.01);
  var middleBodyRightMat = new Matrix4(middleBodyRight.matrix);
  middleBodyRight.matrix.scale(0.2, 0.175, 0.01);
  middleBodyRight.render();

  // middle body right side 2 | parent: middleBodyRightMat
  var middleBodyRight2 = new Cube();
  middleBodyRight2.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyRight2.matrix = new Matrix4(middleBodyRightMat);
  middleBodyRight2.matrix.translate(0.0, 0.015, -0.01);
  var middleBodyRight2Mat = new Matrix4(middleBodyRight2.matrix);
  middleBodyRight2.matrix.scale(0.2, 0.15, 0.01);
  middleBodyRight2.render();

  // middle body right side 3 | parent: middleBodyRight2Mat
  var middleBodyRight3 = new Cube();
  middleBodyRight3.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyRight3.matrix = new Matrix4(middleBodyRight2Mat);
  middleBodyRight3.matrix.translate(0.0, 0.01, -0.015);
  var middleBodyRight3Mat = new Matrix4(middleBodyRight3.matrix);
  middleBodyRight3.matrix.scale(0.2, 0.1, 0.01);
  middleBodyRight3.render();

  // middle body right side 4 | parent: middleBodyRight3Mat
  var middleBodyRight4 = new Cube();
  middleBodyRight4.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyRight4.matrix = new Matrix4(middleBodyRight3Mat);
  middleBodyRight4.matrix.translate(0.025, 0.008, -0.02);
  middleBodyRight4.matrix.scale(0.13, 0.08, 0.01);
  middleBodyRight4.render();

  // middle body left side | parent: middleBodyFrame
  var middleBodyLeft = new Cube();
  middleBodyLeft.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyLeft.matrix = new Matrix4(middleBodyFrame);
  middleBodyLeft.matrix.translate(0.0, 0.015, 0.3);
  var middleBodyLeftMat = new Matrix4(middleBodyLeft.matrix);
  middleBodyLeft.matrix.scale(0.2, 0.175, 0.01);
  middleBodyLeft.render();

  // middle body left side 2 | parent: middleBodyLeftMat
  var middleBodyLeft2 = new Cube();
  middleBodyLeft2.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyLeft2.matrix = new Matrix4(middleBodyLeftMat);
  middleBodyLeft2.matrix.translate(0.0, 0.015, 0.01);
  var middleBodyLeft2Mat = new Matrix4(middleBodyLeft2.matrix);
  middleBodyLeft2.matrix.scale(0.2, 0.15, 0.01);
  middleBodyLeft2.render();

  // middle body left side 3 | parent: middleBodyLeft2Mat
  var middleBodyLeft3 = new Cube();
  middleBodyLeft3.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyLeft3.matrix = new Matrix4(middleBodyLeft2Mat);
  middleBodyLeft3.matrix.translate(0.0, 0.01, 0.015);
  var middleBodyLeft3Mat = new Matrix4(middleBodyLeft3.matrix);
  middleBodyLeft3.matrix.scale(0.2, 0.1, 0.01);
  middleBodyLeft3.render();

  // middle body left side 4 | parent: middleBodyLeft3Mat
  var middleBodyLeft4 = new Cube();
  middleBodyLeft4.color = [0.898, 0.827, 0.702, 1.0];
  middleBodyLeft4.matrix = new Matrix4(middleBodyLeft3Mat);
  middleBodyLeft4.matrix.translate(0.025, 0.008, 0.02);
  middleBodyLeft4.matrix.scale(0.13, 0.08, 0.01);
  middleBodyLeft4.render();

  // back body | parent: middleBodyFrame
  var backBody = new Cube();
  backBody.color = [0.898, 0.827, 0.702, 1.0];
  backBody.matrix = new Matrix4(middleBodyFrame);
  backBody.matrix.translate(-0.15, 0.0, 0.03);
  var backBodyFrame = new Matrix4(backBody.matrix);
  backBody.matrix.scale(0.15, 0.15, 0.25);
  backBody.render();

  // left booty cheek | parent: backBodyFrame
  var backBodyButtLeft = new Cube();
  backBodyButtLeft.color = [0.898, 0.827, 0.702, 1.0];
  backBodyButtLeft.matrix = new Matrix4(backBodyFrame);
  backBodyButtLeft.matrix.translate(-0.01, 0.035, 0.15);
  var backBodyButtLeftMat = new Matrix4(backBodyButtLeft.matrix);
  backBodyButtLeft.matrix.scale(0.01, 0.075, 0.075);
  backBodyButtLeft.render();

  var backBodyButtLeft2 = new Cube();
  backBodyButtLeft2.color = [0.898, 0.827, 0.702, 1.0];
  backBodyButtLeft2.matrix = new Matrix4(backBodyButtLeftMat);
  backBodyButtLeft2.matrix.translate(-0.005, 0.015, 0.015);
  var backBodyButtLeft2Mat = new Matrix4(backBodyButtLeft2.matrix);
  backBodyButtLeft2.matrix.scale(0.005, 0.05, 0.05);
  backBodyButtLeft2.render();

  var backBodyButtLeft3 = new Cube();
  backBodyButtLeft3.color = [0.898, 0.827, 0.702, 1.0];
  backBodyButtLeft3.matrix = new Matrix4(backBodyButtLeft2Mat);
  backBodyButtLeft3.matrix.translate(-0.004, 0.01, 0.01);
  backBodyButtLeft3.matrix.scale(0.008, 0.03, 0.03);
  backBodyButtLeft3.render();

  // right booty cheek | parent: backBodyFrame
  var backBodyButtRight = new Cube();
  backBodyButtRight.color = [0.898, 0.827, 0.702, 1.0];
  backBodyButtRight.matrix = new Matrix4(backBodyFrame);
  backBodyButtRight.matrix.translate(-0.01, 0.035, 0.009);
  var backBodyButtRightMat = new Matrix4(backBodyButtRight.matrix);
  backBodyButtRight.matrix.scale(0.01, 0.075, 0.075);
  backBodyButtRight.render();

  var backBodyButtRight2 = new Cube();
  backBodyButtRight2.color = [0.898, 0.827, 0.702, 1.0];
  backBodyButtRight2.matrix = new Matrix4(backBodyButtRightMat);
  backBodyButtRight2.matrix.translate(-0.005, 0.015, 0.015);
  var backBodyButtRight2Mat = new Matrix4(backBodyButtRight2.matrix);
  backBodyButtRight2.matrix.scale(0.005, 0.05, 0.05);
  backBodyButtRight2.render();

  var backBodyButtRight3 = new Cube();
  backBodyButtRight3.color = [0.898, 0.827, 0.702, 1.0];
  backBodyButtRight3.matrix = new Matrix4(backBodyButtRight2Mat);
  backBodyButtRight3.matrix.translate(-0.004, 0.01, 0.01);
  backBodyButtRight3.matrix.scale(0.008, 0.03, 0.03);
  backBodyButtRight3.render();

  // back right side | parent: backBodyFrame
  var backBodyRight = new Cube();
  backBodyRight.color = [0.898, 0.827, 0.702, 1.0];
  backBodyRight.matrix = new Matrix4(backBodyFrame);
  backBodyRight.matrix.translate(0.015, 0.015, -0.02);
  var backBodyRightMat = new Matrix4(backBodyRight.matrix);
  backBodyRight.matrix.scale(0.125, 0.125, 0.03);
  backBodyRight.render();

  var backBodyRight2 = new Cube();
  backBodyRight2.color = [0.898, 0.827, 0.702, 1.0];
  backBodyRight2.matrix = new Matrix4(backBodyRightMat);
  backBodyRight2.matrix.translate(0.025, 0.015, -0.01);
  var backBodyRight2Mat = new Matrix4(backBodyRight2.matrix);
  backBodyRight2.matrix.scale(0.11, 0.1, 0.02);
  backBodyRight2.render();

  var backBodyRight3 = new Cube();
  backBodyRight3.color = [0.898, 0.827, 0.702, 1.0];
  backBodyRight3.matrix = new Matrix4(backBodyRight2Mat);
  backBodyRight3.matrix.translate(0.01, 0.01, -0.005);
  backBodyRight3.matrix.scale(0.1, 0.08, 0.01);
  backBodyRight3.render();

  // back left side | parent: backBodyFrame
  var backBodyLeft = new Cube();
  backBodyLeft.color = [0.898, 0.827, 0.702, 1.0];
  backBodyLeft.matrix = new Matrix4(backBodyFrame);
  backBodyLeft.matrix.translate(0.015, 0.015, 0.25);
  var backBodyLeftMat = new Matrix4(backBodyLeft.matrix);
  backBodyLeft.matrix.scale(0.125, 0.125, 0.03);
  backBodyLeft.render();

  var backBodyLeft2 = new Cube();
  backBodyLeft2.color = [0.898, 0.827, 0.702, 1.0];
  backBodyLeft2.matrix = new Matrix4(backBodyLeftMat);
  backBodyLeft2.matrix.translate(0.025, 0.015, 0.015);
  var backBodyLeft2Mat = new Matrix4(backBodyLeft2.matrix);
  backBodyLeft2.matrix.scale(0.11, 0.1, 0.02);
  backBodyLeft2.render();

  var backBodyLeft3 = new Cube();
  backBodyLeft3.color = [0.898, 0.827, 0.702, 1.0];
  backBodyLeft3.matrix = new Matrix4(backBodyLeft2Mat);
  backBodyLeft3.matrix.translate(0.01, 0.01, 0.022);
  backBodyLeft3.matrix.scale(0.1, 0.08, 0.01);
  backBodyLeft3.render();

  // back underbelly | parent: backBodyFrame
  var backBodyUnderbelly = new Cube();
  backBodyUnderbelly.color = [0.898, 0.827, 0.702, 1.0];
  backBodyUnderbelly.matrix = new Matrix4(backBodyFrame);
  backBodyUnderbelly.matrix.translate(0.05, -0.02, 0.0);
  var backBodyUnderbellyFrame = new Matrix4(backBodyUnderbelly.matrix);
  backBodyUnderbelly.matrix.scale(0.1, 0.02, 0.25);
  backBodyUnderbelly.render();

  // back top | parent: backBodyFrame
  var backBodyTop = new Cube();
  backBodyTop.color = [0.898, 0.827, 0.702, 1.0];
  backBodyTop.matrix = new Matrix4(backBodyFrame);
  backBodyTop.matrix.translate(0.025, 0.15, 0.0);
  var backBodyTopFrame = new Matrix4(backBodyTop.matrix);
  backBodyTop.matrix.scale(0.15, 0.015, 0.25);
  backBodyTop.render();

  var backBodyTop2 = new Cube();
  backBodyTop2.color = [0.898, 0.827, 0.702, 1.0];
  backBodyTop2.matrix = new Matrix4(backBodyTopFrame);
  backBodyTop2.matrix.translate(0.025, 0.015, 0.02);
  backBodyTop2.matrix.scale(0.1, 0.015, 0.2);
  backBodyTop2.render();

  // ---------------------------------------
  // tail (parent: backBodyFrame)
  // ---------------------------------------

  var tailBase1 = new Cube();
  tailBase1.color = [0.898, 0.827, 0.702, 1.0];
  tailBase1.matrix = new Matrix4(backBodyFrame);
  tailBase1.matrix.translate(-0.05, 0.1, 0.1);
  tailBase1.matrix.rotate(g_tailAngle, 0, 1, 0);
  var tailBase1FrameMat = new Matrix4(tailBase1.matrix);
  tailBase1.matrix.scale(0.05, 0.05, 0.075);
  tailBase1.render();

  var tailBase2 = new Cube();
  tailBase2.color = [0.824, 0.706, 0.549, 1.0];
  tailBase2.matrix = new Matrix4(tailBase1FrameMat);
  tailBase2.matrix.translate(-0.02, 0.02, 0.01);
  var tailBase2FrameMat = new Matrix4(tailBase2.matrix);
  tailBase2.matrix.scale(0.02, 0.04, 0.06);
  tailBase2.render();

  var tailBase3 = new Cube();
  tailBase3.color = [0.824, 0.706, 0.549, 1.0];
  tailBase3.matrix = new Matrix4(tailBase2FrameMat);
  tailBase3.matrix.translate(-0.02, 0.01, 0.005);
  var tailBase3FrameMat = new Matrix4(tailBase3.matrix);
  tailBase3.matrix.scale(0.02, 0.05, 0.05);
  tailBase3.render();

  var tailBase4 = new Cube();
  tailBase4.color = [0.824, 0.706, 0.549, 1.0];
  tailBase4.matrix = new Matrix4(tailBase3FrameMat);
  tailBase4.matrix.translate(-0.006, 0.02, 0.005);
  var tailBase4FrameMat = new Matrix4(tailBase4.matrix);
  tailBase4.matrix.scale(0.02, 0.07, 0.03);
  tailBase4.render();

  var tail1Base5 = new Cube();
  tail1Base5.color = [1, 1, 1, 1.0];
  tail1Base5.matrix = new Matrix4(tailBase4FrameMat);
  tail1Base5.matrix.translate(-0.01, 0.03, 0.002);
  var tail1Base5FrameMat = new Matrix4(tail1Base5.matrix);
  tail1Base5.matrix.scale(0.02, 0.08, 0.02);
  tail1Base5.render();

  var tailTip = new Cube();
  tailTip.color = [1, 1, 1, 1.0];
  tailTip.matrix = new Matrix4(tail1Base5FrameMat);
  tailTip.matrix.translate(0.003, 0.062, 0.001);
  tailTip.matrix.rotate(-40, 0, 0, 1);
  tailTip.matrix.scale(0.02, 0.05, 0.015);
  tailTip.render();

  // ---------------------------------------
  // head (parent: frontBodyFrame)
  // ---------------------------------------

  var head = new Cube();
  head.color = [0.898, 0.827, 0.702, 1.0];
  head.matrix = new Matrix4(frontBodyFrame);
  head.matrix.translate(0.13, 0.1, 0.05);
  head.matrix.rotate(-g_headAngle, 0, 1, 0);
  var headFrame = new Matrix4(head.matrix);
  head.matrix.scale(0.18, 0.18, 0.18);
  head.render();

  // ears (right)
  var earBaseRight = new Cube();
  earBaseRight.color = [0.725, 0.6, 0.463, 1.0];
  earBaseRight.matrix = new Matrix4(headFrame);
  earBaseRight.matrix.translate(0.1, 0.185, 0.005);
  var earBaseRightMat = new Matrix4(earBaseRight.matrix);
  earBaseRight.matrix.scale(0.06, 0.03, 0.06);
  earBaseRight.render();

  var earBaseRight2 = new Cube();
  earBaseRight2.color = [0.725, 0.6, 0.463, 1.0];
  earBaseRight2.matrix = new Matrix4(earBaseRightMat);
  earBaseRight2.matrix.translate(0.001, 0.03, 0.0);
  var earBaseRight2Mat = new Matrix4(earBaseRight2.matrix);
  earBaseRight2.matrix.scale(0.045, 0.03, 0.045);
  earBaseRight2.render();

  var earBaseRight3 = new Cube();
  earBaseRight3.color = [0.725, 0.6, 0.463, 1.0];
  earBaseRight3.matrix = new Matrix4(earBaseRight2Mat);
  earBaseRight3.matrix.translate(0.004, 0.03, 0.0);
  var earBaseRight3Mat = new Matrix4(earBaseRight3.matrix);
  earBaseRight3.matrix.scale(0.035, 0.025, 0.035);
  earBaseRight3.render();

  var earBaseRight4 = new Cube();
  earBaseRight4.color = [0.725, 0.6, 0.463, 1.0];
  earBaseRight4.matrix = new Matrix4(earBaseRight3Mat);
  earBaseRight4.matrix.translate(0.003, 0.02, 0.0);
  earBaseRight4.matrix.scale(0.025, 0.02, 0.025);
  earBaseRight4.render();

  // ears (left)
  var earBaseLeft = new Cube();
  earBaseLeft.color = [0.725, 0.6, 0.463, 1.0];
  earBaseLeft.matrix = new Matrix4(headFrame);
  earBaseLeft.matrix.translate(0.1, 0.185, 0.12);
  var earBaseLeftMat = new Matrix4(earBaseLeft.matrix);
  earBaseLeft.matrix.scale(0.06, 0.03, 0.06);
  earBaseLeft.render();

  var earBaseLeft2 = new Cube();
  earBaseLeft2.color = [0.725, 0.6, 0.463, 1.0];
  earBaseLeft2.matrix = new Matrix4(earBaseLeftMat);
  earBaseLeft2.matrix.translate(0.001, 0.03, 0.019);
  var earBaseLeft2Mat = new Matrix4(earBaseLeft2.matrix);
  earBaseLeft2.matrix.scale(0.045, 0.03, 0.045);
  earBaseLeft2.render();

  var earBaseLeft3 = new Cube();
  earBaseLeft3.color = [0.725, 0.6, 0.463, 1.0];
  earBaseLeft3.matrix = new Matrix4(earBaseLeft2Mat);
  earBaseLeft3.matrix.translate(0.004, 0.03, 0.019);
  var earBaseLeft3Mat = new Matrix4(earBaseLeft3.matrix);
  earBaseLeft3.matrix.scale(0.035, 0.025, 0.035);
  earBaseLeft3.render();

  var earBaseLeft4 = new Cube();
  earBaseLeft4.color = [0.725, 0.6, 0.463, 1.0];
  earBaseLeft4.matrix = new Matrix4(earBaseLeft3Mat);
  earBaseLeft4.matrix.translate(0.003, 0.02, 0.01);
  earBaseLeft4.matrix.scale(0.025, 0.02, 0.025);
  earBaseLeft4.render();

  // head back pieces
  var headBack = new Cube();
  headBack.color = [0.898, 0.827, 0.702, 1.0];
  headBack.matrix = new Matrix4(headFrame);
  headBack.matrix.translate(-0.01, 0.08, 0.014);
  var headBackMat = new Matrix4(headBack.matrix);
  headBack.matrix.scale(0.01, 0.09, 0.15);
  headBack.render();

  var headBack2 = new Cube();
  headBack2.color = [0.898, 0.827, 0.702, 1.0];
  headBack2.matrix = new Matrix4(headBackMat);
  headBack2.matrix.translate(-0.01, 0.01, 0.025);
  var headBack2Mat = new Matrix4(headBack2.matrix);
  headBack2.matrix.scale(0.008, 0.07, 0.1);
  headBack2.render();

  var headBack3 = new Cube();
  headBack3.color = [0.898, 0.827, 0.702, 1.0];
  headBack3.matrix = new Matrix4(headBack2Mat);
  headBack3.matrix.translate(-0.005, 0.008, 0.015);
  headBack3.matrix.scale(0.005, 0.05, 0.07);
  headBack3.render();

  // face
  var headFace = new Cube();
  headFace.color = [0.898, 0.827, 0.702, 1.0];
  headFace.matrix = new Matrix4(headFrame);
  headFace.matrix.translate(0.18, 0.015, 0.015);
  var headFaceMat = new Matrix4(headFace.matrix);
  headFace.matrix.scale(0.01, 0.15, 0.15);
  headFace.render();

  var headFace2 = new Cube();
  headFace2.color = [0.898, 0.827, 0.702, 1.0];
  headFace2.matrix = new Matrix4(headFaceMat);
  headFace2.matrix.translate(0.01, 0.015, 0.025);
  var headFace2Mat = new Matrix4(headFace2.matrix);
  headFace2.matrix.scale(0.008, 0.12, 0.1);
  headFace2.render();

  // eyes
  var leftEye = new Cube();
  leftEye.color = [0, 0, 0, 1.0];
  leftEye.matrix = new Matrix4(headFace2Mat);
  leftEye.matrix.translate(0.005, 0.09, 0.09);
  leftEye.matrix.scale(0.02, 0.03, 0.03);
  leftEye.render();

  var rightEye = new Cube();
  rightEye.color = [0, 0, 0, 1.0];
  rightEye.matrix = new Matrix4(headFace2Mat);
  rightEye.matrix.translate(0.005, 0.09, -0.002);
  rightEye.matrix.scale(0.02, 0.03, 0.03);
  rightEye.render();

  // jaws + nose
  var headTopJaw = new Cube();
  headTopJaw.color = [0.824, 0.706, 0.549, 1.0];
  headTopJaw.matrix = new Matrix4(headFace2Mat);
  headTopJaw.matrix.translate(0.001, 0.025, 0.0025);
  var headTopJawMat = new Matrix4(headTopJaw.matrix);
  headTopJaw.matrix.scale(0.05, 0.05, 0.1);
  headTopJaw.render();

  var headNose = new Cube();
  headNose.color = [0, 0, 0, 1.0];
  headNose.matrix = new Matrix4(headTopJawMat);
  headNose.matrix.translate(0.05, 0.015, 0.04);
  headNose.matrix.scale(0.02, 0.02, 0.02);
  headNose.render();

  var headBottomJaw = new Cube();
  headBottomJaw.color = [0.824, 0.706, 0.549, 1.0];
  headBottomJaw.matrix = new Matrix4(headFace2Mat);
  headBottomJaw.matrix.translate(0.001, -0.005, 0.005);
  headBottomJaw.matrix.scale(0.05, 0.045, 0.09);
  headBottomJaw.render();

  // head sides/top
  var headRight = new Cube();
  headRight.color = [0.898, 0.827, 0.702, 1.0];
  headRight.matrix = new Matrix4(headFrame);
  headRight.matrix.translate(0.015, 0.015, -0.012);
  var headRightMat = new Matrix4(headRight.matrix);
  headRight.matrix.scale(0.15, 0.15, 0.02);
  headRight.render();

  var headRight2 = new Cube();
  headRight2.color = [0.898, 0.827, 0.702, 1.0];
  headRight2.matrix = new Matrix4(headRightMat);
  headRight2.matrix.translate(0.025, 0.015, -0.01);
  var headRight2Mat = new Matrix4(headRight2.matrix);
  headRight2.matrix.scale(0.1, 0.12, 0.01);
  headRight2.render();

  var headRight3 = new Cube();
  headRight3.color = [0.898, 0.827, 0.702, 1.0];
  headRight3.matrix = new Matrix4(headRight2Mat);
  headRight3.matrix.translate(0.015, 0.01, -0.005);
  headRight3.matrix.scale(0.07, 0.09, 0.01);
  headRight3.render();

  var headLeft = new Cube();
  headLeft.color = [0.898, 0.827, 0.702, 1.0];
  headLeft.matrix = new Matrix4(headFrame);
  headLeft.matrix.translate(0.015, 0.015, 0.18);
  var headLeftMat = new Matrix4(headLeft.matrix);
  headLeft.matrix.scale(0.15, 0.15, 0.02);
  headLeft.render();

  var headLeft2 = new Cube();
  headLeft2.color = [0.898, 0.827, 0.702, 1.0];
  headLeft2.matrix = new Matrix4(headLeftMat);
  headLeft2.matrix.translate(0.025, 0.015, 0.02);
  var headLeft2Mat = new Matrix4(headLeft2.matrix);
  headLeft2.matrix.scale(0.1, 0.12, 0.01);
  headLeft2.render();

  var headLeft3 = new Cube();
  headLeft3.color = [0.898, 0.827, 0.702, 1.0];
  headLeft3.matrix = new Matrix4(headLeft2Mat);
  headLeft3.matrix.translate(0.015, 0.01, 0.01);
  headLeft3.matrix.scale(0.07, 0.09, 0.01);
  headLeft3.render();

  var headTop = new Cube();
  headTop.color = [0.898, 0.827, 0.702, 1.0];
  headTop.matrix = new Matrix4(headFrame);
  headTop.matrix.translate(0.015, 0.18, 0.015);
  var headTopFrame = new Matrix4(headTop.matrix);
  headTop.matrix.scale(0.15, 0.01, 0.15);
  headTop.render();

  var headTop2 = new Cube();
  headTop2.color = [0.898, 0.827, 0.702, 1.0];
  headTop2.matrix = new Matrix4(headTopFrame);
  headTop2.matrix.translate(0.025, 0.01, 0.025);
  var headTop2Frame = new Matrix4(headTop2.matrix);
  headTop2.matrix.scale(0.1, 0.01, 0.1);
  headTop2.render();

  var headTop3 = new Cube();
  headTop3.color = [0.898, 0.827, 0.702, 1.0];
  headTop3.matrix = new Matrix4(headTop2Frame);
  headTop3.matrix.translate(0.015, 0.01, 0.015);
  headTop3.matrix.scale(0.07, 0.01, 0.07);
  headTop3.render();

  // ---------------------------------------
  // legs
  // ---------------------------------------

  // back right leg | parent: backBodyUnderbellyFrame
  var backRightLeg1 = new Cube();
  backRightLeg1.color = [0.824, 0.706, 0.549, 1.0];
  backRightLeg1.matrix = new Matrix4(backBodyUnderbellyFrame);
  backRightLeg1.matrix.translate(0.0, -0.025, 0.0);
  backRightLeg1.matrix.rotate(g_rightBackShoulderAngle, 0, 0, 1);
  var backRightKnee = new Matrix4(backRightLeg1.matrix);
  backRightLeg1.matrix.scale(0.05, 0.05, 0.05);
  backRightLeg1.render();

  var backRightLeg2 = new Cube();
  backRightLeg2.color = [0.824, 0.706, 0.549, 1.0];
  backRightLeg2.matrix = new Matrix4(backRightKnee);
  backRightLeg2.matrix.rotate(g_rightBackKneeAngle, 0, 0, 1);
  backRightLeg2.matrix.translate(0, -0.05, 0.0);
  var backRightLegMat = new Matrix4(backRightLeg2.matrix);
  backRightLeg2.matrix.scale(0.05, 0.07, 0.05);
  backRightLeg2.render();

  var backRightPaw = new Cube();
  backRightPaw.color = [1, 1, 1, 1.0];
  backRightPaw.matrix = new Matrix4(backRightLegMat);
  backRightPaw.matrix.translate(0.0, -0.02, 0);
  backRightPaw.matrix.scale(0.07, 0.025, 0.05);
  backRightPaw.render();

  // back left leg | parent: backBodyUnderbellyFrame
  var backLeftLeg1 = new Cube();
  backLeftLeg1.color = [0.824, 0.706, 0.549, 1.0];
  backLeftLeg1.matrix = new Matrix4(backBodyUnderbellyFrame);
  backLeftLeg1.matrix.translate(0.0, -0.025, 0.2);
  backLeftLeg1.matrix.rotate(g_leftBackShoulderAngle, 0, 0, 1);
  var backLeftKnee = new Matrix4(backLeftLeg1.matrix);
  backLeftLeg1.matrix.scale(0.05, 0.05, 0.05);
  backLeftLeg1.render();

  var backLeftLeg2 = new Cube();
  backLeftLeg2.color = [0.824, 0.706, 0.549, 1.0];
  backLeftLeg2.matrix = new Matrix4(backLeftKnee);
  backLeftLeg2.matrix.rotate(g_leftBackKneeAngle, 0, 0, 1);
  backLeftLeg2.matrix.translate(0.0, -0.05, 0.0);
  var backLeftLegMat = new Matrix4(backLeftLeg2.matrix);
  backLeftLeg2.matrix.scale(0.05, 0.07, 0.05);
  backLeftLeg2.render();

  var backLeftPaw = new Cube();
  backLeftPaw.color = [1, 1, 1, 1.0];
  backLeftPaw.matrix = new Matrix4(backLeftLegMat);
  backLeftPaw.matrix.translate(0.0, -0.02, 0);
  backLeftPaw.matrix.scale(0.07, 0.025, 0.05);
  backLeftPaw.render();

  // front left leg | parent: frontBodyFrame
  var frontLeftLeg1 = new Cube();
  frontLeftLeg1.color = [0.824, 0.706, 0.549, 1.0];
  frontLeftLeg1.matrix = new Matrix4(frontBodyFrame);
  frontLeftLeg1.matrix.translate(0.1, -0.05, 0.2);
  frontLeftLeg1.matrix.rotate(g_leftFrontShoulderAngle, 0, 0, 1);
  var frontLeftKnee = new Matrix4(frontLeftLeg1.matrix);
  frontLeftLeg1.matrix.scale(0.05, 0.08, 0.05);
  frontLeftLeg1.render();

  var frontLeftLeg2 = new Cube();
  frontLeftLeg2.color = [0.824, 0.706, 0.549, 1.0];
  frontLeftLeg2.matrix = new Matrix4(frontLeftKnee);
  frontLeftLeg2.matrix.rotate(g_leftFrontKneeAngle, 0, 0, 1);
  frontLeftLeg2.matrix.translate(0, -0.05, 0.0);
  var frontLeftLegMat = new Matrix4(frontLeftLeg2.matrix);
  frontLeftLeg2.matrix.scale(0.05, 0.07, 0.05);
  frontLeftLeg2.render();

  var frontLeftPaw = new Cube();
  frontLeftPaw.color = [1, 1, 1, 1.0];
  frontLeftPaw.matrix = new Matrix4(frontLeftLegMat);
  frontLeftPaw.matrix.translate(0.0, -0.02, 0);
  frontLeftPaw.matrix.scale(0.07, 0.025, 0.05);
  frontLeftPaw.render();

  // front right leg | parent: frontBodyFrame
  var frontRightLeg = new Cube();
  frontRightLeg.color = [0.824, 0.706, 0.549, 1.0];
  frontRightLeg.matrix = new Matrix4(frontBodyFrame);
  frontRightLeg.matrix.translate(0.1, -0.05, 0.025);
  frontRightLeg.matrix.rotate(g_rightFrontShoulderAngle, 0, 0, 1);
  var frontRightKnee = new Matrix4(frontRightLeg.matrix);
  frontRightLeg.matrix.scale(0.05, 0.08, 0.05);
  frontRightLeg.render();

  var frontRightLeg2 = new Cube();
  frontRightLeg2.color = [0.824, 0.706, 0.549, 1.0];
  frontRightLeg2.matrix = new Matrix4(frontRightKnee);
  frontRightLeg2.matrix.rotate(g_rightFrontKneeAngle, 0, 0, 1);
  frontRightLeg2.matrix.translate(0, -0.05, 0.0);
  var frontRightLegMat = new Matrix4(frontRightLeg2.matrix);
  frontRightLeg2.matrix.scale(0.05, 0.07, 0.05);
  frontRightLeg2.render();

  var frontRightPaw = new Cube();
  frontRightPaw.color = [1, 1, 1, 1.0];
  frontRightPaw.matrix = new Matrix4(frontRightLegMat);
  frontRightPaw.matrix.translate(0.0, -0.02, 0);
  frontRightPaw.matrix.scale(0.07, 0.025, 0.05);
  frontRightPaw.render();

  // ---------------------------------------
  // reference cube
  // ---------------------------------------
  var ref = new Cube();
  ref.color = [1, 1.0, 1.0, 0.02];
  ref.render();

  const duration = performance.now() - startTime;
  sendTextToHTML(
    " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000 / duration),
    "numdot"
  );
}
