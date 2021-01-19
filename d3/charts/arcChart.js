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
    ...random.pick(palettes).slice(0, 5)
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

  const data = [23, 53, 23, 222, 54, 12, 67, 234];
  const TWOPI = Math.PI * 2;
  const startAngles = [0];
  let dataSum;

  function getDataSum() {
    dataSum = data.reduce((sum, val) => sum + val, 0)
  }
  getDataSum();

  function getStartAngles() {
    if (startAngles.length > 1) startAngles.length = 1;
    data.reduce((sum, val) => {
      const sm = sum + val;
      startAngles.push(sm);
      return sm;
    }, 0);
  }
  getStartAngles();

  const arcScale = d3
    .scaleLinear()
  
  function setArcScale() {
    arcScale
    .domain([0, dataSum])
    .range([0, TWOPI]);
  }
  setArcScale();
  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${width / 2}, ${height / 2})`
    );

  const arc = d3
    .arc()
    .innerRadius(100)
    .outerRadius(250)
    .padAngle(0.02)
    .padRadius(250)
    .cornerRadius(5)

  function setStartEndAngle() {
    arc
    .startAngle((d, i) => arcScale(startAngles[i]))
    .endAngle(
      (d, i) => arcScale(startAngles[i]) + arcScale(d)
    );
  }
  setStartEndAngle();

  g.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', arc)
    // .attr('stroke-width', 3)
    // .attr('stroke', 'white')
    .attr('fill', (d, i) => palette[i]);

  function guiChange() {
    getDataSum(); // get new sum
    getStartAngles(); // update angles
    setStartEndAngle(); // update arc angles
    setArcScale(); // set new domain

    g
      .selectAll('path')
      .data(data)
      .attr('d', arc)
      // .enter()
  }

  getGui((gui) => {
    gui .add(data, '0').min(10).max(300).step(1).onChange(guiChange);
    gui .add(data, '1').min(10).max(300).step(1).onChange(guiChange);
    gui .add(data, '2').min(10).max(300).step(1).onChange(guiChange);
    gui .add(data, '3').min(10).max(300).step(1).onChange(guiChange);
    gui .add(data, '4').min(10).max(300).step(1).onChange(guiChange);
    gui .add(data, '5').min(10).max(300).step(1).onChange(guiChange);
    gui .add(data, '6').min(10).max(300).step(1).onChange(guiChange);
    gui .add(data, '7').min(10).max(300).step(1).onChange(guiChange);
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

      // g.selectAll('path').attr('d', areaGenerator);
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
