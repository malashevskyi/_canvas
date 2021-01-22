const canvasSketch = require('canvas-sketch');

import palettes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random';
import * as d3 from 'd3';

d3.select('head')
  .append('link')
  .attr('rel', 'stylesheet')
  .attr(
    'href',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap"'
  );

// random.setSeed(3);
random.setSeed(21);

const settings = {
  animate: true,
};

const names = [ 'HTML', 'CSS', 'JavaScript', 'Node', 'MySQL', 'Ajax', 'React', 'Webpack', 'Gulp', 'Photoshop', 'Figma', 'Canvas', 'GLSL', 'OpenGL', 'WebGL', 'Illustrator', 'GSAP', 'SVG', 'D3', 'Three.js' ]

const sketch = ({ context, width, height }) => {
  const palette = random.pick(palettes);
  let tick = 0;
  const balls = [];

  class Ball {
    constructor(angle, text) {
      this.angle = angle;
      this.color = random.pick(palette);
      this.text = text;
      this.initial();
    }
    
    initial() {
      this.tick = 0;
      this.x = 0;
      this.y = 0;
      this.dx = Math.cos(this.angle) / 2;
      this.dy = Math.sin(this.angle) / 2;
    }

    draw() {
      context.save();
      context.rotate(this.angle);
      context.beginPath();
      context.fillStyle = this.color;
      context.font = '48px Roboto';
      context.fillText(this.text, this.x, this.y);
      context.closePath();
      context.fill();
      context.restore();
    }

    render() {
      tick++;
      this.x += this.dx;
      this.y += this.dy;
      this.dx += 0.01;
      this.dy += 0.01;
      this.draw();
    }
  }

  const angles = [];
  for (let i = 0; i < 200; i++) {
    angles.push(((Math.PI * 2) / 200) * i);
  }

  return (props) => {
    ({ width, height } = props);

    tick++;

    if (balls.length < 300 && tick % 40 === 0) {
      balls.push(new Ball(random.pick(angles, tick % 10)));
    }

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.save(); 
    context.translate(width / 2, height / 2);
    balls.forEach((ball) => {
      if (ball.tick > 300) {
        balls.initial();
      }
      ball.render();
    })
    context.restore();
  };
};

canvasSketch(sketch, settings);
