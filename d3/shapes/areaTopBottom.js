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

  const areaGenerator = d3.area().y0(height);

  const points = [];
  const count = 20;
  for (let i = 0; i <= count; i++) {
    points.push([
      (width / count) * i,
      random.range(height - 100, height - 200),
    ]);
  }

  const g = svg.append('g');

  g.append('path')
    .attr('d', areaGenerator(points))
    .attr('fill', 'black')
    .attr('stroke-width', 10)
    .attr('stroke', 'black');

  return ({ exporting, width, height }) => {
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
