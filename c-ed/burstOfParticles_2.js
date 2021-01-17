const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const settings = {
  animate: true,
};

const sketch = ({ context, width, height}) => {
  const particles = [];
  const mouse = { x: null, y: null };
  const count = 400;
  let canvasRectAlpha = 1;
  let intervalAlpha;
  const gravity = 0.1;

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
      this.speed.x *= lerp(0.65, 1.25, Math.random());
      this.speed.y *= lerp(0.85, 1.25, Math.random());
      this.speed.y += gravity;
      this.x += this.speed.x;
      this.y += this.speed.y;
      this.alpha -= 0.01;
    }
  }

  function addParticles(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    clearInterval(intervalAlpha);
    let startClearRect = 0;
    canvasRectAlpha = 0.2;
    intervalAlpha = setInterval(() => {
      startClearRect++;
      if (startClearRect > 200) {
        canvasRectAlpha += 0.009;
      }
      if (canvasRectAlpha >= 1) {
        clearInterval(intervalAlpha);
      }
    });

    const power = 20;
    const angleIncrement = (Math.PI * 2) / count;

    const palette = random.pick(palettes).slice(0, 3);
    for (let i = 0; i < count; i++) {
      particles.push(
        new Particle(
          mouse.x,
          mouse.y,
          3,
          random.pick(palette), {
          x: Math.cos(angleIncrement * i) * Math.random() * power,
          y: Math.sin(angleIncrement * i) * Math.random() * power,
        })
      );
    }
  }

  context.canvas.addEventListener('click', addParticles);

  return (props) => {
    ({ context, width, height } = props);

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
