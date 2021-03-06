const canvasSketch = require('canvas-sketch');
import palettes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random';

const settings = {
  // dimensions: [ 2048, 2048 ]
  animate: true,
};

// random.setSeed(1)
random.setSeed(17);

const sketch = ({ context, width, height }) => {
  const palette = random.pick(palettes);
  let angle = -Math.PI / 2;
  let dx, dy;
  let arrowX = 0;
  let arrowY = 0;
  const balls = [];
  let tick = 0;

  class Ball {
    constructor(cBool) {
      this.x = 0;
      this.y = angle;
      this.dx = 10;
      this.dy = angle;
      this.first = true;
      this.color = random.pick(palette);
      this.angle = angle;
      this.cBool = cBool;
    }

    draw() {
      context.save();
      context.rotate(this.angle);
      context.beginPath();
      context.rect(this.x, this.y - 8, 20, 20)
      context.fillStyle = this.color;
      context.closePath();
      context.fill();
      context.restore();
    }

    render() {
      if (this.cBool) {
        this.x -= this.dx;
      } else {
        this.x += this.dx;
      }

      this.draw();
    }
  }

  function drawArrow() {
    context.save();
    context.translate(arrowX, arrowY);
    context.rotate(angle);
    context.beginPath();
    context.rect(-40, -20, 80, 40);
    context.closePath();
    context.fillStyle = palette[4];
    context.fill();
    context.restore();
  }

  window.addEventListener('mousemove', (event) => {
    dx = event.clientX - arrowX;
    dy = event.clientY - arrowY;
    angle = Math.atan2(dy, dx);
  });

  let cBool = true;

  return (props) => {
    ({ width, height } = props);

    arrowX = width / 2;
    arrowY = height / 2;

    tick++;

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    if (tick % 2 === 0) {
      if (tick % 4 === 0) {
        cBool = false;
      } else {
        cBool = true;
      }
      balls.push(new Ball(cBool));
    }
    if (balls.length > 300) {
      balls.shift();
    }

    context.save();
    context.translate(arrowX, arrowY);
    balls.forEach((ball) => {
      ball.render();
    });
    context.restore();
    drawArrow();
  };
};

canvasSketch(sketch, settings);
