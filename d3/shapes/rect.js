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

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      svg
        .append('rect')
        .attr('x', (width / 5) * i)
        .attr('y', (height / 5) * j)
        .attr('width', 100)
        .attr('height', 100);
    }
  }

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
