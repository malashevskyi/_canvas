import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';

import getGui from '../../utils/getGui';

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

  const opt = {
    exponent: 0.5
  }

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .classed('svg', true);

  const data = [];
  for (let i = 0; i <= 20;) data.push(++i)

  const xScale = d3
    .scalePow()
    .exponent(opt.exponent)
    .domain([0, data[data.length - 1]])
    .range([0, width])

  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d))
    .attr('y', height / 2 - 5)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'red')


  function guiUpdate() {
    xScale.exponent(opt.exponent)
    svg
      .selectAll('rect')
      .attr('x', (d) => xScale(d))
  }

  getGui((gui) => {
    gui
      .add(opt, 'exponent')
      .min(0.1)
      .max(1)
      .step(0.1)
      .onChange(guiUpdate);
  });

  return ({ width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
  };
};

canvasSketch(sketch, settings);
