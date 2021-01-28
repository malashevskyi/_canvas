import canvasSketch from 'canvas-sketch';
import { TweenMax, Power4 } from 'gsap';
import random from 'canvas-sketch-util/random';
import palettes from 'nice-color-palettes';

const settings = {
  animate: true,
};

const sketch = ({ context, canvas, width, height }) => {
  random.setSeed(33)
  const palette = random.pick(palettes);
  const points = [];
  let maxSide = Math.max(width, height);
  let tick = 0;

  class Square {
    constructor([x, y], color) {
      this.angle = random.range(0, Math.PI * 2);
      this.x = [Math.cos(this.angle) * maxSide / 3  + 150];
      this.y = [Math.sin(this.angle) * maxSide / 3  + 150];
      this.fx = x;
      this.fy = y;
      this.random = Math.random() * 2 + 0.5;
      this.tlx = TweenMax.from(this.x, { delay: this.random, ease: Power4.easeIn, yoyo: true, repeat: -1, repeatDelay: 0, duration: 7, 0: this.fx })
      this.tly = TweenMax.from(this.y, { delay: this.random, ease: Power4.easeIn, yoyo: true, repeat: -1, repeatDelay: 0, duration: 7, 0: this.fy })
      this.color = 'white';
      // this.color = random.pick(palette)
    }

    render() {
      context.beginPath();
      context.fillStyle = this.color;
      context.fillRect(this.x[0], this.y[0], 10, 10);
      context.closePath();
    }
  }

  for (let y = 0; y < 300; y += 9) {
    for (let x = 0; x < 300; x += 9) {
      points.push(new Square([x, y], random.pick(palette)))
    }
  }
  
  return (props) => {
    ({ width, height } = props);
    maxSide = Math.max(width, height);

    context.fillStyle = 'rgb(20, 20, 20)';
    context.fillRect(0, 0, width, height);
    context.translate(width / 2 - 150, height / 2 - 150);

    for (let i = 0; i < points.length; i++) {
      points[i].render();
    }

    tick++;
  };
};

canvasSketch(sketch, settings);
