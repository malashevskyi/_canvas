import canvasSketch from 'canvas-sketch';
import getGui from '../utils/getGui';

const settings = {
  animate: true,
};
// inspired by https://codesandbox.io/s/proton-emitter-h2y9z?from-embed=&file=/package.json:222-235
const sketch = ({ context, width, height, time }) => {
  let color;
  let tick = 0;
  const balls = [];
  const opt = {
    curve: true
  }

  class Ball {
    constructor(angle) {
      this.angle = angle;
      this.color = color;
      this.tick = 0;
      this.x = 0;
      this.y = 0;
      this.m = 5;
      this.dx = Math.random() * this.m + 5;
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
      this.tick += 0.5;
      this.dy = opt.curve ? Math.sin(this.tick) * this.m : 1;
      this.x += this.dx;
      this.y = this.dy;
      this.draw();
    }
  }

  const angles = [];
  
  function getAngles() {
    angles.length = 0;
    for (let i = 0; i < 5; i++) {
      angles.push(((Math.PI / 2) / 100) * i + time);
    }
  }
  
  function getParticles() {
    for (let i = 0; i < 5; i++) {
      balls.push(new Ball(angles[i]));
    }
  }

  getGui((gui) => {
    gui.add(opt, 'curve').name('Curve')
  })

  return (props) => {
    ({ width, height, time } = props);

    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, width, height);

    tick += 5;
    color = `hsl(${tick}, 50%, 50%)`

    getAngles();
    getParticles();


    context.save(); 
    context.translate(width / 2, height / 2);
    balls.forEach((ball, i) => {
      if (ball.tick > 90) {
        balls.splice(i, 1)
      }
      ball.render();
    })
    context.restore();
  };
};

canvasSketch(sketch, settings);
