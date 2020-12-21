const canvasSketch = require("canvas-sketch");

const settings = { 
  dimensions: [1300, 1300],
};

const sketch = ({ context, width, height }) => {
  context.fillStyle = 'orange';
  context.fillRect(0, 0, width, height);

  context.beginPath();
  context.arc(width / 2, height / 2, 300, 0, Math.PI * 2);
  context.fillStyle = 'red';
  context.fill();
  context.lineWidth = 40;
  context.strokeStyle = 'blue';
  context.stroke();
};

canvasSketch(sketch, settings);
