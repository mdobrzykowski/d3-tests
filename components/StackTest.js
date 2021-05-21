import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const LineTest = () => {
    const chartAreaRef = useRef(null);

    useEffect(() => {
        const chartArea = chartAreaRef.current;

        const MARGIN = { LEFT: 50, RIGHT: 100, TOP: 50, BOTTOM: 100 }
        const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
        const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM
        
        const svg = d3.select(chartArea).append("svg")
          .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
          .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        
        const g = svg.append("g")
          .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
        
        const parseTime = d3.timeParse("%Y")
        
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])
        const z = d3.scaleOrdinal().range(d3.schemeCategory10)
        
        const stack = d3.stack()
            .order(d3.stackOrderDescending)
            
        const area = d3.area()
            .x(d => x(d.data.year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));


        const xAxisCall = d3.axisBottom()

        const yAxisCall = d3.axisLeft()
            .ticks(6)
            // .tickFormat(d => `${parseInt(d / 1000)}k`)
        
        const xAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${HEIGHT})`)

        const yAxis = g.append("g")
            .attr("class", "y axis")
        
        d3.json("data/stackTest.json").then(data => {
            data.forEach(d => {
                d.year = parseTime(d.year)
            })

            const keys = ["value0", "value1", "value2"];
        
            x.domain(d3.extent(data, d => d.year))
            y.domain([
                0,
                d3.max(data, d => keys.map(k => d[k]).reduce((total, curr) => total + curr))
            ]);
            z.domain(keys);
            stack.keys(keys);

            console.log( d3.max(data, d => d.value0));
            console.log(data);
            console.log(stack(data));
            
            const layer = g.selectAll('.layer')
                .data(stack(data))
                .enter().append('g')
                .attr('class', 'layer');

            layer.append('path')
                .attr("class", "area")
                .attr("fill", d => z(d.key))
                .attr("d", area)
        
            xAxis.call(xAxisCall.scale(x))
            yAxis.call(yAxisCall.scale(y))
        })
    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default LineTest;