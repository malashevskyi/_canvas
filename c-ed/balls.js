const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const canvasSketch = require('canvas-sketch');
// const palette = random.pick(palettes);

const settings = {
  dimensions: [290, 120],
  fps: 24,
  duration: 4,
  animate: true,
};
// random.setSeed(random.pick(['964335', '372336', '513468', '414867']))
random.setSeed(random.pick(['513468']))
const palette = random.pick(palettes);

const sketch = () => {
  const balls = [];
  const opt = {
    radiusInc: 0.7,
    ballsCount: 65,
  };

  let context, width, height;

  function inRange(axis, start, end) {
    return axis > start && axis < end;
  }

  function Ball(x, y, dx, dy, radius) {
    this.x = lerp(radius, width - radius, x);
    this.y = lerp(radius, height - radius, y);
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = random.pick(palette.slice(0, 3));

    this.draw = function () {
      context.beginPath();
      context.arc(
        this.x,
        this.y,
        this.radius * opt.radiusInc,
        0,
        Math.PI * 2,
        false
      );
      context.fillStyle = this.color;
      context.fill();
      context.closePath();
    };
    this.update = function () {
      const r = this.radius;
      if (!inRange(this.x, r, width - r)) this.dx = -this.dx;
      if (!inRange(this.y, r, height - r)) this.dy = -this.dy;

      this.x += this.dx;
      this.y += this.dy;
    };
    this.render = function () {
      this.draw();
      this.update();
    };
  }

  function createBalls() {
    for (let i = 0; i < opt.ballsCount; i++) {
      balls.push(
        new Ball(
          Math.random(),
          Math.random(),
          random.gaussian(0, 1) * 0.5,
          random.gaussian(0, 1) * 0.5,
          Math.abs(random.gaussian(0, 1)) * 14
        )
      );
    }
  }

  return (props) => {
    ({ width, height } = props);

    if (!context) {
      ({ context, width, height } = props);

      createBalls();
    }

    context.fillStyle = '#000';
    context.clearRect(0, 0, width, height);

    balls.forEach((ball) => ball.render());
  };
};

canvasSketch(sketch, settings);
