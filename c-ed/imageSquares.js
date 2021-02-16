import canvasSketch from 'canvas-sketch';

import random from 'canvas-sketch-util/random';
import gsap from 'gsap';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  const image = new Image();
  image.src = '../images/road_mountains_peaks_168055_3415x3415.jpg';

  let drawImage;
  const squaresCount = 7;
  const squareWidth = 80;
  const squareHeight = 80;

  const opt = {
    offset: 0,
    offset2: 0
  }

  image.onload = () => {
    drawImage = () => {
      for (let x = 0; x < squaresCount; x++) {
        for (let y = 0; y < squaresCount; y++) {
          context.drawImage(
            image,
            image.width / squaresCount * x,
            image.height / squaresCount * y,
            image.width / squaresCount,
            image.height / squaresCount,
            (squareWidth + opt.offset) * x,
            (squareHeight + opt.offset) * y,
            squareWidth,
            squareHeight
          );
        }
      }
    }
  }

  gsap.to(opt, { duration: 2, offset: 20, repeat: -1, yoyo: true, ease: 'power4.in' });

  

  return (props) => {
    ({ width, height } = props);

    // context.clearRect(0, 0, width, height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(
      width / 2 - (squaresCount * squareWidth / 2) - (squaresCount * opt.offset / 2),
      height / 2 - (squaresCount * squareHeight / 2) - (squaresCount * opt.offset / 2)
    );

    if (drawImage) {
      drawImage();
    }
  };
};

canvasSketch(sketch, settings);
