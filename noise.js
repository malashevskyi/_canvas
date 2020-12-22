const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [1400, 1400],
};

const sketch = () => {
  // const palette = random.pick(palettes).slice(0, 3)
  const palette = ["#046d8b", "#309292", "#2fb8ac"]
  console.log(palette);

  const createGrid = () => {
    const points = [];
    const count = 50;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push({
          color: random.pick(palette),
          radius: Math.abs(random.noise2D(u, v) * 0.2),
          rotate: random.noise2D(u, v),
          // radius: Math.abs(random.gaussian(0, 2) * 0.004),
          position: [u, v],
        });
      }
    }
    return points;
  };
  // random.setSeed('dd3');
  const points = createGrid().filter(() => random.value() > 0.6);
  const margin = 200;

  return ({ context, width, height }) => {
    points.forEach((data) => {
      const { radius, position, rotate, color } = data;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u); // margin + (width - margin * 2) * u
      const y = lerp(margin, height - margin, v);
      
      context.save()
      context.fillStyle = color;
      context.font = `${radius * width}px  "Helvetica"`
      context.translate(x, y)
      context.rotate(rotate)
      context.fillText('*', 0, 0)
      context.restore()
    });
  };
};

canvasSketch(sketch, settings);