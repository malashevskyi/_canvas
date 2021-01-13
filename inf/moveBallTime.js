const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

random.setSeed(random.getRandomSeed());

const settings = {
  dimensions: [1400, 1400],
  animate: true,
  suffix: random.getSeed() // suffix for creating file
};

// console.log(random.getSeed());

const sketch = () => {
  const palette = random.shuffle(random.pick(palettes)) // slice with shuffle

  return ({ context, width, height, time }) => {

    const centerX = width / 2;
    const centerY = height / 2;

    context.clearRect(0, 0, width, height);
    console.log(time);
    context.beginPath();
    context.arc(centerX + 200 * Math.cos(time), centerY + 200 * Math.sin(time), 40, 0, Math.PI * 2)
    context.fillStyle = 'red'
    context.closePath();
    context.fill()
  };
};

canvasSketch(sketch, settings);