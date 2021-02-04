const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const branches = [];

  class DrawTree {
    constructor({ startX, startY, len, angle, branchWidth }) {
      this.startX = startX;
      this.startY = startY;
      this.len = len;
      this.angle = angle;
      this.branchWidth = branchWidth;
    }

    draw() {
      context.beginPath();
      context.save();
      context.lineWidth = this.branchWidth;
      context.translate(this.startX, this.startY);
      context.rotate((this.angle * Math.PI) / 180);
      context.moveTo(0, 0);
      context.lineTo(0, -this.len);
      context.stroke();
      if (this.len > 10) {
        branches.push(new DrawTree({
          startX: 0,
          startY: -this.len,
          len: this.len * 0.9,
          angle: this.angle + 6,
          branchWidth: this.branchWidth * 0.7
        }));
        branches[branches.length - 1].update();
        branches.push(new DrawTree({
          startX: 0,
          startY: -this.len,
          len: this.len * 0.9,
          angle: this.angle - 5,
          branchWidth: this.branchWidth * 0.7
        }));
        branches[branches.length - 1].update();
      }
      context.restore();
    }
    
    update() {
      this.draw();
    }
  }
  
  const tree = new DrawTree({
    startX: 0,
    startY: 0,
    len: 40,
    angle: 0,
    branchWidth: 5
  });
  context.translate(width / 2, height / 2 + 100);
  tree.update();

  return (props) => {
    ({ width, height } = props);
  };
};

canvasSketch(sketch, settings);
