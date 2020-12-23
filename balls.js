const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const canvasSketch = require('canvas-sketch');
const palette = random.pick(palettes);

const settings = {
  dimensions: [1200, 1200],
  animate: true,
};

const sketch = () => {
  const circles = [];
  let context;
  let width;
  let height;

  function inRange(axis, start, end) {
    return axis > start && axis < end;
  }

  function Circle(x, y, dx, dy, radius) {
    this.x = lerp(radius, width - radius, x);
    this.y = lerp(radius, height - radius, y);
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = random.pick(palette.slice(0, 3));

    this.draw = function () {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.fillStyle = this.color;
      context.fill();
    };
    this.update = function () {
      const r = this.radius;
      if (!inRange(this.x, r, width - r)) this.dx = -this.dx;
      if (!inRange(this.y, r, width - r)) this.dy = -this.dy;

      this.x += this.dx;
      this.y += this.dy;
    };
    this.animate = function () {
      this.draw();
      this.update();
    };
  }

  function createCircles() {
    for (let i = 0; i < 1000; i++) {
      circles.push(
        new Circle(
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
    if (circles.length === 0) {
      ({ context, width, height } = props);
      createCircles();
    }

    context.clearRect(0, 0, width, height);

    circles.forEach((circle) => circle.animate());
  };
};

canvasSketch(sketch, settings);
