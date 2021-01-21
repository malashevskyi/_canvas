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
  for (let i = 0; i < 9; i++) {
    console.log(i);
    data.push(Math.pow(2, i))
  }

  const logScale = d3
    .scaleLog()
    .domain([data[0], Math.max(...data)])
    .range([20, width - 40])

  svg
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', (d) => logScale(d))
    .attr('y', (d) => height / 2)
    .text((d) => d)

  return ({ width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
  };
};

canvasSketch(sketch, settings);
