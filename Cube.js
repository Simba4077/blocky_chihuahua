class Cube{
  constructor(){
    this.type='cube';
    this.color=[1.0,1.0,1.0,1.0];
    //this.matrix = new Matrix4(); //uncomment when using 
  }

  render(){
    var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //Pass the matrix to u_ModelMatrix
    // gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    // front face of cube
    drawTriangle3D( [0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0] );
    drawTriangle3D( [0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0] );

  }
} 