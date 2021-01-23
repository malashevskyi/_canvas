const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')

const settings = {
  animate: true
};

const sketch = ({ context, canvas, width, height }) => {
  const motionTrailLength = 20;
  let xPos = 0;
  let yPos = 0;
  let circles = [];
  class DrawCircle {
    constructor (xPos, yPos) {
      this.x = xPos;
      this.y = yPos;
    }

    draw(alpha) {
      let radius = 50;

      if (alpha !== 1) {
        alpha /= 4;
        radius = 220 * alpha;
      };

      context.beginPath();
      context.arc(this.x, this.y, radius, 0, 2 * Math.PI, true);
      context.fillStyle = "rgba(254, 231, 21, " + alpha + ")";
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
    let lastCircle = new DrawCircle(xPos, yPos);
    circles.push(lastCircle);
    lastCircle.draw(1)
  }
  function removeFirstCircle() {
    if (circles.length > motionTrailLength) circles.shift()
  }
  function drawCircles() {
    circles.forEach((circle, i) => {
      let alpha = (i + 1) / circles.length;
      circle.draw(alpha)
    })
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#101820FF'
    context.fillRect(0, 0, width, height);
  }
  
  canvas.addEventListener('mousemove', mouseMoveHandler)
  canvas.addEventListener('touchmove', touchMoveHandler)

  return (props) => {
    ({height, width} = props);
    
    clearCanvas();

    drawCircles();
 
    addCircle();
    removeFirstCircle();
    
  };
};

canvasSketch(sketch, settings)
 