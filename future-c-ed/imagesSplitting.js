const canvasSketch = require('canvas-sketch');
const { lerp, linspace } = require('canvas-sketch-util/math');
import { TimelineMax, Power0 } from 'gsap';
import * as d3 from 'd3';

const settings = {
  animate: true,
};

d3
.select('head')
.append('style')
.text(/*css*/`
  .canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
  .mycanvas2 {
    z-index: -1;
  }
  .mycanvas3 {
    z-index: -2;
  }
`);


const sketch = ({ context: context1, width, height }) => {
  // { canvasWidth, canvasHeight }
  let context2, context3;
  const w1 = [0];
  const w2 = [0];
  
  // animate canvas clearing
  const tl = new TimelineMax({ delay: 2, repeat: -1, repeatDelay: 2 });
  tl.to(w1, 2, { 0: 100, yoyoEase: Power0.easeNone, ease: Power0.easeNone });
  tl.to(w2, 2, { delay: 2, 0: 100, yoyoEase: Power0.easeNone, ease: Power0.easeNone });
  
  function addCanvas(classN) {
    d3
      .select('body')
      .append('canvas')
      .attr('width', width)
      .attr('height', height)
      .classed(`${classN} canvas`, true)
  }
  addCanvas('mycanvas2');
  addCanvas('mycanvas3');


  const images = [
    {
      image: new Image(),
      src: './../images/stefano-zocca-YO3zHD5jGhA-unsplash.jpg',
      onload() { onloadImage(context1, this) }
    },
    {
      image: new Image(),
      src: './../images/pexels-louise.jpg',
      onload() {
        context2 = document.querySelector('.mycanvas2').getContext('2d');
        onloadImage(context2, this);
      }
    },
    {
      image: new Image(),
      src: './../images/stefano-zocca-YO3zHD5jGhA-unsplash.jpg',
      onload() {
        context3 = document.querySelector('.mycanvas3').getContext('2d');
        onloadImage(context3, this);
      }
    }
  ];

  for (let i = 0; i < images.length; i++) {
    images[i].image.src = images[i].src;
    images[i].image.onload = images[i].onload;
  }
  
  function onloadImage(context, image) {
    // fit image to the canvas size
    let d = Math.min(
      image.height / height,
      image.width / width,
    );

    let imageWidth = image.width / d;
    let imageHeight = image.height / d;
  
    context.drawImage(image, -(imageWidth - width) / 2, -(imageHeight - height) / 2, imageWidth, imageHeight);
  }

  class Clear {
    constructor({ x, y }) {
      this.x = x;
      this.y = y;
      this.offset = 100;
    }

    clear(w1, w2) {
      context1.clearRect(this.x - this.offset + w1, this.y, w1, height);
      
      if (context2) context2.clearRect(this.x - this.offset + w2, this.y, w2, height);
    }
  }

  const clearPoints = [];

  function getClearPoints() {
    const xl = (width / 100);
    // const yl = (height / 50);
  
    const u = linspace(xl);
    // const v = linspace(yl);
  
    for (let x = 0; x < xl; x++) {
  
      clearPoints.push(
        new Clear({
          x: lerp(0, width, u[x]),
          y: 0
        })
      )
      // for (let y = 0; y < yl; y++) { }
  
    }
  }
  getClearPoints();

  return (props) => {
    ({ width, height } = props);

    if (context1, context2) {
      onloadImage(context1, images[0].image);
      onloadImage(context2, images[1].image);
    }

    for (let i = 0; i < clearPoints.length; i++) {
      clearPoints[i].clear(...w1, ...w2)
    }

  };
};

canvasSketch(sketch, settings);
