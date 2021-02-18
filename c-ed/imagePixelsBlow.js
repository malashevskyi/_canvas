import canvasSketch from 'canvas-sketch';

import random from 'canvas-sketch-util/random';
import gsap from 'gsap';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  const particles = [];

  const mouse = {
    x: width / 2,
    y: height / 2,
    radius: 300,
  }

  canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  })
  const screenRadius = Math.sqrt(width * width + height * height) / 2;
  let imageWidth = null;
  let imageHeight = null;


  class Particle {
    constructor({ x, y, index, color }) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.start = false;
      this.index = Math.floor(index * (Math.random() * 5));
      this.alpha = 1;
      this.tick = 0;
    }

    draw() {
      this.tick += 15;
      if (this.tick > this.index && !this.start) {
        this.start = true;
        gsap.to(this, {
          duration: 5,
          x: random.rangeFloor(400, 900),
          y: 500,
          ease: 'power4.in'
        })
        gsap.to(this, {
          duration: 1,
          alpha: 0,
          delay: 3.5,
          ease: 'linear'
        })
      }
      context.save()
      context.globalAlpha = this.alpha;
      context.beginPath();
      context.fillStyle = this.color;
      context.rect(this.x, this.y, 2, 2);
      context.closePath();
      context.fill();
      context.restore()
    }
  }
  
  const image = new Image();
  // image.src = '../images/instagram.png';
  image.src = '../images/support.png';

  image.onload = () => {

    imageWidth = image.width;
    imageHeight = image.height;

    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, image.width, image.height).data;
    
    let i = 0;
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        if (imageData[i + 3] > 1) {
          particles.push(new Particle({
            // x: Math.cos(i) * radius + 150,
            // y: Math.sin(i) * radius + 15,
            // xTo: x,
            // yTo: y,
            x: x * 2,
            y: y * 2,
            index: i,
            color: `rgba(${imageData[i]}, ${imageData[i + 1]}, ${imageData[i + 2]}, ${imageData[i + 3]})`
          } ));
          // particlesTo.push(new Particle({x: x, y: y, index: i}));
        }
        i += 4;
      }
    }
    console.log('imageData', imageData);
  }

  
  let tick = 0;

  // const randoms = []
  // for (let i = 0; i < 130; i++) {
  //   randoms.push(Math.floor(Math.random() * image.width));
  // }
  return (props) => {
    ({ width, height } = props);
    // context.clearRect(0, 0, width, height);
    if (imageWidth && imageHeight) {
      context.translate(width / 2 - imageWidth / 2 * 3, height / 2 - imageHeight / 2 * 3);
      context.fillStyle = 'white';
      context.fillRect(0, 0, 700, 500);
    }

    tick++;
    
    if (tick % 100 === 0) {
      console.log(particles.length);
    }



    // particles[random.rangeFloor(tick, tick + 50)].start = true;
    // particles[random.rangeFloor(tick, tick + 50)].start = true;
    // particles[random.rangeFloor(tick, tick + 50)].start = true;
    // for (let i = 0; i < randoms.length; i++) {
    //   if (randoms[i] < particles.length) {
    //     particles[randoms[i]].start = true;
    //     randoms[i]++;
    //   }
    // }
    particles.forEach((particle, i) => {
      if (particle.y >= 700) {
        particles.splice(i, 1);
      }
      particle.draw();
    })
  };
};

canvasSketch(sketch, settings);
