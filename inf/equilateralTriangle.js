import canvasSketch from 'canvas-sketch';

const settings = {
  // animate: true,
};

const sketch = ({ context, width, height }) => {

  function drawEquilateralTriangle(length) {
    const lengthHalf = length / 2;
    const height = Math.sqrt(length * length - lengthHalf * lengthHalf);
  
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(length, 0);
    context.lineTo(length / 2, -height);
    context.closePath();
    context.stroke();
    context.fill();
  }

  return (props) => {
    ({ width, height } = props);

    context.translate(width / 2, height / 2)

    drawEquilateralTriangle(300);
  };
};

canvasSketch(sketch, settings);
