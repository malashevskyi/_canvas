import canvasSketch from 'canvas-sketch';
import palettes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random';

import * as dat from 'dat.gui';

// for not overlay the gui if fps is installed
setTimeout(() => {
  const fpsExtension = document.querySelector('.fps-extension')
  fpsExtension?.setAttribute('style', 'position: absolute; right: 220px; top: 0')
}, 1000)

const settings = {
  animate: true
};

random.setSeed(24)
// random.setSeed(1)
// random.setSeed(random.getRandomSeed())
// console.log('seed', random.getSeed());

const sketch = () => {
  const palette = random.pick(palettes)
  const opt = {
    draw: false
  }
  const balls = []
  const c = []; // cords, big circle
  const c2 = []; // cords, small circles

  let tick = 20;
  let context, width, height;

  class Ball {
    constructor(x, y) {
      this.anchorX = x;
      this.anchorY = y;
      this.x = x;
      this.y = y;
      this.color = random.pick(palette)
    }
    
    draw() {
      context.beginPath()
      context.arc(this.x, this.y, 20, 0, Math.PI * 2)
      context.fillStyle = this.color
      context.fill()
      context.closePath()
    }
    
    update(x, y) {
      this.x = x;
      this.y = y;
      this.draw()
    }
  }

  function drawPath(cords, slowDown = 1, reduceAxis = 1) {
    context.save()
    context.beginPath()
    if (cords !== c) { // if main cords (big circle)
      context.translate(c[Math.floor(tick / slowDown) % c.length].x / reduceAxis, c[Math.floor(tick / slowDown) % c.length].y / reduceAxis)
    }
    context.moveTo(cords[0].x, cords[0].y)
    cords.forEach((el) => {
      context.lineTo(el.x, el.y);
    })
    context.lineTo(cords[0].x, cords[0].y)
    context.lineWidth = 2
    context.stroke()
    context.closePath()
    context.restore()
  }

  function loadGui() {
    const gui = new dat.GUI();
    gui.width = 200
    gui.add(opt, 'draw').name('Draw Path')
  }

  return (props) => {
    ({width, height} = props)
    
    if (!context) {
      ({context} = props)
      
      for (let i = 0; i < 6; i++) {
        balls.push(new Ball(0, 0));
      }

      function createCords(count, radius, array, skew = 0) {
        const angle = Math.PI * 2 / count
        for(let i = 0; i < count; i++) {
          array.push({
            x: radius * Math.cos(angle * i),
            y: radius * Math.sin(angle * i + skew)
          })
        }
      }
      
      createCords(1000, 400, c);
      createCords(700, 100, c2, 0.4);

      loadGui();
    }
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, width, height);

    context.translate(width / 2, height / 2)

    if (opt.draw) {
      drawPath(c)
      drawPath(c2, 1.2)
      drawPath(c2, 1.7, 2.5)
    }
    
    tick += 1

    const cords = {
      bigCircle: [
        c[Math.floor(tick / 1.2) % c.length].x,
        c[Math.floor(tick / 1.2) % c.length].y,
      ],
      bigCircleInner1: [
        c2[Math.floor(tick) % c2.length].x,
        c2[Math.floor(tick) % c2.length].y,
      ],
      bigCircleInner2: [
        c2[Math.floor(tick + 350) % c2.length].x,
        c2[Math.floor(tick + 350) % c2.length].y
      ],
      smallCircle: [
        c[Math.floor(tick / 1.7) % c.length].x / 2.5,
        c[Math.floor(tick / 1.7) % c.length].y / 2.5,
      ],
      smallCircleInner: [
        c2[Math.floor(tick * 2) % c2.length].x,
        c2[Math.floor(tick * 2) % c2.length].y
      ]
    }

    balls[0].draw() // center of the big circle
    balls[1].update(...cords.bigCircle) // center of the first small circle, moves along the big circle 
    
    context.save()
    context.translate(...cords.bigCircle)
    balls[2].update(...cords.bigCircleInner1) // moves along the small circle
    balls[3].update(...cords.bigCircleInner2) // moves along the small circle
    context.fill()
    context.restore()
    
    context.save()
    context.translate(...cords.smallCircle)
    balls[4].draw() // center of the second small circle
    balls[5].update(...cords.smallCircleInner) // moves along the small circle
    context.fill()
    context.restore()
  };
};

canvasSketch(sketch, settings);