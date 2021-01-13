const canvasSketch = require('canvas-sketch');

import random from 'canvas-sketch-util/random'
import palettes from 'nice-color-palettes'

random.setSeed(2)

const palette = random.pick(palettes)

const settings = {
  // dimensions: [ 2048, 2048 ]
  animate: true,
};

const sketch = ({ context, width, height }) => {
  let x = 0;
  let x2 = 0;
  let tick = 0;
  const palette = [
    ...random.pick(palettes),
    ...random.pick(palettes),
    ...random.pick(palettes)
  ]
  // let offset = height / 2 - 130;

  return (props) => {
    if (props.width != width || props.height != height) {
      x = 5;
      x2 = -5;
    }
    ({ width, height } = props);

    tick++;

    context.fillStyle = 'white';
    let radius = 50;
    let amplitude = 30;

    let y = Math.sin((x + 47) / amplitude) * radius;
    
    // if (offset != 1) offset -= 0.5;
    
    let count = 15

    if (x < width / 2 - 5) {
      for (let i = 0; i < count; i++) {
        context.save();
          context.fillStyle = palette[i];
  
          // from center to the right
          let ofs = height / count * i - radius;
          
          context.save();
          context.translate(width / 2, 0);
          context.beginPath();
          context.moveTo(x, y + ofs);
          context.lineTo(x + width / 2, y + ofs);
          context.lineTo(x + width / 2, height + ofs);
          context.lineTo(x, height + ofs);
          context.fill();
          context.restore();
          // from center to the left
          context.save();
          context.translate(width / 2, 0);
          context.beginPath();
          context.moveTo(x2, y + ofs);
          context.lineTo(x2 - width / 2, y + ofs);
          context.lineTo(x2 - width / 2, height + ofs);
          context.lineTo(x2, height + ofs);
          context.fill();
          context.restore();
        context.restore();
      }
      if (tick > 40) {
        x += 1;
        x2 -= 1;
      }
    }
  };
};

canvasSketch(sketch, settings);
