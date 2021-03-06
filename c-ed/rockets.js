import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import gsap from 'gsap';

const settings = {
  animate: true,
};

// https://codepen.io/osublake/pen/qNPBpJ?editors=0010

const sketch = ({ context, width, height, canvas }) => {

  const particles = [];
  const coordsCount = 200;
  const angle = Math.PI * 2 / coordsCount;
  const radius = 100;
  const HPi = Math.PI / 2;
  
  const mouse = {
    x: width / 2,
    y: height / 2,
  }

  canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  })

  class Particle {
    constructor({ index }) {
      this.x = 0;
      this.y = 0;
      this.color = `hsl(${index * 2 + 170}, 50%, 50%)`;
      // set random tick from 0 to coordsCount for random position on circle
      this.tick = Math.floor(Math.random() * coordsCount);
      this.mouseX = mouse.x;
      this.mouseY = mouse.y;
      this.random = 3 + Math.random() * 10;
      this.angleX = angle;
      this.angleY = angle;
      this.radius = 2;

      gsap.to(this, {
        duration: 4,
        radius: 7,
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 3,
        ease: 'power2.inOut'
      })
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math .PI * 2)
      context.fillStyle = this.color;
      context.fill()
    }

    update() {
      // check when particle goes through lowest this.tick (mouse position)
      // % from this.tick will be 0, 1, 2, or 3, as I add 4 every render
      if (this.tick % coordsCount === 0 || this.tick % coordsCount === 1 || this.tick % coordsCount === 2 || this.tick % coordsCount === 3) {
        
        // check if mouse position was changed
        if (mouse.x !== this.mouseX || mouse.y !== this.mouseY) {

          // change the angle (positive or negative)
          if (mouse.x - this.mouseX > 0) this.angleX = -this.angleX;
          if (mouse.y - this.mouseY > 0) this.angleY = -this.angleY;

          // find the distance between new and old mouse position
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          // add this.random to randomly change speed of the particle movement
          this.x += dx / dist * this.random;
          this.y += dy / dist * this.random;

          if (dist < 5) {
            this.x = mouse.x;
            this.y = mouse.y;
            // set current mouse position to compare later
            this.mouseX = mouse.x;
            this.mouseY = mouse.y;

            // set second lowest tick value to exit from if statement
            this.tick = random.rangeFloor(4, 8);
          }

          this.draw();

          // exit from update
          return;
        }
      }

      
      // circles (if mouse position doesn't change)
      // shift a circle with previous mouse position +- offset(radius)
      const offset = radius;
      if (this.tick % 4 === 3) {
        // left
        this.x = Math.cos(this.angleY * this.tick + HPi * 4) * radius + this.mouseX - offset;
        this.y = Math.sin(this.angleY * this.tick + HPi * 4) * radius + this.mouseY;
      } else if (this.tick % 4 === 2) {
        // right
        this.x = Math.cos(-this.angleY * this.tick - HPi * 2) * radius + this.mouseX + offset;
        this.y = Math.sin(-this.angleY * this.tick - HPi * 2) * radius + this.mouseY;
      } else if (this.tick % 4 === 1) {
        // top
        this.x = Math.cos(this.angleX * this.tick - HPi * 3) * radius + this.mouseX;
        this.y = Math.sin(this.angleX * this.tick - HPi * 3) * radius + this.mouseY - offset;
      } else if (this.tick % 4 === 0) {
        // bottom
        this.x = Math.cos(-this.angleX * this.tick + HPi * 3) * radius + this.mouseX;
        this.y = Math.sin(-this.angleX * this.tick + HPi * 3) * radius + this.mouseY + offset;
      }

      this.draw();
      this.tick += 4;
    }
  }
  
  function getParticles() {
    for (let i = 0; i < 40; i++) {
      particles.push(new Particle({ index: i }))
    }
  }
  getParticles();

  return (props) => {
    ({ width, height } = props);

    context.fillStyle = 'rgba(10, 10, 10, 1)';
    context.fillRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update();
    })
  };
};

canvasSketch(sketch, settings);
