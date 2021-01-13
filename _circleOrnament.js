import canvasSketch from 'canvas-sketch';
import palettes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random';

import * as dat from 'dat.gui';

// for not overlay the gui if fps is installed
setTimeout(() => {
  const fpsExtension = document.querySelector(
    '.fps-extension'
  );
  fpsExtension?.setAttribute(
    'style',
    'position: absolute; right: 220px; top: 0'
  );
}, 1000);

const settings = {
  animate: true,
};

random.setSeed(24);

const sketch = ({ context, width, height }) => {
  const palette = random.pick(palettes);
  const opt = {
    draw: true,
    amplitude: 10,
  };
  const balls = [];
  const c = []; // cords, big circle

  let tick = 0;

  class Ball {
    constructor(x, y) {
      this.anchorX = x;
      this.anchorY = y;
      this.x = x;
      this.y = y;
      this.dx = 1;
      this.dxI = 1;
      this.color = random.pick(palette);
      this.radius = 5;
    }

    draw() {
      context.beginPath();
      context.arc(
        this.x,
        this.y,
        this.radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = this.color;
      context.fill();
      context.closePath();
    }

    update(r, x = 0, y = 0) {
      this.dx += this.dxI;
      if (this.dx % opt.amplitude === 0) {
        this.dxI = -this.dxI;
      }

      this.radius = 5 / (r - 0.5);

      this.x = x + this.dx;
      this.y = y + this.dx;
      this.draw();
    }
  }

  // function drawPath(cords, slowDown = 1, reduceAxis = 1) {
  //   context.save()
  //   context.beginPath()
  //   if (cords !== c) {
  //     context.translate(c[Math.floor(tick / slowDown) % c.length].x / reduceAxis, c[Math.floor(tick / slowDown) % c.length].y / reduceAxis)
  //   }
  //   context.moveTo(cords[0].x, cords[0].y)
  //   cords.forEach((el) => {
  //     context.lineTo(el.x, el.y);
  //   })
  //   context.lineTo(cords[0].x, cords[0].y)
  //   context.lineWidth = 2
  //   context.stroke()
  //   context.closePath()
  //   context.restore()
  // }

  for (let i = 0; i < 41; i++) {
    balls.push(new Ball(0, 0));
  }

  function createCords(count, radius, array, skew = 0) {
    const angle = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      array.push({
        x: radius * Math.cos(angle * i),
        y: radius * Math.sin(angle * i + skew),
      });
    }
  }

  createCords(1000, 300, c);

  return {
    render (props) {
     ({ width, height } = props);
 
     context.fillStyle = 'rgba(255, 255, 255, 1)';
     // context.fillRect(0, 0, width, height);
 
     context.translate(width / 2, height / 2);
 
     // if (opt.draw) {
     // drawPath(c)
     // drawPath(c2, 1.2)
     // drawPath(c2, 1.7, 2.5)
     // }
 
     tick += 1;
 
     // balls[0].draw() // center
     let d = [ 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.3, 3.5, 3.7, 3.9, 4.1, 4.3, 4.9, 5.4, 5.8, 6.1, 6.3, 6.5, 6.7, 6.9, 7.1, 7.5, 7.9, 8.8, 13, 18, ];
     for (let i = 1; i <= 40; i++) {
       if (!c[Math.floor(tick / 1.2)]) continue;
       context.save();
       context.translate(
         c[Math.floor(tick / 1.2) % c.length].x / d[i],
         c[Math.floor(tick / 1.2) % c.length].y / d[i]
       );
       context.rotate(
         ((Math.PI * 2) / 1200) * ((tick - 20) % 1200) + 2.5
       );
       balls[i].update(d[i]);
       context.restore();
     }
   },
   resize() {
     tick = 0;
   }
  }
};

canvasSketch(sketch, settings);
