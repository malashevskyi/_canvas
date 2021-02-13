import canvasSketch from 'canvas-sketch';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  let particles = [];

  const mouse = {
    x: null,
    y: null,
    radius: 200,
  }

  canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  })

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 3;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 10) + 15;
      this.color = 'white';
      this.dx2 = Math.random() - 0.5;
      this.dy2 = Math.random() - 0.5;
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

      this.baseX += this.dx2;
      this.baseY += this.dy2;

      if (this.baseX > width || this.baseX <= 0) this.dx2 = -this.dx2;
      if (this.baseY > height || this.baseY) this.dy2 = -this.dy2;

      if (distance < mouse.radius) {
        this.color = 'rgba(255, 0, 255, 1)';
        this.x -= directionX;
        this.y -= directionY;
      } else {
        this.color = 'white';
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }

      this.draw();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < 400; i++) {
      particles.push(new Particle(width * Math.random(), height * Math.random()));
    }
  }
  init();
  // console.log(particles);

  function connect() {
    let opacityValue = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let dx2 = mouse.x - particles[i].x;
        let dy2 = mouse.y - particles[i].y;
        let distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        let dx3 = mouse.x - particles[j].x;
        let dy3 = mouse.y - particles[j].y;
        let distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

        opacityValue = 0.1;
        if (distance2 < 155 || distance3 < 155 || distance < 55) {
          context.strokeStyle = 'rgba(255, 0, 255, 1)';
        } else {
          context.strokeStyle = 'rgba(255, 255, 255, ' + opacityValue + ')';
        }
        
        if (distance < 95) {
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

    context.save();
    particles.forEach(particle => {
      particle.update();
    })

    connect();
    
    context.beginPath();
    context.fillStyle = 'rgba(255, 0, 255, 1)';
    context.arc(mouse.x, mouse.y, mouse.radius / 2, 0, Math.PI * 2)
    context.fill();
    context.restore()

  };
};

canvasSketch(sketch, settings);
