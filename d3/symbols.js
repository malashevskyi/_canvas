import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';

const settings = {
  // For SVG to resize easily we will have to set this to true
  scaleToView: true,
  // Do not append <canvas> element
  parent: false,
  dimensions: [512, 512],
};

const sketch = ({ width, height }) => {
  d3.select('head').append('style').text(/* css */ `
    .svg {
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  `);

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .classed('svg', true);

  const symbol = d3
    .symbol()
    .type(d3.symbolCircle)
    // .type(d3.symbolCross)
    // .type(d3.symbolDiamond)
    // .type(d3.symbolSquare)
    // .type(d3.symbolStar)
    // .type(d3.symbolTriangle)
    // .type(d3.symbolWye)
    .size(1000);

  svg
    .append('path')
    .attr('d', symbol)
    .attr('transform', function (d, i) {
      return `translate(${width / 2}, ${height / 2})`;
    })
    .attr('fill', 'red');

  return ({ width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
  };
};

canvasSketch(sketch, settings);
