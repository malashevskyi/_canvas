const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true
};

const sketch = () => {
  let context;
  let canvas;
  let width;
  let height;

  let xPos = 0;
  let yPos = 0;
  let motionTrailLength = 10;
  let circles = Array(motionTrailLength).fill(' ');

  function storeLastPosition(xPos, yPos) {
    circles = [
      ...circles.slice(1),
      new DrawCircle(xPos, yPos)
    ];
  }
  class DrawCircle {
    constructor (x, y, r) {
      this.x = x;
      this.y = y;
      this.radius = 50
    }

    draw(ratio) {
      let radius = ratio
      if (ratio == "source") {
        ratio = 1;
      } else {
        ratio /= 4;
        radius *= 40;
      };
      context.save()
      context.beginPath();
      context.arc(this.x, this.y, 50 * radius, 0, 2 * Math.PI, true);
      context.fillStyle = "rgba(255, 255, 0, " + ratio + ")";
      context.fill();
      context.restore()
    }
  }

  function styleRect() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'rgba(255, 0, 0, .7)';
    context.fillRect(0, 0, width, height);
  }

  function mouseMoveHandler(e) {
    xPos = height / canvas.offsetHeight * e.offsetX;
    yPos = width / canvas.offsetWidth * e.offsetY;
  }
  function touchMoveHandler(e) {
    e.preventDefault();
    xPos = e.changedTouches[0].clientX;
    yPos = e.changedTouches[0].clientY;
  }
   
  return (props) => {
    ({height, width} = props);

    if (!context) {
      ({context, context: {canvas}} = props);

      canvas.addEventListener('mousemove', mouseMoveHandler)
      canvas.addEventListener('touchmove', touchMoveHandler)
    }
  
    styleRect();
 
    circles.forEach((circle, i) => {
      let ratio = (i + 1) / circles.length;
      circle.draw?.(ratio)
      
      if (i == 7) {
        context.save()
        context.beginPath()
        context.arc(circles[0].x, circles[0].y, 20, 0, Math.PI * 2)
        context.fillStyle = 'rgba(255, 55, 0, .2)'
        context.fill()
        context.restore()
      }
    })
  
    storeLastPosition(xPos, yPos);

    new DrawCircle(xPos, yPos).draw("source");
  };
};

canvasSketch(sketch, settings);