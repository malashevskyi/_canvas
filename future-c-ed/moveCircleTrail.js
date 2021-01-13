const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')

const settings = {
  animate: true
};

const sketch = () => {
  let context, canvas, width, height;

  let xPos = 0;
  let yPos = 0;
  let motionTrailLength = 20;
  let circles = [];

  class DrawCircle {
    constructor (ratio, xPos, yPos) {
      this.x = xPos;
      this.y = yPos;
      this.ratio = ratio;
    }

    draw(ratio) {
      let radius = 50;

      if (ratio != 1) {
        ratio /= 4;
        radius = 220 * ratio;
      };

      context.beginPath();
      context.arc(this.x, this.y, radius, 0, 2 * Math.PI, true);
      context.fillStyle = "rgba(254, 231, 21, " + ratio + ")";
      context.fill();
    }
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

  function addCircle() {
    let lastCircle = new DrawCircle(1, xPos, yPos);
    circles.push(lastCircle);
    lastCircle.draw(1)
  }
  function removeFirstCircle() {
    if (circles.length > motionTrailLength) circles.shift()
  }
  function drawCircles() {
    circles.forEach((circle, i) => {
      let ratio = (i + 1) / circles.length;
      circle.draw(ratio)
    })
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#101820FF'
    context.fillRect(0, 0, width, height);
  }
  
  return (props) => {
    ({height, width} = props);
    
    if (!context) {
      ({context, context: {canvas}} = props);

      canvas.addEventListener('mousemove', mouseMoveHandler)
      canvas.addEventListener('touchmove', touchMoveHandler)
    }
    
    clearCanvas();

    drawCircles();
 
    addCircle();
    removeFirstCircle();
    
  };
};

canvasSketch(sketch, settings)
 