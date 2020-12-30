import canvasSketch from 'canvas-sketch';
import palettes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random';

const settings = {
  animate: true
};

random.setSeed(1)
// random.setSeed(24)
// random.setSeed(random.getRandomSeed())
// console.log('seed', random.getSeed());

const sketch = () => {
  let context, width, height;
  const palette = random.pick(palettes)

  class Ball {
    constructor(x, y) {
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
      this.x = x + y;
      this.y = y;
      this.draw()
    }
  }
  
  const balls = []
  const cords = [];
  let tick = 20;

  function drawPath() {
    context.beginPath()
    context.moveTo(cords[0].x, cords[0].y)
    cords.forEach((el) => {
      context.lineTo(el.x, el.y);
    })
    context.lineTo(cords[0].x, cords[0].y)
    context.lineWidth = 10
    context.stroke()
    context.closePath()
  }

  return (props) => {
    ({width, height} = props)
    
    if (!context) {
      ({context} = props)
      
      for (let i = 0; i < 7; i++) {
        balls.push(new Ball(0, 0));
      }
      
      const angle = Math.PI * 2 / 200
      for(let i = 0; i < 200; i++) {
        cords.push({
          x: 400 * Math.cos(angle * i),
          y: 400 * Math.sin(angle * i)
        })
      }
    }
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, width, height);
    
    
    context.translate(width / 2, height / 2)
    
    // drawPath();
    
    tick += 1
    balls[0].draw()
    balls[1].update(cords[Math.floor(tick / 1.2) % cords.length].x, cords[Math.floor(tick / 1.2) % cords.length].y)
    balls[2].update(cords[Math.floor(tick / 1.7) % cords.length].x, cords[Math.floor(tick / 1.7) % cords.length].y)
    balls[3].update(cords[Math.floor(tick / 1.4) % cords.length].x, cords[Math.floor(tick / 1.4) % cords.length].y)
    balls[4].update(cords[Math.floor(tick / 1.8) % cords.length].x / 2, cords[Math.floor(tick / 1.8) % cords.length].y / 2)
    balls[5].update(cords[Math.floor(tick / 1.5) % cords.length].x / 3, cords[Math.floor(tick / 1.5) % cords.length].y / 3)
    balls[6].update(cords[Math.floor(tick / 1.3) % cords.length].x / 1.3, cords[Math.floor(tick / 1.3) % cords.length].y / 1.3)
  };
};

canvasSketch(sketch, settings);
