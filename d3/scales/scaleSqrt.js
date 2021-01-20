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

  const data = [];
  for (let i = 0; i <= 8;) data.push(++i)

  const xScale = d3
    .scaleLinear()
    .domain([0, data[data.length - 1]])
    .range([0, width])

  const sizeScale = d3
    .scaleSqrt()
    .domain([0, data[data.length - 1]])
    .range([0, 50])

  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d))
    .attr('y', (d) => height / 2 - sizeScale(d) / 2)
    .attr('width', (d) => sizeScale(d))
    .attr('height', (d) => sizeScale(d))
    .attr('fill', 'red')

  return ({ width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
  };
};

canvasSketch(sketch, settings);
