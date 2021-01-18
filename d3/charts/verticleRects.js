import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';
import random from 'canvas-sketch-util/random';

const settings = {
  // For SVG to resize easily we will have to set this to true
  scaleToView: true,
  // Do not append <canvas> element
  parent: false,
  dimensions: [512, 512],
};

const sketch = ({ width, height }) => {
  random.setSeed(1);
  
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({ id: i, value: 5 + 10 * random.value()})
  }

  d3.select('head').append('style').text(/* css */ `
    svg {
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  `);

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.id))
    .range([0, width])
    .padding(0.01);
  const yScale = d3
    .scaleLinear()
    .domain([0, 15])
    .range([height, 0]);

  const svg = d3.select('body').append('svg');

  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => {
      return height - yScale(d.value);
    })
    .attr('x', (data) => xScale(data.id))
    .attr('y', (data) => yScale(data.value))
    .attr('fill', 'red');

  return ({ exporting, width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    if (exporting) {
      // Clone the SVG element and resize to output dimensions
      const copy = d3
        .select(svg.node().cloneNode(true))
        .attr('width', width)
        .attr('height', height);

      // Make a blob out of the SVG and return that
      const data = svgToBlob(copy.node());
      return { data, extension: '.svg' };
    }
  };
};

canvasSketch(sketch, settings);

function svgToBlob(svg) {
  const svgAsXML = new window.XMLSerializer().serializeToString(
    svg
  );
  return new window.Blob([svgAsXML], {
    type: 'image/svg+xml',
  });
}
