import canvasSketch from 'canvas-sketch';
import gsap from 'gsap';
import random from 'canvas-sketch-util/random';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {
  random.setSeed(4);

  const particles = [];

  const mouse = {
    x: 0,
    y: 0,
    radius: 50,
  }

  gsap.to(mouse, {
    duration: 2,
    radius: 390,
    repeat: -1,
    // delay: 1,
    repeatDelay: 0,
    yoyo: true,
    ease: 'power1.inOut'
  })

  // canvas.addEventListener('mousemove', (event) => {
  //   mouse.x = event.clientX;
  //   mouse.y = event.clientY;
  // })

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 40) + 5;
      this.color = `hsl(${this.radius * 3 + 170}, 50%, 50%)`;
    }
    
    draw() {
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      context.closePath();
      context.fill();
    }
    
    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        this.radiusTarget = Math.max((mouse.radius - distance) / 4.5, 3);
        this.color = `hsl(${this.radius * 2 + 170}, 50%, 50%)`;
      } else {
        this.radiusTarget = 0;
        this.color = `hsl(${this.radius * 2 + 170}, 50%, 50%)`;
      }

      if (this.radiusTarget - this.radius > 0) {
        this.radius += 0.4;
      }
      if (this.radiusTarget - this.radius < -0.4) {
        this.radius -= 0.4;
      }

      if (distance > mouse.radius + 150) {
        this.radius = 0
      }
      this.draw();
    }
  }

  function getParticles() {
    particles.length = 0;
    for (let i = 0; i < 1000; i++) {
      const [x, y] = random.insideCircle(400);
      particles.push(new Particle(x, y));
    }
  }
  getParticles();

  return (props) => {
    ({ width, height } = props);

    context.clearRect(0, 0, width, height);
    context.translate(width / 2, height / 2);

    particles.forEach(particle => {
      particle.update();
    })
  };
};

canvasSketch(sketch, settings);
