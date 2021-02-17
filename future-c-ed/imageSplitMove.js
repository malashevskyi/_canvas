import canvasSketch from 'canvas-sketch';

import random from 'canvas-sketch-util/random';
import gsap from 'gsap';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  let particles = [];

  // const mouse = {
  //   x: width / 2,
  //   y: height / 2,
  //   radius: 300,
  // }

  // canvas.addEventListener('mousemove', (event) => {
  //   mouse.x = event.x;
  //   mouse.y = event.y;
  // })
  let squaresCount = 30;
  let squareWidth = 20;
  let squareHeight = 20;
  let screenRadius = Math.sqrt(width * width + height * height) / 2;

  class Particle {
    constructor({ uX, uY }) {
      this.uX = uX;
      this.uY = uY;
      this.x = (Math.random() - 0.5) * screenRadius;
      this.y = (Math.random() - 0.5) * screenRadius;
      this.random = random.gaussian();
      this.gsap = false;
    }

    draw() {
      context.drawImage(
        image,
        image.width / squaresCount * this.uX,
        image.height / squaresCount * this.uY,
        image.width / squaresCount,
        image.height / squaresCount,
        (squareWidth + opt.offset) * this.uX + this.x,
        (squareHeight + opt.offset) * this.uY + this.y,
        squareWidth,
        squareHeight
      );
    }

    update() {
      if (!this.gsap) {
        this.gsap = true;
        gsap.to(this, {
          x: 0,
          y: 0,
          duration: 5,
          repeatDelay: 1,
          delay: 1,
          repeat: -1,
          yoyo: true,
          rebers: true,
          ease: 'power1.inOut'
        })
      }
      // this.x += this.random;
      // this.y += this.random;
      this.draw();
    }
  }
  
  const image = new Image();
  image.src = '../images/road_mountains_peaks_168055_3415x3415.jpg';


  const opt = {
    offset: 0,
    offset2: 0
  }

  image.onload = () => {
    for (let uX = 0; uX < squaresCount; uX++) {
      for (let uY = 0; uY < squaresCount; uY++) {
        particles.push(new Particle({
          uX,
          uY
        }))
      }
    }
  }

  // gsap.to(opt, { duration: 2, offset: 20, repeat: -1, yoyo: true, ease: 'power4.in' });

  

  return (props) => {
    ({ width, height } = props);

    // context.clearRect(0, 0, width, height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(
      width / 2 - (squaresCount * squareWidth / 2) - (squaresCount * opt.offset / 2),
      height / 2 - (squaresCount * squareHeight / 2) - (squaresCount * opt.offset / 2)
    );

    if (particles.length !== 0) {
      particles.forEach(particle => {
        particle.update()
      })
    }
  };
};

canvasSketch(sketch, settings);
