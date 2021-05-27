import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const ForceLayoutTest = () => {
    const chartAreaRef = useRef(null);

    useEffect(() => {
        const chartArea = chartAreaRef.current;
        const paddingLeft = 50;
        const paddingTop = 50;
        const width = 300;
        const height = 300;

        d3.json('../data/ForceLayoutTest.json').then(data => {

            const svg = d3.select(chartArea)
                .append('svg')
                .attr('width', 400)
                .attr('height', 400);
            
            const group1 = svg.append('g')
                .attr('transform', `translate(${paddingLeft}, ${paddingTop})`);

            const simulation = d3.forceSimulation(data.nodes)
                .force('charge', d3.forceManyBody().strength(-100))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('link', d3.forceLink()
                    .id(d => d.id)
                    .distance(60)
                    .links(data.links)
                );

            const linksGroup = group1.append('g')
                .attr('class', 'links');

            const links = linksGroup.selectAll('line')
                .data(data.links)
                .enter()
                .append('line');

            const nodesGroup = group1.append('g')
                .attr('class', 'nodes');
                
            const nodes = nodesGroup.selectAll('text')
                .data(data.nodes)
                .enter()
                .append('text')
                .text(d => d.name)
                .attr('dy', 5);

            const update = () => {
                links
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);
                nodes
                    .attr('x', d => d.x)
                    .attr('y', d => d.y);
            };

            simulation.on('tick', update);
            // https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372

        });

    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default ForceLayoutTest;