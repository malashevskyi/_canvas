const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes')
const palette = random.pick(palettes);
import * as dat from 'dat.gui';

// for not overlay the gui if fps is installed
setTimeout(() => {
  const fpsExtension = document.querySelector('.fps-extension')
  fpsExtension?.setAttribute('style', 'position: absolute; right: 270px; top: 0')
}, 1000)

const settings = {
  animate: true,
};

const sketch = () => {
  let context, width, height;

  let points = [];
  let opt = {
    fillStyle: '#008bce',
    showPoints: false,
    count: 10
    ,
    range: {
      x: 20,
      y: 80,
    },
    duration: {
      min: 20,
      max: 40,
    },
    thickness: 5,
    level: 0.35,
    curved: true,
  };

  let ease = function (t, start, dRest, duration) {
    t /= (Math.floor(duration / 1.8));
    if (t < 1) {
      return dRest * 0.55 * t * t + start;
    }
    return -dRest / 2 * ( (t - 1) * (t - 3) - 1) + start;
  };

  class Point {
    constructor (config) {
      this.anchorX = config.x;
      this.anchorY = config.y;
      this.x = config.x;
      this.y = config.y;
      this.setTarget();  
    }
    setTarget() {
      this.initialX = this.x;
      this.initialY = this.y;
      this.targetX = this.anchorX + random.rangeFloor(0, 20) - 20;
      this.targetY = this.anchorY + random.rangeFloor(0, 80) - 80;
      this.tick = 0;
      this.duration = random.rangeFloor(30, 70);
    }
    update() {
      let dx = this.targetX - this.x;
      let dy = this.targetY - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if(Math.abs(dist) <= 0) {
        this.setTarget();
      } else {       
        let t = this.tick;
        let start = this.initialY;
        let dRest = this.targetY - start;
        let d = this.duration;
        this.y = ease(t, start, dRest, d);
        
        start = this.initialX;
        dRest = this.targetX - start;
        this.x = ease(t, start, dRest, d);

        this.tick++;
      }
    };
    render() {
      context.beginPath();
      context.arc(this.x, this.y, 4, 0, Math.PI * 2);
      context.fillStyle = 'orange';
      context.fill();
    };
  }

  let updatePoints = function(){
    let i = points.length;
    while(i--){
      points[i].update();
    }
  };
  
  let renderPoints = function() {
    let i = points.length;
    while(i--){
      points[i].render();
    }
  };

  function renderCurve(space) {
    let pointCount = points.length;
    let s = space == 'top';
    for (let i = 0; i < pointCount - 1; i++) {
      let c = (points[i].x + points[i + 1].x) / 2;
      let d = (points[i].y + points[i + 1].y) / 2;

      if (space == 'top') {
        d = ((height - points[i].y) + (height - points[i + 1].y)) / 2;
      } 

      context.quadraticCurveTo(points[i].x, s ? (height - points[i].y) : points[i].y, c, d);
    }
  }

  let renderShape = function() {
    context.fillStyle = opt.fillStyle
    context.lineWidth = opt.thickness

    context.beginPath()
    context.moveTo(points[0].x - opt.thickness - 20, points[0].y);	  
    renderCurve()
    context.lineTo(width + opt.thickness, height + opt.thickness);
    context.lineTo(-opt.thickness * 2, height + opt.thickness);
    context.fill()
    context.stroke()
    
    context.beginPath()
    context.moveTo(width + opt.thickness, 0 - opt.thickness)
    context.lineTo(0 - opt.thickness, 0 - opt.thickness)
    context.lineTo(points[0].x - opt.thickness, height - points[0].y)
    renderCurve('top')
    context.closePath()
    context.fill()
    context.stroke()
    
  };

  function loadGui() {
    const gui = new dat.GUI();
    gui.add( opt, 'count' ).min( 5 ).max( 40 ).step( 1 ).name( 'Count' ).onChange(drawPoints)
    gui.add( opt, 'level').min(0.1).max(0.4).name('Level').onChange(() => {
      drawPoints()
      console.log(opt.level);
    })
    gui.add( opt, 'thickness').min(5).max(Math.floor(height * 0.1)).name('Thickness').onChange(renderShape)
    var palette = { fillStyle: '#FF0000' };
    gui.addColor(palette, 'fillStyle').name('Fill Style').onChange(() => {
      opt.fillStyle = palette.fillStyle
    })
    gui.add( opt, 'showPoints').name('Show Points').listen()
  }

  function drawPoints() {
    points = [];
    for (let i = 0; i <= opt.count; i++) {
      points.push(new Point({
        x: lerp(-opt.thickness, width + opt.thickness, i / (opt.count - 1)),
        y: height - (height * opt.level)
      }));
    }
  }

  
  return (props) => {
    ({ width, height } = props);

    if (!context) {
      ({ context } = props);
      setTimeout(loadGui)
      drawPoints();
    }

    context.clearRect(0, 0, width, height);
    context.lineJoin = 'round';
    
    updatePoints();
    renderShape();
    if (opt.showPoints) {
      renderPoints();
    }
  };
};

canvasSketch(sketch, settings);
