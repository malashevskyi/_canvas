import canvasSketch from 'canvas-sketch';
import gsap from 'gsap';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {
  const guns = [];
  const particles = [];
  const cartridges = [];
  const mouse = {
    x: width / 2,
    y: height / 2
  }
  let tick = 0;

  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  })

  class Cartridge {
    constructor({ x, y, dx, dy, angle }) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.angle = angle;
    }

    draw() {
      context.beginPath();
      context.save()
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.moveTo(0, 0)
      context.lineTo(0 + 20, 0)
      context.lineTo(0 + 20, 5)
      context.lineTo(0, 5)
      context.fillStyle = 'red';
      context.closePath();
      context.fill()
      context.restore()
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;
    }
  }

  class gun {
    constructor({ x, y, radius }) {
      this.x = x;
      this.y = y;
      this.radius = radius;
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = 'red';
      context.closePath();
      context.fill();

      let x, y;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const theta = Math.atan2(dy, dx);

      x = this.x + Math.cos(theta) * this.radius / 10;
      y = this.y + Math.sin(theta) * this.radius / 10;
      
      context.beginPath();
      context.arc(x, y, this.radius * 0.9, 0, Math.PI * 2);
      context.fillStyle = 'white';
      context.closePath();
      context.fill();
      
      x = this.x + Math.cos(theta) * this.radius / 1.8;
      y = this.y + Math.sin(theta) * this.radius / 1.8;
      
      context.beginPath();
      context.arc(x, y, this.radius * 0.4, 0, Math.PI * 2);
      context.fillStyle = 'black';
      context.closePath();
      context.fill();

      if (tick % 10 === 0) {
        cartridges.push(new Cartridge({
          x,
          y,
          dx: Math.cos(theta) * 10,
          dy: Math.sin(theta) * 10,
          angle: theta
        }))
      }
    }
  }

  class Particle {
    constructor({ x, y }) {
      this.x = x;
      this.y = y;
      this.radius = 20;
      this.color = '#fff';
      this.shot = false;
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.closePath();
      context.fill()
    }

    update() {
      this.y++;

      if (!this.shot) {

        cartridges.forEach(cartridge => {
          const dx = this.x - cartridge.x;
          const dy = this.y - cartridge.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < this.radius) {
            this.shot = true;
            cartridge.used = true;

            gsap.to(this, {
              radius: 30,
              duration: 0.3,
              ease: 'bounce.out'
            })
            gsap.to(this, {
              radius: 0,
              duration: 2,
              delay: 0.3,
              ease: 'bounce.in'
            })
            this.color = 'red';
          }
        })
      }
    }
  }


  function getGuns() {
    guns.length = 0;

    guns.push(new gun({
      x: 40,
      y: height - 130,
      radius: 80
    }));
    guns.push(new gun({
      x: width - 40,
      y: height - 130,
      radius: 80
    }));
  }
  getGuns();

  function getParticle() {
    particles.push(new Particle({
      x: Math.random() * (width - 400) + 200,
      y: -40
    }))
  }
  getParticle();
  
  return {
    render(props) {
      ({ width, height } = props);
      
      tick++;
      
      if (tick % 10 === 0) {
        getParticle();
      }
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);
    
      guns.forEach(gun => {
        gun.draw();
      })

      particles.forEach((particle, i) => {
        if (particle.y - 50 > height || particle.radius === 0) particles.splice(i, 1);
        particle.update();
        particle.draw();
      })
      cartridges.forEach((cartridge, i) => {
        if (cartridge.y < -10 || cartridge.used) cartridges.splice(i, 1);
        cartridge.update();
        cartridge.draw();
      })
    },
    resize() {
      getGuns();
    }
  }
};

canvasSketch(sketch, settings);
