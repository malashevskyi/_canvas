import canvasSketch from 'canvas-sketch';
import { imageData } from './imageData';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  const particles = [];

  const mouse = {
    x: null,
    y: null,
    radius: 70,
  }

  canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  class Particle {
    constructor({ x, y, color }) {
      this.x = x;
      this.y = y;
      this.radius = 3;
      this.color = color;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 10) + 15;
    }

    draw() {
      context.fillStyle = this.color;
      context.beginPath();
      context.rect(this.x, this.y, 2.5, 2.5)
      context.lineWidth = 0;
      context.closePath();
      context.fill();
    }

    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }

  function getParticles() {
    /* multiply x and y if you want to make big image
    with visible pixels */
    const scale = 20;
    
    for (let i = 0; i < imageData.length; i++) {
      particles.push(new Particle({
        x: imageData[i][0] * scale - (32 * 20 / 2) + width / 2,
        y: imageData[i][1] * scale - (32 * 20 / 2) + height / 2,
        color: 'purple',
        /* set width and height to scale, if you scale it */
        width: scale,
        height: scale,
      }));
    }
  }
  getParticles();

  function connect() {
    let opacityValue = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        opacityValue = 0.1;
        context.strokeStyle = 'rgba(255, 255, 255, ' + opacityValue + ')';
        if (distance < 50) {
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y)
          context.stroke();
        }
      }
    }
  }

  return (props) => {
    ({ width, height } = props);

    context.fillRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.draw();
    })

    connect();
    
    context.beginPath();
    context.fillStyle = 'rgba(255, 255, 255, 0.03)';
    context.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2)
    context.fill();
  };
};

canvasSketch(sketch, settings);
