const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {
  let tick = 0.3999;
  let tickC = 0.0000001;
  
  return (props) => {
    ({ width, height } = props);

    const radius = Math.max(width, height);

    context.fillStyle = "hsla(0, 0%, 0%, 1)";
    context.fillRect(0, 0, width, height);
    context.translate(width / 2, height / 2);

    for (let i = 0; i < 3000; i++) {
      context.fillStyle = 'yellow';
      context.beginPath();
      context.rect(
        Math.cos(i) * Math.sin(i / 2 * Math.sin(tick)) * radius,
        Math.sin(i) * Math.sin(i / 2 * Math.sin(tick)) * radius,
        2,
        2
      )
      context.fill();
    }

    tick += tickC;
    if (tick > 0.4 || tick < 0.3999) {
      tickC = -tickC;
    }
  };
};

canvasSketch(sketch, settings);
