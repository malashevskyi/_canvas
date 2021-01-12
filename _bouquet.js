import canvasSketch from 'canvas-sketch';
import palettes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random';

import * as dat from 'dat.gui';

// setTimeout(() => {
  // const fpsExtension = document.querySelector('.fps-extension')
  // fpsExtension?.setAttribute('style', 'position: absolute; right: 220px; top: 0')
// }, 1000)

const settings = {
  animate: true
};

const sketch = ({ context, width, height }) => {
  random.setSeed(24)
  random.setSeed(38)
  random.setSeed(68)
  random.setSeed(77)

  const palette = random.pick(palettes)
  const TWO_PI = Math.PI * 2;
  const balls = []
  const c = [];

  let tick = 0;

  class Ball {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.color = random.pick(palette)
      this.dx = 1;
      this.radius = 20;
      this.tick = 0;
    }
    
    draw() {
      context.beginPath()
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      context.fillStyle = this.color
      context.fill()
      context.closePath()
    }
  
    update() {
      if (this.tick > 45 && this.radius > 0.5) {
        this.radius -= 0.5
      }

      this.tick++

      this.x += this.dx;
      this.y += this.dx;
      this.draw()
    }
  }

  for (let i = 0; i <= 30; i++) {
    balls.push(new Ball());
  }

  function createCords(count, radius, array) {
    const angle = Math.PI * 2 / count
    for(let i = 0; i < count; i++) {
      array.push({
        x: radius * Math.cos(angle * i),
        y: radius * Math.sin(angle * i)
      })
    }
  }
  
  createCords(450, 200, c);
  
  const countCircles = 9;
  const circleParts = 2;
  
  return (props) => {
    ({width, height} = props)
    
    tick++

    context.translate(width / 2, height / 2)

    if (tick < 100) {

      context.save()
        context.rotate(tick)
        context.translate(
          c[tick % c.length].x + 30,
          c[tick % c.length].y - 0
        )

        for (let i = 25; i <= 30; i++) {
          context.save()
          context.rotate((TWO_PI / circleParts) * (tick % circleParts) + (TWO_PI / countCircles) * i)
          balls[i].update()
          context.restore()
        }
      context.restore()

      for (let i = 0; i < 4; i++) {
        context.save()
          context.rotate(Math.PI / 2 * i)
          context.translate(
            c[tick % c.length].x - 170,
            c[tick % c.length].y - 0
          )
  
          for (let j = 0; j <= 5; j++) {
              context.save()
              context.rotate((TWO_PI / circleParts) * (tick % circleParts) + (TWO_PI / countCircles) * (i * 6 + j))
              balls[i * 6 + j].update()
              context.restore()
            }
        context.restore()
      }
    }

  };
};

canvasSketch(sketch, settings);