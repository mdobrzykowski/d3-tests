import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import d3tip from 'd3-tip'

const TipTest = () => {
    const chartAreaRef = useRef(null);

    useEffect(() => {
        const chartArea = chartAreaRef.current;

        const svg = d3.select(chartArea)
            .append('svg')
            .attr('width', 400)
            .attr('height', 400);

        const paddingLeft = 50;
        const paddingTop = 50;
        const width = 300;
        const height = 300;

        const group1 = svg.append('g')
            .attr('transform', `translate(${paddingLeft}, ${paddingTop})`);

        const tip = d3tip()
            .attr('class', 'd3-tip') //lesson 52, 2:54
            .html((e, d) => `<div><b>id: ${d.id}</b><p>name: ${d.name}</p><i>value: ${d.value}</i></div>`)

        group1.call(tip);

        d3.json('../data/scaleTest.json').then(data => {
            const scaleX = d3.scaleBand()
                .domain(data.map(d => d.id))
                .range([0, width])
                .paddingInner(0.2)
                .paddingOuter(0.2);

            const labels = d3.scaleBand()
                .domain(data.map(d => d.name))
                .range([0, width])
                .paddingInner(0.2)
                .paddingOuter(0.2);


            const scaleY = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([height, 0]);


            group1.append('text')
                .attr('x', width/2)
                .attr('y', -10)
                .attr('font-size', '20px')
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')
                .text("Test")


            
            const xAxisCall = d3.axisBottom(labels);
            group1.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxisCall)
                    .selectAll('text')
                    .attr('x', '-5')
                    .attr('y', '10')
                    .attr('text-anchor', 'end')
                    .attr('transform', 'rotate(-40)')

            const yAxisCall = d3.axisLeft(scaleY);
            group1.append('g')
                .attr('class', 'y axis')
                .call(yAxisCall);


            const rects = group1.selectAll("rect")
                .data(data);
        
            rects.enter()
                .append('rect')
                .attr('x', d => scaleX(d.id))
                .attr('y', d => scaleY(d.value))
                .attr('width', scaleX.bandwidth)
                .attr('height', d => height - scaleY(d.value))
                .attr('fill', "blue")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
        });

    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default TipTest;