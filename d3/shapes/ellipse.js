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

    const count = 10;
    const maxEllipseW = 150;
  
    const rxScale = d3
      .scaleLinear()
      .domain([0, 10])
      .range([0, maxEllipseW])
    const yScale = d3
      .scaleLinear()
      .domain([count, 0])
      .range([height - 50, 0])

    svg
      .selectAll('ellipse')
      .data(Array(10).fill(''))
      .enter()
      .append('ellipse')
      .attr('cx', width / 2 - count)
      .attr('cy', (d, i) => yScale(count - i))
      .attr('rx', (d, i) => rxScale(count - i))
      .attr('ry', 30)
      .attr('fill', (d, i) => `hsl(${10 * i + 20}, 50%, 50%)`);

  return ({
    exporting,
    width,
    height
  }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // If exporting, serialize SVG to Blob
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
