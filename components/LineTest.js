import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const LineTest = () => {
    const chartAreaRef = useRef(null);

    useEffect(() => {
        const chartArea = chartAreaRef.current;

        const MARGIN = { LEFT: 20, RIGHT: 100, TOP: 50, BOTTOM: 100 }
        const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
        const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM
        
        const svg = d3.select(chartArea).append("svg")
          .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
          .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        
        const g = svg.append("g")
          .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
        
        const parseTime = d3.timeParse("%Y")
        // for tooltip
        const bisectDate = d3.bisector(d => d.year).left
        
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])
        
        const xAxisCall = d3.axisBottom()

        const yAxisCall = d3.axisLeft()
            .ticks(6)
            .tickFormat(d => `${parseInt(d / 1000)}k`)
        
        const xAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${HEIGHT})`)

        const yAxis = g.append("g")
            .attr("class", "y axis")
            
        yAxis.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text("Line test")
        
        // const line = d3.line()
        //     .x(d => x(d.year))
        //     .y(d => y(d.value))

        const line = d3.area()
            .x(d => x(d.year))
            .y0(y(0))
            .y1(d => y(d.value))
        
        d3.json("data/lineTest.json").then(data => {
            data.forEach(d => {
                d.year = parseTime(d.year)
                d.value = Number(d.value)
            })
        
            x.domain(d3.extent(data, d => d.year))
            y.domain([
                d3.min(data, d => d.value) / 1.005, 
                d3.max(data, d => d.value) * 1.005
            ])
        
            xAxis.call(xAxisCall.scale(x))
            yAxis.call(yAxisCall.scale(y))
        
            g.append("path")
                .attr("class", "line")
                .attr("fill", "white")
                .attr("stroke", "grey")
                .attr("stroke-width", "3px")
                .attr("d", line(data))
        
            //tooltip
            const focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none")
        
            focus.append("line")
                .attr("class", "x-hover-line hover-line")
                .attr("y1", 0)
                .attr("y2", HEIGHT)
        
            focus.append("line")
                .attr("class", "y-hover-line hover-line")
                .attr("x1", 0)
                .attr("x2", WIDTH)
        
            focus.append("circle")
                .attr("r", 7.5)
        
            focus.append("text")
                .attr("x", 15)
                .attr("dy", ".31em")
        
            g.append("rect")
                .attr("class", "overlay")
                .attr("width", WIDTH)
                .attr("height", HEIGHT)
                .on("mouseover", () => focus.style("display", null))
                .on("mouseout", () => focus.style("display", "none"))
                .on("mousemove", mousemove)
        
            function mousemove(ev) {
                const x0 = x.invert(ev.layerX)
                const i = bisectDate(data, x0, 1)
                const d0 = data[i - 1]
                const d1 = data[i]
                const d = x0 - d0.year > d1.year - x0 ? d1 : d0
                focus.attr("transform", `translate(${x(d.year)}, ${y(d.value)})`)
                focus.select("text").text(d.value)
                focus.select(".x-hover-line").attr("y2", HEIGHT - y(d.value))
                focus.select(".y-hover-line").attr("x2", -x(d.year))
            }
        })
    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default LineTest;