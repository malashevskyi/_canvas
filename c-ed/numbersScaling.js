const canvasSketch = require('canvas-sketch');

import palettes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random';
import * as d3 from 'd3';

d3.select('head')
  .append('link')
  .attr('rel', 'stylesheet')
  .attr(
    'href',
    'https://fonts.googleapis.com/css2?family=Potta+One&display=swap'
  );

random.setSeed(3);

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const palette = random.pick(palettes);
  let tick = 0;
  const numbs = [];

  class Numb {
    constructor() {
      this.gaussian = random.gaussian(-0.2, 0.2) + 0.3;
      this.color = random.pick(palette);
      this.text = random.pick([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ]);
      this.initial();
    }

    initial() {
      this.x = this.gaussian;
      this.y = 0;
      this.dx = this.gaussian;
      this.dy = 0.5;
      this.tick = 0;
      this.scale = 1;
    }

    draw() {
      context.save();
      context.beginPath();
      context.scale(this.scale, this.scale);
      context.fillStyle = this.color;
      context.font = `10px Potta One`;
      context.fillText(this.text, this.x, this.y);
      context.closePath();
      context.fill();
      context.restore();
    }

    render() {
      this.scale += 0.05;
      this.tick++;
      this.x -= this.dx;
      this.y -= this.dy;
      this.dx /= 1.01;
      this.draw();
    }
  }

  return (props) => {
    ({ width, height } = props);
    tick++;

    if (numbs.length < 50 && tick % 10 === 0) {
      numbs.push(new Numb());
    }

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(width / 2, height - 50);

    numbs.forEach((numb, i) => {
      if (numb.tick > 300) {
        numb.initial();
      }
      numb.render();
    });
    context.restore();
  };
};

canvasSketch(sketch, settings);
