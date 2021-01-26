const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {

  const points = [];
  let tick = 0;

  for (let y = 0; y < 200; y += 5) {
    for (let x = 0; x < 200; x += 5) {
      points.push([x, y])
    }
  }

  class Square {
    constructor([x, y]) {
      this.x = x;
      this.y = y;
    }

    render(clear) {
      context.beginPath();
      context.fillStyle = 'orange';
      if (clear) {
        context.clearRect(this.x - 1, this.y, 7, 6);
      } else {
        context.fillRect(this.x, this.y, 6, 6);
      }
      context.closePath();
    }
  }
  
  return (props) => {
    ({ width, height } = props);

    context.translate(width / 2 - 100, height / 2 - 100);

    if (tick > points.length - 1) {
      console.log(points.length, tick);
      const square = new Square(points[tick % points.length]);
      square.render(true);
      if (tick > points.length * 2) tick = -1;
    } else {
      const square = new Square(points[tick]);
      square.render();
    }

    tick++;
  };
};

canvasSketch(sketch, settings);
