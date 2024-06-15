<template>
    <div>
      <div class="button-container">
        <button @click="filterNodes('User')">User</button>
        <button @click="filterNodes('Device')">Device</button>
        <button @click="filterNodes('系统安全')">系统安全</button>
        <button @click="filterNodes('系统登录')">系统登录</button>
        <button @click="resetGraph">Reset</button>
      </div>
      <div ref="networkGraph" class="network-graph"></div>
    </div>
  </template>
  
  <script>
  import * as d3 from 'd3';
  
  export default {
    name: 'CustomGraph',
    props: {
      nodes: {
        type: Array,
        required: true
      },
      links: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        originalNodes: [], // Store original nodes
        originalLinks: []  // Store original links
      };
    },
    mounted() {
      this.originalNodes = JSON.parse(JSON.stringify(this.nodes)); // Deep copy original nodes
      this.originalLinks = JSON.parse(JSON.stringify(this.links)); // Deep copy original links
      this.createNetworkGraph();
      window.addEventListener('resize', this.resizeNetworkGraph);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeNetworkGraph);
    },
    methods: {
      createNetworkGraph() {
        const container = this.$refs.networkGraph;
        const width = container.clientWidth;
        const height = container.clientHeight;
  
        const svg = d3.select(container)
          .append('svg')
          .attr('width', width)
          .attr('height', height);
  
        const color = d3.scaleOrdinal(d3.schemeCategory10);
  
        const simulation = d3.forceSimulation(this.nodes)
          .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
          .force('charge', d3.forceManyBody().strength(-500))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collision', d3.forceCollide().radius(50));
  
        const link = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(this.links)
          .enter().append('line')
          .attr('stroke', '#999')
          .attr('stroke-opacity', 0.6);
  
        const node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('g')
          .data(this.nodes)
          .enter().append('g')
          .call(d3.drag()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended));
  
        node.append('circle')
          .attr('r', 10)
          .attr('fill', d => color(d.group));
  
        node.append('text')
          .attr('x', 12)
          .attr('y', 3)
          .text(d => d.id);
  
        simulation.on('tick', () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
  
          node
            .attr('transform', d => `translate(${d.x},${d.y})`);
        });
  
        this.svg = svg;
        this.simulation = simulation;
      },
      resizeNetworkGraph() {
        const container = this.$refs.networkGraph;
        const width = container.clientWidth;
        const height = container.clientHeight;
  
        if (this.svg) {
          this.svg.attr('width', width).attr('height', height);
          this.simulation.force('center', d3.forceCenter(width / 2, height / 2));
          this.simulation.alpha(1).restart();
        }
      },
      dragstarted(event) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      },
      dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      },
      dragended(event) {
        if (!event.active) this.simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      },
      filterNodes(group) {
        // Filter nodes by group and update graph
        const filteredNodes = this.originalNodes.filter(node => node.group === group);
        const filteredNodeIds = filteredNodes.map(node => node.id);
        const filteredLinks = this.originalLinks.filter(link => 
          filteredNodeIds.includes(link.source) && filteredNodeIds.includes(link.target)
        );
  
        // Update nodes and links
        this.nodes = filteredNodes;
        this.links = filteredLinks;
  
        // Clear and recreate the graph
        d3.select(this.$refs.networkGraph).select('svg').remove();
        this.createNetworkGraph();
      },
      resetGraph() {
        // Reset nodes and links to original data
        this.nodes = JSON.parse(JSON.stringify(this.originalNodes));
        this.links = JSON.parse(JSON.stringify(this.originalLinks));
  
        // Clear and recreate the graph
        d3.select(this.$refs.networkGraph).select('svg').remove();
        this.createNetworkGraph();
      }
    }
  };
  </script>
  
  <style scoped>
  .network-graph {
    width: 100vw;
    height: 100vh;
  }
  
  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  
  .button-container button {
    margin: 5px;
    padding: 10px 20px;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .button-container button:hover {
    background-color: #ddd;
  }
  </style>
  