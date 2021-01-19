import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';
import random from 'canvas-sketch-util/random';
import palettes from 'nice-color-palettes';
import getGui from '../../utils/getGui';

const settings = {
  // For SVG to resize easily we will have to set this to true
  scaleToView: true,
  // Do not append <canvas> element
  parent: false,
};

const sketch = ({ width, height }) => {
  random.setSeed(3);

  const palette = [
    ...random.pick(palettes).slice(0, 5),
    ...random.pick(palettes).slice(0, 5),
  ];

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

  const pieGenerator = d3
    .pie()
    .value((d) => d.value)
    .sort(function (a, b) {
      return a.sort.localeCompare(b.sort);
    });

  const data = [
    { sort: 'n1', value: 23 },
    { sort: 'n2', value: 53 },
    { sort: 'n3', value: 23 },
    { sort: 'n4', value: 222 },
    { sort: 'n5', value: 54 },
    { sort: 'n6', value: 12 },
    { sort: 'n7', value: 67 },
    { sort: 'n8', value: 234 },
  ];

  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${width / 2}, ${height / 2})`
    );

  function getArc() {
    const arcGenerator = d3
      .arc()
      .innerRadius(100)
      .outerRadius(200)
      .padAngle(0.02)
      .padRadius(200)
      .cornerRadius(5);

    const arcData = pieGenerator(data);

    g.selectAll('path').remove(); // onGui
    g.selectAll('text').remove(); // onGui

    g.selectAll('path')
      .data(arcData)
      .enter()
      .append('path')
      .attr('fill', 'red')
      .attr('d', arcGenerator)
      .attr('fill', (d, i) => palette[i]);
    g.selectAll('text')
      .data(arcData)
      .enter()
      .append('text')
      .each(function (d, i) {
        const centroid = arcGenerator.centroid(d);
        d3.select(this)
          .attr('x', centroid[0] - 5)
          .attr('y', centroid[1] - 5)
          .attr('dy', '13px')
          .text(i);
      });
  }
  getArc();

  getGui((gui) => {
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
      gui
        .add(data[i], 'value')
        .min(20)
        .max(300)
        .step(1)
        .onChange(getArc);
    }
  });

  return {
    render({ exporting, width, height }) {
      svg
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

      if (exporting) {
        const copy = d3
          .select(svg.node().cloneNode(true))
          .attr('width', width)
          .attr('height', height);

        const data = svgToBlob(copy.node());
        return { data, extension: '.svg' };
      }
    },
    resize(props) {
      ({ width, height } = props);
    },
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
