const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [1400, 1400],
};


const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 50;
  
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push([u, v]);
      }
    }
    return points;
  };
  
  random.setSeed('ddd') 
  const points = createGrid().filter(() => random.value() > 0.6);
  const margin = 200;

  return ({ context, width, height }) => {
    points.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u); // margin + (width - margin * 2) * u
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, 5, 0, Math.PI * 2);
      context.strokeStyle = 'black';
      context.lineWidth = 4;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);