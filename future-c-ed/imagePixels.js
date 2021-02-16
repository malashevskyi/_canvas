import canvasSketch from 'canvas-sketch';

import random from 'canvas-sketch-util/random';
import gsap from 'gsap';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  const particles = [];
  const image = {
    width: 110,
    height: 110,
    radius: 50,
    lineWidth: 10,
  }
  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
  });

  class Particle {
    constructor({ xTo, yTo, x, y, index, color }) {
      this.x = x;
      this.y = y;
      this.xTo = xTo;
      this.yTo = yTo;
      this.color = color;
      this.start = false;
      this.index = index + random.rangeFloor(100, 2000);
      // this.index = index / 100;
      this.alpha = 1;
      this.tick = 0;
      this.width = 2;
      this.height = 2;
    }

    draw() {
      this.tick += 50;
      if (this.tick > this.index && !this.start) {
        this.start = true;
        gsap.to(this, {
          duration: 5,
          x: this.xTo,
          y: this.yTo,
          repeatDelay: 20,
          repeat: -1,
          yoyo: true,
          ease: 'power4.in',
        });
      }
      context.save()
      context.globalAlpha = this.alpha;
      context.beginPath();
      context.fillStyle = this.color;
      context.rect(this.x, this.y, this.width, this.height);
      context.closePath();
      context.fill();
      context.restore()
    }
  }

  const gradient = context.createLinearGradient(0, 0, 200, 0);
  gradient.addColorStop(0, "#FADD1D");
  gradient.addColorStop(0.15, "#FCB73A");
  gradient.addColorStop(0.3, "#FF8162");
  gradient.addColorStop(0.45, "#FF4C77");
  gradient.addColorStop(0.6, "#F1328A");
  gradient.addColorStop(0.75, "#C81C95");
  gradient.addColorStop(0.87, "#A91CA9");
  gradient.addColorStop(1, "#721CCC");

  context.beginPath();
  context.arc(image.radius + image.lineWidth / 2, image.radius + image.lineWidth / 2, image.radius, 0, Math.PI * 2)
  context.strokeStyle = gradient;
  context.lineWidth = 10;
  context.stroke()
  context.strokeStyle = 'white';

  const imageData = context.getImageData(0, 0, image.width, image.height).data;
  
  let i = 0;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (imageData[i + 3] && (imageData[i] < 255 || imageData[i + 1] < 255 || imageData[i + 2] < 255)) {
        const theta = Math.atan2(image.height / 2 - y, image.width / 2 - x);
        const radius = 100;
        const offsetY = 101;
        const offsetX = 101;

        const conf = {
          x: x * 2 + offsetX,
          y: y * 2 + offsetY,
          index: i,
          color: `rgba(${imageData[i]}, ${imageData[i + 1]}, ${imageData[i + 2]}, ${imageData[i + 3]})`
        }

        if (Math.cos(theta) <= 0 && Math.sin(theta) >= 0) {
          particles.push(new Particle({
            xTo: x * 2 + offsetX + radius,
            yTo: y * 2 + offsetY - radius,
            ...conf
          } ));
        } else if (Math.cos(theta) <= 0 && Math.sin(theta) < 0) {
          particles.push(new Particle({
            xTo: x * 2 + offsetX + radius,
            yTo: y * 2 + offsetY + radius,
            ...conf
          } ));
        } else if (Math.cos(theta) > 0 && Math.sin(theta) < 0) {
          particles.push(new Particle({
            xTo: x * 2 + offsetX - radius,
            yTo: y * 2 + offsetY + radius,
            ...conf
          } ));
        } else {
          particles.push(new Particle({
            xTo: x * 2 + offsetX - radius,
            yTo: y * 2 + offsetY - radius,
            ...conf
          } ));
        }
      }
      i += 4;
    }
  }
  
  let tick = 0;

  return (props) => {
    ({ width, height } = props);
    if (tick === 0) {
      context.clearRect(0, 0, width, height);
    }

    context.translate(width / 2 - 210, height / 2 - 210);
    // context.fillStyle = 'red';
    context.clearRect(0, 0, 422, 422);

    tick++;
    
    if (tick % 40 === 0) {
      console.log(particles.length);
    }

    particles.forEach((particle, i) => {
      if (particle.y >= 700) {
        particles.splice(i, 1);
      }
      particle.draw();
    })
  };
};

canvasSketch(sketch, settings);
