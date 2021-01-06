const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [580, 240],
  // fps: 24,
  // duration: 4,
  animate: true,
}

const sketch = () => {
  const particles = [];
  const mouse = { x: null, y: null };
  const count = 400;
  let canvasRectAlpha = 1;
  let intervalAlpha;
  let context;
  let width;
  let height;
  const gravity = 0.1;

  class Particle {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
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

    animate() {
      this.draw();
      this.velocity.x *= lerp(0.85, 1.03, Math.random());
      this.velocity.y *= lerp(0.85, 1.03, Math.random());
      this.velocity.y += gravity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 0.008;
    }
  }

  function addParticles(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.x = width * Math.random();
    mouse.y = height * Math.random();

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
          1,
          random.pick(palette), {
          x: Math.cos(angleIncrement * i) * Math.random() * power,
          y: Math.sin(angleIncrement * i) * Math.random() * power,
        })
      );
    }
  }

  return (props) => {
    if (!context) {
      ({ context, width, height } = props);
      context.canvas.addEventListener('click', addParticles);
    }
    context.fillStyle = `rgba(10, 10, 10, ${canvasRectAlpha})`;
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
