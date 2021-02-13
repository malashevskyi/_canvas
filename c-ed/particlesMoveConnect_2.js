import canvasSketch from 'canvas-sketch';

import random from 'canvas-sketch-util/random'

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {

  let particles = [];

  const mouse = {
    x: width / 2,
    y: height / 2,
    radius: 300,
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
      this.tick = 1;
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

      this.baseX += this.dx2;
      this.baseY += this.dy2;

      if (this.baseX > width || this.baseX <= 0) this.dx2 = -this.dx2;
      if (this.baseY > height || this.baseY <= 0) this.dy2 = -this.dy2;

      if (distance < mouse.radius) {
        this.tick += 0.2;
        // this.color = 'rgba(255, 0, 255, 1)';

        this.x += dx / distance * 5 / this.tick;
        this.y += dy / distance * 5 / this.tick;
      } else if (this.x !== this.baseX || this.y !== this.baseY) {
        this.tick = 1;
        
        let dx = this.baseX - this.x;
        let dy = this.baseY - this.y;

        
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        this.x += dx / distance;
        this.y += dy / distance;
        // this.color = 'white';
        
        if (Math.abs(dx) < dx / distance) this.x = this.baseX;
        if (Math.abs(dy) < dx / distance) this.y = this.baseY;


        // if (this.x !== this.baseX) {
        //   let dx = this.x - this.baseX;
        //   this.x -= dx / 10;
        // }
        // if (this.y !== this.baseY) {
        //   let dy = this.y - this.baseY;
        //   this.y -= dy / 10;
        // }
      }

      this.draw();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(width * Math.random(), height * Math.random()));
    }
  }
  init();

  function connect() {
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

        if (distance2 < 155 || distance3 < 155 || distance < 85) {
          context.strokeStyle = 'rgba(255, 0, 255, 1)';
        } else {
          context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        }

        if (distance < 200 ) {
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y)
          context.stroke();
        }
      }
    }
  }

  let tick = 0;

  return (props) => {
    ({ width, height } = props);

    tick++;

    if (tick % 10 === 0) {
      mouse.x = Math.random() * width
      mouse.y = Math.random() * height
      // mouse.x = Math.abs((Math.random() - 0.5) * 300 + mouse.x % width)
      // mouse.y = Math.abs((Math.random() - 0.5) * 300 + mouse.y % height)
    }

    context.fillRect(0, 0, width, height);

    context.save();
    particles.forEach(particle => {
      particle.update();
    })

    connect();
  };
};

canvasSketch(sketch, settings);
