const canvasSketch = require('canvas-sketch');

import palettes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random';

// random.setSeed(3);
random.setSeed(6);

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const palette = random.pick(palettes);
  let angle = 0;
  let tick = 0;
  const balls = [];

  class Ball {
    constructor(angle) {
      this.x = 0;
      this.y = 0;
      this.angle = angle;
      this.color = random.pick(palette);
      this.radius = 15;
      this.dx = Math.cos(angle) / 2;
      this.dy = Math.sin(angle) / 2;
    }

    draw() {
      context.save();
      context.rotate(this.angle);
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.closePath();
      context.fill();
      context.restore();
    }

    render() {
      let radius = 300;
      if (this.x > radius || this.y > radius || this.x < -radius || this.y < -radius) {
        if (this.radius > 0.2) this.radius -= 0.5;
      }

      this.x += this.dx;
      this.y += this.dy;
      this.dx += 0.1;
      this.dy += 0.1;
      this.draw();
    }
  }

  const angles = [];
  for (let i = 0; i < 200; i++) {
    angles.push(((Math.PI * 2) / 200) * i);
  }

  return (props) => {
    ({ width, height } = props);

    angle += 0.01;
    tick++;

    if (balls.length < 300 && tick % 3 === 0) {
      balls.push(new Ball(random.pick(angles)));
    }
    console.log('balls', balls.length);

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.save(); 
    context.translate(width / 2, height / 2);
    balls.forEach((ball, i) => {
      let radius = 500;
      if (ball.x > radius || ball.y > radius || ball.x < -radius || ball.y < -radius) {
        balls.splice(i, 1, new Ball(random.pick(angles)));
      }
      ball.render();
    })
    context.restore();
  };
};

canvasSketch(sketch, settings);
