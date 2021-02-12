import canvasSketch from 'canvas-sketch';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, canvas }) => {
  const eyes = [];
  const eyesCount = 200;
  const mouse = {
    x: width / 2,
    y: height / 2
  }

  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  })

  class Eye {
    constructor({ x, y, radius }) {
      this.x = x;
      this.y = y;
      this.radius = radius;
    }

    draw() {
      // draw eye
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = 'red';
      context.closePath();
      context.fill();

      let x, y;

      // draw iris
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
      
      // draw pupil
      x = this.x + Math.cos(theta) * this.radius / 1.8;
      y = this.y + Math.sin(theta) * this.radius / 1.8;
      
      context.beginPath();
      context.arc(x, y, this.radius * 0.4, 0, Math.PI * 2);
      context.fillStyle = 'black';
      context.closePath();
      context.fill();
    }
  }


  function getEyes() {
    eyes.length = 0;
    const protection = 100000;
    let overlapping = false;
    let counter = 0;

    while(eyes.length < eyesCount && counter < protection) {
      overlapping = false;
      const eye = {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.floor(Math.random() * 100) + 5
      }
      
      for (let i = 0; i < eyes.length; i++) {
        const previousEye = eyes[i];
        const dx = eye.x - previousEye.x;
        const dy = eye.y - previousEye.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (eye.radius + previousEye.radius)) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        eyes.push(new Eye(eye))
      }

      counter++;
    }

  }
  getEyes();

  console.log(eyes.length);
  return {
    render(props) {
      ({ width, height } = props);
    
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);
    
      eyes.forEach(eye => {
        eye.draw();
      })
    },
    resize() {
      getEyes();
    }
  }
};

canvasSketch(sketch, settings);
