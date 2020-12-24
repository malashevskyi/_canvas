const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  animate: true,
};

const sketch = () => {
  const particles = [];
  const mouse = { x: null, y: null };
  const count = 200;
  let context;
  let width;
  let height;

  addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor(x, y, color, speed) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.speed = speed;
      this.alpha = 1;
    }

    draw() {
      context.globalAlpha = this.alpha;
      context.beginPath();
      context.rect(this.x, this.y, 10, 10);
      context.fillStyle = this.color;
      context.fill();
    }

    animate() {
      this.draw();
      this.x += this.speed.x;
      this.y += this.speed.y;
      this.alpha -= 0.008;
    }
  }

  function addParticles() {
    setTimeout(addParticles, 400);

    const angleIncrement = (Math.PI * 2) / count;

    const palette = random.pick(palettes).slice(0, 1);
    for (let i = 0; i < count; i++) {
      let inc = i % (count / 22);

      particles.push(
        new Particle(mouse.x, mouse.y, random.pick(palette), {
          x: Math.cos(angleIncrement * i) * inc,
          y: Math.sin(angleIncrement * i) * inc,
        })
      );
    }
  }

  return (props) => {
    if (!context) {
      ({ context } = props);
      addParticles();
    }

    ({ width, height } = props);

    context.fillStyle = `rgba(10, 10, 10, 1)`;
    context.fillRect(0, 0, width, height);

    particles.forEach((particle, i) => {
      if (particle.alpha > 0) {
        particle.animate();
      } else {
        particles.splice(i, 1);
      }
    });
  };
};

canvasSketch(sketch, settings);
