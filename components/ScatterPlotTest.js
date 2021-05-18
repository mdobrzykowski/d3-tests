import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

let nr = 0;
const getDataSet = len => {
    nr++;
    if(nr > len - 1) nr = 0;
    return nr;
};

const ScatterPlotTest = () => {
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

        const scaleX = d3.scaleBand()
            .range([0, width])
            .paddingInner(0.2)
            .paddingOuter(0.2);

        const scaleY = d3.scaleLinear()
            .range([height, 0]);

        const labels = d3.scaleBand()
            .range([0, width])
            .paddingInner(0.2)
            .paddingOuter(0.2);

        const xAxisGroup = group1.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height})`);

        const yAxisGroup = group1.append('g')
                .attr('class', 'y axis');

        group1.append('text')
            .attr('x', width/2)
            .attr('y', -10)
            .attr('font-size', '20px')
            .attr('fill', '#fff')
            .attr('text-anchor', 'middle')
            .text("Test")

        d3.json('../data/dynamicTest.json').then(data => {
            function update(data){
                const t = d3.transition().duration(750);

                scaleX.domain(data.map(d => d.id));
                scaleY.domain([0, d3.max(data, d => d.value)]);
                labels.domain(data.map(d => d.name));
                
                const xAxisCall = d3.axisBottom(labels);
                xAxisGroup.transition(t).call(xAxisCall)
                        .selectAll('text')
                        .attr('x', -5)
                        .attr('y', 10)
                        .attr('text-anchor', 'end')
                        .attr('transform', 'rotate(-40)')

                const yAxisCall = d3.axisLeft(scaleY);
                yAxisGroup.transition(t).call(yAxisCall);

                const circles = group1.selectAll("circle")
                    .data(data, d => d.id);
            

                circles.exit()
                    .attr('fill', 'red')
                    .transition(t)
                        .attr('cy', d => 0)
                        .attr('height', 0) 
                        .remove();

                circles.transition(t)
                    .attr('cx', d => scaleX(d.id))
                    .attr('cy', d => scaleY(d.value))
                    .attr('width', scaleX.bandwidth)
                    .attr('height', d => height - scaleY(d.value));

                circles.enter()
                    .append('circle')
                    .attr('fill', "blue")
                    .attr('cy', scaleY(0))
                    .attr('r', 5)
                    .merge(circles)
                        .transition(t)
                        .attr('cx', d => scaleX(d.id) + (scaleX.bandwidth()/2))
                        .attr('cy', d => scaleY(d.value))
            }
            

            d3.interval(() => {
                update(data[getDataSet(data.length)]);
            }, 1000);

            update(data[0]);
        });

    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default ScatterPlotTest;