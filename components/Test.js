import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const Test = () => {
    const chartAreaRef = useRef(null);

    useEffect(() => {
        const chartArea = chartAreaRef.current;


        d3.json('../data/test.json').then(data => {

            const svg = d3.select(chartArea)
                .append('svg')
                .attr('width', 400)
                .attr('height', 400);

            const cricles = svg.selectAll("cricle")
                .data(data);
        
            cricles.enter()
                .append('circle')
                .attr('cx', (d, i) => d * i)
                .attr('cy', (d, i) => d * i)
                .attr('r', d => d)
                .attr('fill', "blue");

        });

    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default Test;