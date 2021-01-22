import canvasSketch from 'canvas-sketch';

import trianglesPoints from './trianglesPoints';
import Triangle from './Triangle';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const angle = (Math.PI * 2) / trianglesPoints.length;
  const radius = Math.max(width, height);
  const triangles = [];

  trianglesPoints.forEach((array, i) => {
    const radiusM = radius + radius * 0.2 * Math.random();
    let a = 70;
    let last = i === trianglesPoints.length - 1;
    triangles.push(
      new Triangle(
        context,
        array,
        Math.sin(angle * (i + a)) * radiusM,
        Math.cos(angle * (i + a)) * radiusM,
        last
      )
    );
  });

  return ({ context, width, height, time }) => {
    context.clearRect(0, 0, width, height);

    context.save();
    context.translate(width / 2 - 283, height / 2 - 274);

    triangles.forEach((triangle) => {
      triangle.draw();
    });

    context.fill();
    context.restore();
  };
};

canvasSketch(sketch, settings);
