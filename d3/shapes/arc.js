import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';
// import * as dat from 'dat.gui';
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
    innerRadius: 60,
    outerRadius: 100,
    padAngle: 0,
    padRadius: 0,
    cornerRadius: 0
  }

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .classed('svg', true);

  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${width * 0.5}, ${height * 0.5})`
    );

  function drawArc() {
    const arc = d3.arc()
      .innerRadius(opt.innerRadius)
      .outerRadius(opt.outerRadius)
      .padAngle(opt.padAngle)
      .padRadius(opt.padRadius)
      .cornerRadius(opt.cornerRadius)
    ({
      startAngle: Math.PI,
      endAngle: Math.PI * 2,
    });
    g.append('path')
      .attr('d', arc)
      .attr('fill', 'red')
  }
  drawArc()
    
  function guiUpdateArc() {
    g.select('path').remove(); 
    drawArc();
  }

  getGui((gui) => {
    gui.add( opt, 'innerRadius' ).min( 0 ).max( 99 ).step( 1 ).onChange(guiUpdateArc)
    gui.add( opt, 'outerRadius' ).min( 100 ).max( 250 ).step( 1 ).onChange(guiUpdateArc)
    gui.add( opt, 'padAngle' ).min( 0 ).max( 3.1 ).step( 0.1 ).onChange(guiUpdateArc)
    gui.add( opt, 'padRadius' ).min( 0 ).max( 13.1 ).step( 0.1 ).onChange(guiUpdateArc)
    gui.add( opt, 'cornerRadius' ).min( 0 ).max( 100 ).step( 0.1 ).onChange(guiUpdateArc)

  })

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
