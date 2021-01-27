const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {
  let tick = 0.338;
  
  return (props) => {
    ({ width, height } = props);

    const maxSide = Math.max(width, height);

    context.fillStyle = "hsla(0, 0%, 0%, 1)";
    context.fillRect(0, 0, width, height);
    context.translate(width / 2, height / 2);

    let radius;
    for (let i = 0; i < 4000; i++) {
      radius = 400 * Math.sin(i * Math.sin(tick));
      context.fillStyle = `hsla(${ i + 12 }, 100%, 60%, 1)`;
      context.fillStyle = '#fff';
      context.beginPath();
      context.rect(
        Math.cos(i) * Math.sin(i * Math.sin(tick)) * maxSide,
        Math.sin(i) * Math.sin(i * Math.sin(tick)) * maxSide,
        2,
        2
      )
      context.fill();
    }

    tick += 0.000001;
  };
};

canvasSketch(sketch, settings);
