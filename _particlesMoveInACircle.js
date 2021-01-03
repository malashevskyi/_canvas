const canvasSketch = require('canvas-sketch');
const palettes = require('nice-color-palettes');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palette = random.pick(palettes);

const settings = {
  animate: true,
};

let mouseDown = false;
window.addEventListener('mousedown', () => {
  mouseDown = true;
});
window.addEventListener('mouseup', () => {
  mouseDown = false;
});

let radians = 0;
let alpha = 1;
const sketch = () => {
  const particles = [];
  let context;
  let width;
  let height;

  class Particle {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.shadowColor = this.color;
      context.shadowBlur = 10;
      context.fillStyle = this.color;
      context.fill();
      context.closePath();
    }
    animate() {
      this.draw();
    }
  }

  function getParticles(amount) {
    const maxSide = Math.min(width, height);
    for (let i = 0; i < amount; i++) {
      particles.push(
        new Particle(
          lerp(-maxSide / 2, maxSide, Math.random()),
          lerp(-maxSide / 2, maxSide, Math.random()),
          Math.random() * 3,
          random.pick(palette)
        )
      );
    }
  }
  return (props) => {
    ({ width, height } = props);
    if (!context) {
      ({ context } = props);
      getParticles(1000);
    }

    context.fillStyle = `rgba(10, 10, 10, ${alpha})`;
    context.fillRect(0, 0, width, height);

    if (alpha > 0.1) {
      if (mouseDown) {
        radians += 0.01;
        alpha -= 0.09;
      } else {
        radians += 0.003;
        alpha -= 0.03;
      }
    } else if (alpha < 1) {
      alpha += 0.2;
    }

    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(radians);
    particles.forEach((particle) => {
      particle.animate();
    });
    context.restore();
 
    context.fillRect(0, 0, width, height);

    context.globalCompositeOperation = 'destination-in';
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      Math.PI * 2
    );
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.fill();
    context.restore();
  };
};

canvasSketch(sketch, settings);
