<template>
    <div ref="networkGraph" class="network-graph"></div>
  </template>
  
  <script>
  import * as d3 from 'd3';
  
  export default {
    name: 'NetworkGraph',
    props: {
      nodes: Array,
      links: Array
    },
    mounted() {
      this.createNetworkGraph();
    },
    methods: {
      createNetworkGraph() {
        const width = 960;
        const height = 600;
        const svg = d3.select(this.$refs.networkGraph)
          .append('svg')
          .attr('width', width)
          .attr('height', height);
  
        const simulation = d3.forceSimulation(this.nodes)
          .force('link', d3.forceLink(this.links).id(d => d.id))
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(width / 2, height / 2));
  
        const link = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(this.links)
          .enter()
          .append('line')
          .attr('stroke', '#999')
          .attr('stroke-opacity', 0.6);
  
        const node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(this.nodes)
          .enter()
          .append('circle')
          .attr('r', 5)
          .attr('fill', d => this.getNodeColor(d.group))
          .call(d3.drag()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended));
  
        node.append('title')
          .text(d => d.id);
  
        simulation.on('tick', () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
  
          node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        });
      },
      getNodeColor(group) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff'];
        return colors[group % colors.length];
      },
      dragstarted(event, d) {
        if (!event.active) d3.forceSimulation().alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      },
      dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      },
      dragended(event, d) {
        if (!event.active) d3.forceSimulation().alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }
  };
  </script>
  
  <style scoped>
  .network-graph {
    width: 100%;
    height: 600px;
  }
  </style>
  