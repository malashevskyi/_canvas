import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import gsap from 'gsap';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {
  const mouse = {
    x: width / 2,
    y: height / 2,
  };
  const eyePosition = { x: 0, y: 0 };
  const opt = {
    mouthRadius: 20,
  };
  const smiles = [];

  canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  gsap.to(opt, {
    duration: 4,
    mouthRadius: 35,
    repeat: -1,
    yoyo: true,
    ease: 'bounce.inOut',
  });

  class Smile {
    constructor({ x, y }) {
      this.x = x;
      this.y = y;
    }

    draw() {
      // body
      context.beginPath();
      context.arc(this.x, this.y, 100, 0, Math.PI * 2);
      context.closePath();
      context.fillStyle = 'rgb(228, 167, 0)';
      context.fill();

      // eyes
      context.beginPath();
      context.arc( this.x - 30, this.y - 30, 20, 0, Math.PI * 2 );
      context.arc( this.x + 30, this.y - 30, 20, 0, Math.PI * 2 );
      context.closePath();
      context.fillStyle = 'white';
      context.fill();

      // pupils
      context.beginPath();
      context.arc( this.x - 38 + eyePosition.x, this.y - 38 + eyePosition.y, 10, 0, Math.PI * 2 );
      context.arc( this.x + 22 + eyePosition.x, this.y - 38 + eyePosition.y, 10, 0, Math.PI * 2 );
      context.closePath();
      context.fillStyle = 'black';
      context.fill();

      // mouth
      context.beginPath();
      context.moveTo( this.x - opt.mouthRadius, this.y + 30 );
      context.lineTo( this.x + opt.mouthRadius, this.y + 30 );
      context.lineTo( this.x + opt.mouthRadius, this.y + 30 + 5 );
      context.lineTo( this.x - opt.mouthRadius, this.y + 30 + 5 );
      context.fillStyle = 'black';
      context.fill();
    }
  }

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      smiles.push(
        new Smile({
          x: 210 * x + 100 + width / 2 - 315,
          y: 210 * y + 100 + height / 2 - 315
        })
      )
    }
  }
  return (props) => {
    ({ width, height } = props);

    context.fillStyle = 'rgba(10, 10, 10, 1)';
    context.fillRect(0, 0, width, height);
    // context.translate(width / 4, height / 4);
    // context.scale(0.5, 0.5)

    eyePosition.x = Math.floor(mouse.x / (width / 18));
    eyePosition.y = Math.floor(mouse.y / (height / 18));

    smiles.forEach(smile => {
      smile.draw();
    })
  };
};

canvasSketch(sketch, settings);
