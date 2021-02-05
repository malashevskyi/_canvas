import canvasSketch from 'canvas-sketch';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  let particles = [];

  const mouse = {
    x: null,
    y: null,
    radius: 70,
  }

  canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x - width / 2 + 200;
    mouse.y = event.y - height / 2 + 155;
  })

  context.fillStyle = 'white';
  context.font = '30px Verdana';
  // context.fillText('CANVAS', 0, 37);
  context.fillText('V', 0, 22);
  context.fill()

  const textCoordinates = context.getImageData(0, 0, 210, 50);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 3;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 10) + 15;
    }

    draw() {
      context.fillStyle = 'white';
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

  function init() {
    particles = [];
    let i = 0;
    for (let y = 0; y < textCoordinates.height; y++) {
      for (let x = 0; x < textCoordinates.width; x++) {
        if (textCoordinates.data[i + 3] > 80) {
          particles.push(new Particle(x * 20, y * 20));
        }
        i += 4;
      }
    }
  }
  init();
  console.log(particles);

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
    
    context.save()
    context.translate(width / 2, height / 2);
    context.fillStyle = 'red'
    context.rect(0, 0, 10, 10);
    context.fill()
    context.restore()

    context.save();
    context.translate(width / 2 - 200, height / 2 - 155);
    particles.forEach(particle => {
      particle.draw();
      particle.update();
    })

    connect();
    
    context.beginPath();
    context.fillStyle = 'rgba(255, 255, 255, 0.03)';
    context.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2)
    context.fill();
    context.restore()

  };
};

canvasSketch(sketch, settings);
