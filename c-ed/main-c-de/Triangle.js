import { TimelineMax, Power4 } from 'gsap';
import random from 'canvas-sketch-util/random';

class Triangle {
  constructor(context, position, sin, cos) {
    this.context = context;
    this.position = position;
    this.positionFrom = Array(3).fill([sin, cos]).flat();
    this.tlSet = false;
    this.alpha = 1;
    this.tick = 0;
  }
  draw() {
    if (!this.tlSet) {
      this.tlSet = true;

      let tl = new TimelineMax({
        delay: 3 * Math.random(),
        ease: random.pick([
          Power4.easeIn,
          Power4.easeOut,
        ]),
      });
      tl.from(this.position, 3, this.positionFrom);
    }
    this.tick++;

    if (this.tick > 400 && this.alpha >= 0.1) {
      this.alpha -= 0.1;
    }

    if (this.alpha >= 0.1) {
      this.context.beginPath();
      this.context.globalAlpha = this.alpha;
      this.context.fillStyle = `rgb(255, 0, 0)`;
      this.context.moveTo(this.position[0], this.position[1]);
      this.context.lineTo(this.position[2], this.position[3]);
      this.context.lineTo(this.position[4], this.position[5]);
      this.context.strokeStyle = 'white';
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
    }
  }
}

export default Triangle;