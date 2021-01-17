import random from 'canvas-sketch-util/random';

class Dot {
  constructor(context, x, y, radius = 2, color = '#000' ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = radius;
    this.color = color;
    this.friction = 0.89;
    this.springFactor = 0.9;
    this.animateCount = 1;
  }

  draw() {
    this.context.save();
    this.context.beginPath();
    this.context.arc( this.x, this.y, this.radius, 0, Math.PI * 2 );
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.restore();
  }

  animate() {
    if (this.animateCount % 100 === 0) {
      this.x += random.gaussian(-3, 2) * 5;
      this.y += random.gaussian(-3, 2) * 5;
      this.x -= random.gaussian(-3, 2) * 2;
      this.y -= random.gaussian(-3, 2) * 5;
    }
    this.animateCount++;
    let dx = this.originalX - this.x;
    let dy = this.originalY - this.y;

    this.vx += dx * 0.1;
    this.vy += dy * 0.1;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;
  }
}

export default Dot;