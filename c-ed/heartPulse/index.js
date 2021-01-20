import canvasSketch from 'canvas-sketch';

import points from './points';
import connectDots from './connectDots';
import Dot from './Dot';

const settings = {
  animate: true,
};
const sketch = ({ context, width, height }) => {
  let widthHalf, heightHalf;
  const dots = [];

  function getDots() {
    points.forEach((point) => {
      dots.push(new Dot(context, point[0], point[1]));
    });
  }

  function clearCanvas() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, width, height);
  }

  function getHeart() {
    context.save();
    context.beginPath();
    connectDots(context, dots);
    context.fillStyle = 'rgba(255, 0, 0, 1)';
    context.fill();
    context.restore();
  }

  getDots();

  return (props) => {
    ({ height, width } = props);
    widthHalf = width / 2;
    heightHalf = height / 2;

    clearCanvas();

    context.translate(widthHalf, heightHalf);
    
    getHeart();

    dots.forEach((dot) => {
      dot.update();
      // dot.draw();
    });
  };
};

canvasSketch(sketch, settings);
