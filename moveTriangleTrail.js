const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  animate: true,
};

const sketch = () => {
  const mouse = {
    x: null,
    y: null,
  };
  let context, canvas, width, height;
  let shadowBlur = 0;
  let alpha = 0;

  function drawTriangle(x, y) {
    context.beginPath();
    context.fillStyle = 'yellow';
    context.globalAlpha = alpha;

    context.translate(x, y);
    context.rotate(random.range(0, Math.PI * 2));
    context.moveTo(0, 0);
    context.lineTo(50, -25);
    context.lineTo(50, 25);
    context.shadowColor = 'yellow';
    context.shadowBlur = shadowBlur;
    context.fill();
  }

  function checkMouseMove(newX, newY) {
    if (
      alpha < 1 &&
      (newX > mouse.x + 2 ||
        newY > mouse.y + 2 ||
        newX < mouse.x - 2 ||
        newY < mouse.y - 2)
    ) return true;
    return false;
  }

  function mouseMoveHandler(e) {
    let x = (height / canvas.offsetHeight) * e.offsetX;
    let y = (width / canvas.offsetWidth) * e.offsetY;
    checkMouseMove(x, y) && (alpha += 0.1)
    if (shadowBlur < 40) shadowBlur += 4;
    mouse.x = x;
    mouse.y = y;
  }
  function touchMoveHandler(e) {
    e.preventDefault();
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    checkMouseMove(x, y) && (alpha += 0.1)
    if (shadowBlur < 40) shadowBlur += 4;
    mouse.x = x;
    mouse.y = y;
  }

  return (props) => {
    ({ height, width } = props);

    if (!context) {
      ({ context, context: { canvas }, } = props);

      canvas.addEventListener('mousemove', mouseMoveHandler);
      canvas.addEventListener('touchmove', touchMoveHandler);
      canvas.addEventListener('touchend', () => alpha = 0);
    }

    context.fillStyle = 'rgba(0, 0, 0, .1)';
    context.fillRect(0, 0, width, height);

    // triangles disappear if mouse not move 
    if (alpha > 0.1) alpha -= 0.1;

    // make shadowBlur 0 if mouse not move
    if (shadowBlur >= 3) shadowBlur -= 3;

    drawTriangle(mouse.x, mouse.y);
  };
};

canvasSketch(sketch, settings);
