const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  animate: true,
};
const sketch = () => {
  let context, width, height, widthHalf, heightHalf;
  const dots = [];

  class DrawCircle {
    constructor(x, y, radius = 2, color = 'rgba(0, 0, 0, 0.2)') {
      this.x = x;
      this.y = y;
      this.originalX = x;
      this.originalY = y;
      this.vx = 0;
      this.vy = 0;
      this.radius = radius;
      this.color = color;
      this.friction = 0.89;
      this.springFactor = 0.9;
      this.animateCount = 1;
    }

    draw() {
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.fill();
      context.restore();
    }

    animate() {
      if (this.animateCount % 100 === 0) {
        this.x += random.gaussian(-3, 2) * 5
        this.y += random.gaussian(-3, 2) * 5
        this.x -= random.gaussian(-3, 2) * 2
        this.y -= random.gaussian(-3, 2) * 5
      }
      this.animateCount++
      let dx = this.originalX - this.x;
      let dy = this.originalY - this.y;

      this.vx += dx * 0.1
      this.vy += dy * 0.1
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  function connectDots(dots) {
    for (let i = 0, l = dots.length; i <= l; i++) {
      let p0 = dots[i == l ? 0 : i];
      let p1 = dots[i + 1 >= l ? i + 1 - l : i + 1];

      context.quadraticCurveTo( p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    }
  }

  let points = [
    [0, -200],
    [17, -222],
    [39, -242],
    [65, -255],
    [90, -261],
    [120, -260],
    [150, -252],
    [177, -235],
    [197, -211],
    [210, -180],
    [212, -140],
    [208, -100],
    [192, -60],
    [161, -20],
    [121, 20],
    [74, 60],
    [35, 95],
    [0, 125],
    [-35, 95],
    [-74, 60],
    [-121, 20],
    [-161, -20],
    [-192, -60],
    [-208, -100],
    [-212, -140],
    [-210, -180],
    [-197, -211],
    [-177, -235],
    [-150, -252],
    [-120, -260],
    [-90, -261],
    [-65, -255],
    [-39, -242],
    [-17, -222],
  ];
  function getDots() {
    points.forEach(point => {
      dots.push(new DrawCircle(point[0], point[1]));
    })
  }

  function clearCanvas() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, width, height);
  }

  return (props) => {
    ({ height, width } = props);
    widthHalf = width / 2;
    heightHalf = height / 2;

    if (!context) {
      ({ context } = props);

      getDots();
    }

    clearCanvas();

    context.translate(widthHalf, heightHalf);
    context.save()
    context.beginPath()
    connectDots(dots);
    context.fillStyle = 'rgba(255, 0, 0, 1)';
    context.fill();
    context.restore()

    dots.forEach((dot) => {
      dot.animate()
      // dot.draw();
    });
  };
};

canvasSketch(sketch, settings);
