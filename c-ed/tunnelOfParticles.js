const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const particles = [];
  const mouse = { x: null, y: null };
  const count = 50;
  let canvasRectAlpha = 0.2;

  addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor(x, y, radius, color, speed) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.speed = speed;
      this.alpha = 1;
    }

    draw() {
      context.save();
      context.globalAlpha = this.alpha;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.fill();
      context.restore();
    }

    render() {
      this.draw();
      this.x += this.speed.x;
      this.y += this.speed.y;
      this.alpha -= 0.008;
    }
  }

  function addParticles() {
    setTimeout(addParticles, 70)

    const power = 7;
    const angleIncrement = (Math.PI * 2) / count;

    const palette = random.pick(palettes).slice(0, 1);
    for (let i = 0; i < count; i++) {
      particles.push(
        new Particle(
          mouse.x,
          mouse.y,
          6,
          random.pick(palette),
          {
            x: Math.cos(angleIncrement * i) * power,
            y: Math.sin(angleIncrement * i) * power,
          }
        )
      );
    }
  }

  addParticles();

  return (props) => {
    ({ width, height } = props);

    context.fillStyle = `rgba(10, 10, 10, ${canvasRectAlpha})`;
    context.fillRect(0, 0, width, height);

    particles.forEach((particle, i) => {
      if (particle.alpha > 0) {
        particle.render();
      } else {
        particles.splice(i, 1);
      }
    });
  };
};

canvasSketch(sketch, settings);
