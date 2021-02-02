const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes')
import * as d3 from 'd3';

d3.select('head')
  .append('link')
  .attr('rel', 'stylesheet')
  .attr(
    'href',
    'https://fonts.googleapis.com/css2?family=Potta+One&display=swap'
  );

const settings = {
  animate: true,
};

const sketch = ({ context, width, height, time }) => {
  random.setSeed(17)
  const palette = [
    ...random.pick(palettes),
    ...random.pick(palettes),
    ...random.pick(palettes)
  ]
  let startAngle = 0;

  const opt = {
    count: 15,
    offset: 4,
    radius: 140,
    waveOffset: 30,
  }
  const circles = [];
  const smooth = [
    ...math.linspace(80, 0, 1),
    ...Array(200).fill(1),
    ...math.linspace(80, 0, 1).reverse()
  ];

  class Circle {
    constructor({ radius, offsetAngle }) {
      this.radius = radius;
      // this.color = random.pick(palette);
      // this.color = color;
      this.offsetAngle = offsetAngle;
    }

    draw() {
      
      context.beginPath();
      
      for (let i = 0; i < 360; i++) {
        
        const angle  = (i + startAngle) * Math.PI / 180;
        
        const ampRadius = 10;
        let amp = smooth[i] * Math.sin((angle * 6 + this.offsetAngle)) * ampRadius;
        let x = width / 2 + Math.cos(angle) * (this.radius + amp);
        let y = height / 2 + Math.sin(angle) * (this.radius + amp);
        i > 0 ? context.lineTo(x, y) : context.moveTo(x, y);
      }
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
    }
  }

  function getCircles() {
    for (let i = opt.count; i > 0; i--) {
      circles.push(new Circle({
        radius: opt.radius + opt.offset * i,
        offsetAngle: i * opt.waveOffset * Math.PI / 180
      }))
    }
  }
  getCircles();

  return (props) => {
    ({ width, height, time} = props);

    startAngle++;

    context.clearRect(0, 0, width, height);

    circles.forEach((circle, i) => {
      circle.color = `hsl(${i * 5 + time * 10}, 50%, 50%)`
      circle.draw();
    })

    // context.save()
    // context.font = "70px Potta One"
    // context.fillStyle = 'white'
    // context.fillText('LOGO', width / 2 - 110, height / 2 + 25)
    // context.restore()
  }
};

canvasSketch(sketch, settings);
