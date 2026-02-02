// Cone.js
class Cone {
  constructor(segments = 24) {
    this.type = "cone";
    this.color = [1, 1, 1, 1];
    this.matrix = new Matrix4();

    this.segments = segments;
    this.radius = 0.5;
    this.height = 1.0;
  }

  render() {
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    const r = this.radius;
    const h = this.height;
    const tip = [0, h, 0];
    const center = [0, 0, 0];

    const step = (2 * Math.PI) / this.segments;

    for (let i = 0; i < this.segments; i++) {
      const a0 = i * step;
      const a1 = (i + 1) * step;

      const p0 = [r * Math.cos(a0), 0, r * Math.sin(a0)];
      const p1 = [r * Math.cos(a1), 0, r * Math.sin(a1)];

      drawTriangle3D([
        tip[0], tip[1], tip[2],
        p0[0],  p0[1],  p0[2],
        p1[0],  p1[1],  p1[2],
      ]);

      drawTriangle3D([
        center[0], center[1], center[2],
        p1[0],     p1[1],     p1[2],
        p0[0],     p0[1],     p0[2],
      ]);
    }
  }
}
