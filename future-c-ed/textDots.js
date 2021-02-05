import canvasSketch from 'canvas-sketch';
import gsap from 'gsap';
import random from 'canvas-sketch-util/random';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  let particles = [];

  const mouse = {
    x: 1000,
    y: 1000,
    radius: 70,
  }

  canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x - width / 2 + 210;
    mouse.y = event.y - height / 2 + 45;
  })

  context.fillStyle = 'white';
  context.font = '50px Verdana';
  context.fillText('CANVAS', 0, 37);
  context.fill()

  const textCoordinates = context.getImageData(0, 0, 210, 50);

  class Particle {
    constructor({ x, y }) {
      this.x = x;
      this.y = y;
      this.radius = 3;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 10) + 15;
      this.color = 'white';
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

      if (distance < mouse.radius + 5) {
        this.color = 'red';
      } else {
        this.color = 'white';
      }
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

  const particlesTo = [];

  function init() {
    particles = [];
    let i = 0;
    for (let y = 0; y < textCoordinates.height; y++) {
      for (let x = 0; x < textCoordinates.width; x++) {
        if (textCoordinates.data[i + 3] > 80) {
          particles.push(new Particle({
            x: Math.cos(i) * width + 210,
            y: Math.sin(i) * width + 45,
          } ));
          particlesTo.push(new Particle({x: x * 2, y: y * 2}));
        }
        i += 4;
      }
    }
  }
  init();

  particles.forEach((particle, i) => {
    gsap.to(particle, {
      duration: 5,
      ...particlesTo[i],
      delay: 'random(0, 3.5)'
    })
  })

  let alpha = 0.2;
  let tick = 0;

  return (props) => {
    ({ width, height } = props);

    tick++;

    context.fillStyle = `rgba(10, 10, 10, ${alpha})`
    context.fillRect(0, 0, width, height);

    if (tick > 400) {
      alpha += 0.01;
    }

    // context.strokeStyle = 'white';
    // context.strokeRect(0, 0, 500, 500);
    
    // context.save()
    // context.translate(width / 2, height / 2);
    // context.fillStyle = 'red'
    // context.rect(0, 0, 10, 10);
    // context.fill()
    // context.restore()
    context.save();
    context.translate(width / 2 - 210, height / 2 - 45);
    particles.forEach(particle => {
      particle.draw();
      particle.update();
    })
    
    context.beginPath();
    context.fillStyle = 'rgba(255, 255, 255, 0.03)';
    context.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2)
    context.fill();
    context.restore()

  };
};

canvasSketch(sketch, settings);
