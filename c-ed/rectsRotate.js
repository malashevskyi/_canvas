import canvasSketch from 'canvas-sketch';
import gsap from 'gsap';

const settings = {
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const count = 20;
  const ys = Array(count).fill(0);
  const rot = Array(count).fill(0);
  const alpha = Array(count).fill(0);
  let tick = 0;

  for (let i = 0; i < count; i++) {
    
    // move from bottom and top to center
    gsap.from(ys, {
      duration: 2,
      delay: i / 2,
      [i]: i % 2 === 0 ? -height / 2 : height / 2,
      ease: 'power3.out'
    });

    // rotate
    gsap.to(rot, {
      duration: 2,
      delay: i / 2 + 12,
      [i]: Math.PI,
      repeat: -1,
      repeatDelay: 9,
      yoyo: true,
      ease: 'elastic.out'
    });

    // animate opacity
    gsap.to(alpha, {
      duration: 2,
      delay: i / 2 + 0.5,
      [i]: 1,
      ease: 'power3.out'
    });

  }

  function drawRect(i) {
    context.save();
    context.beginPath();
    context.globalAlpha = alpha[i];
    context.fillStyle = `hsl(${tick / 5 + i * 10}, 50%, 50%)`;
    context.translate(i * 43, ys[i])
    context.rotate(rot[rot.length - 1 - i])
    context.moveTo(0, 0);
    context.lineTo(40, 0);
    context.lineTo(40, -250);
    context.lineTo(0, -250);
    context.fill();
    context.closePath();
    context.restore();
  }

  return (props) => {
    ({ width, height } = props);

    tick++;

    context.clearRect(0, 0, width, height);
    context.translate(width / 2 - (43 * 20 / 2), height / 2 + 125);

    context.beginPath();

    for (let i = 0; i < count; i++) {
      drawRect(i);
    }
    
    context.closePath();
    
  };
};

canvasSketch(sketch, settings);
