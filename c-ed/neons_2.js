const canvasSketch = require('canvas-sketch');
import getGui from '../utils/getGui';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, time }) => {
  let color;
  let tick = 0;
  const balls = [];
  const opt = {
    frequency: 20
  }

  class Ball {
    constructor(angle) {
      this.angle = angle;
      this.color = color;
      this.tick = 0;
      this.x = 0;
      this.y = 0;
      this.m = 10;
      this.dx = Math.random() * 2 + 2;
      this.dy = 1;
      this.dyInit = 1;
      this.radius = 10;
    }
    
    draw() {
      context.save();
      context.rotate(this.angle);
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      context.fillStyle = this.color;
      context.closePath();
      context.fill();
      context.restore();
    }
    
    render() {
      this.tick += 0.05;
      if (this.tick > 5 && this.radius > 0.2) {
        this.radius -= 0.02;
      }
      if (this.radius <= 0.2) this.radius = 0;

      this.dy += Math.sin(this.tick) * this.m;
      
      if (this.dy > 20 || this.dy < -20) {
        this.dyInit = -this.dyInit
      }
      this.x += this.dx;
      this.y = this.dy;
      this.draw();
    }
  }

  const angles = [];
  
  function getAngles() {
    angles.length = 0;
    for (let i = 0; i < 3; i++) {
      angles.push(((Math.PI / 2) / 100) * i + time);
    }
  }
  
  function getParticles() {
    for (let i = 0; i < 3; i++) {
      balls.push(new Ball(angles[i], color));
    }
  }

  getGui((gui) => {
    gui.add(opt, 'frequency').min(0).max(100).step(5).name('Frequency')
  })

  return (props) => {
    ({ width, height, time } = props);

    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, width, height);

    tick += 5;
    color = `hsl(${tick}, 50%, 50%)`

    if (tick % -(opt.frequency - 105) === 0) {
      getAngles();
      getParticles();
    }

    context.save(); 
    context.translate(width / 2, height / 2);
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].radius == 0) {
        balls.splice(i, 1)
      }
      balls[i].render();
    }
    context.restore();
  };
};

canvasSketch(sketch, settings);
