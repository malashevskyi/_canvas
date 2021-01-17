import canvasSketch from 'canvas-sketch';
import { TimelineMax } from 'gsap';

import heartPoints from './heartPoints';
import trianglesPoints from './trianglesPoints';
import Dot from './Dot';
import Triangle from './Triangle';
import connectDots from './connectDots';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, time }) => {
  const triangles = [];
  const angle = (Math.PI * 2) / trianglesPoints.length;
  const radius = Math.max(width, height);
  const dots = [];

  const tl = new TimelineMax();
  const alpha = { val: 0 };
  tl.to(alpha, { delay: 6, duration: 1, val: 1 });

  function generateTriangles() {
    trianglesPoints.forEach((array, i) => {
      const radiusM = radius + (radius * 0.2) * Math.random();
      const rotateAngle = 70;

      triangles.push(
        new Triangle(
          context,
          array,
          Math.sin(angle * (i + rotateAngle)) * radiusM,
          Math.cos(angle * (i + rotateAngle)) * radiusM
        )
      );
    });
  }

  function getDots() {
    heartPoints.forEach((point) => {
      dots.push(new Dot(context, point[0], point[1]));
    });
  }

  function getHeart() {
    context.save();
    context.translate(width / 2, height / 2);
    context.beginPath();
    connectDots(context, dots);
    context.fillStyle = `rgba(255, 0, 0, ${alpha.val})`;
    context.fill();

    dots.forEach((dot) => {
      if (time > 5) {
        dot.animate();
      }
      // dot.draw();
    });
    context.restore();
  }

  function getTriangles() {
    context.save();
    context.translate(width / 2 - 283, height / 2 - 274);
    triangles.forEach((triangle) => {
      triangle.draw();
    });
    context.restore();
  }

  generateTriangles();
  getDots();

  return (props) => {
    ({ width, height, time } = props)

    context.clearRect(0, 0, width, height);

    getTriangles();
    getHeart();
  };
};

canvasSketch(sketch, settings);
