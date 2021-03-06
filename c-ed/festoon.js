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

  const palette = random.pick(palettes)
  const TWO_PI = Math.PI * 2;
  const opt = {
    draw: true
  }
  const balls = []
  const c = []; // cords, big circle
  const c2 = []; // cords, small circles

  let tick = 0;

  class Ball {
    constructor(x, y) {
      this.anchorX = x;
      this.anchorY = y;
      this.x = x;
      this.y = y;
      this.color = random.pick(palette)
      this.dx = 1;
      this.dxI = 1;
      this.tick = 0;
      this.radius = 20;
    }
    
    draw() {
      context.beginPath()
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      context.fillStyle = this.color
      context.fill()
      context.closePath()
    }
    
    update(x, y) {
      this.x = x;
      this.y = y;
      this.draw()
    }
    update2() {
      this.dx += this.dxI
      if (this.dx % 50 === 0) {
        this.dxI = -this.dxI
      }

      this.x = this.dx;
      this.y = this.dx;
      this.draw()
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

  function loadGui() {
    const gui = new dat.GUI();
    gui.width = 200
    gui.add(opt, 'draw').name('Draw Path')
  }

  for (let i = 0; i <= 10; i++) {
    balls.push(new Ball(0, 0));
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
  
  createCords(1000, 400, c);
  createCords(700, 70, c2);

  loadGui();
  
  function clearCanvas() {
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, width, height);
    context.clearRect(0, 0, width, height)
  }
  
  const countCircles = 5;
  const circleParts = 2;
  
  return (props) => {
    ({width, height} = props)
    
    tick++
    
    // clearCanvas();
    
    context.translate(width / 2, height / 2)

    // if (opt.draw) {
    //   drawPath(c)
    // }

    balls[0].draw() // center of the big circle
    
    context.translate( // center of the small circle (moving)
      c[tick % c.length].x / 2,
      c[tick % c.length].y / 2
    )
    
    for (let i = 1; i <= 5; i++) {
      context.save()
      context.rotate((TWO_PI / circleParts) * (tick % circleParts) + (TWO_PI / countCircles) * i)
      balls[i].update2() // center of the first small circle, moves along the big circle 
      context.restore()
    }

    context.save()
      context.translate( // center of the small circle (moving)
        c[tick % c.length].x / 2.9,
        c[tick % c.length].y / 2.9
      )
      for (let i = 6; i <= 10; i++) {
        context.save()
        context.rotate((TWO_PI / circleParts) * (tick % circleParts) + (TWO_PI / countCircles) * i)
        balls[i].update2() // center of the first small circle, moves along the big circle 
        context.restore()
      }
    context.restore()

    context.save()
      context.translate( // center of the small circle (moving)
        c[tick % c.length].x / 1.5,
        c[tick % c.length].y / 1.5
      )
      for (let i = 6; i <= 10; i++) {
        context.save()
        context.rotate((TWO_PI / circleParts) * (tick % circleParts) + (TWO_PI / countCircles) * i)
        balls[i].update2() // center of the first small circle, moves along the big circle 
        context.restore()
      }
    context.restore()

  };
};

canvasSketch(sketch, settings);