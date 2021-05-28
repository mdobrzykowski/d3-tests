import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const BrushTest = () => {
    const chartAreaRef = useRef(null);

    useEffect(() => {
        const chartArea = chartAreaRef.current;

        const MARGIN = { LEFT: 50, RIGHT: 100, TOP: 50, BOTTOM: 100 };
        const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
        const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

        const HEIGHTS = {
            CHART: ~~((HEIGHT - 60) * 0.8),
            CHARTLABEL: 30,
            BRUSH: ~~((HEIGHT - 60) * 0.2),
            BRUSHLABEL: 30,
        };
        
        const svg = d3.select(chartArea).append("svg")
          .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
          .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        
        const g = svg.append("g")
          .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

        // const parseTime = d3.timeParse('%s');
        
        const x = d3.scaleTime().range([0, WIDTH]);
        const y = d3.scaleLinear().range([HEIGHTS.CHART, 0]);
        const brushX = d3.scaleTime().range([0, WIDTH]);
        const brushY = d3.scaleLinear().range([HEIGHTS.BRUSH, 0]);

        const chartXAxisCall = d3.axisBottom()
            // .tickFormat(d3.timeFormat("%Y-%m"))

        const chartYAxisCall = d3.axisLeft()
            .ticks(6);
            // .tickFormat(d => `${parseInt(d / 1000)}k`);

        const brushXAxisCall = d3.axisBottom();


        const chartG = g.append("g");

        const chartXAxis = g.append("g")
            .attr("transform", `translate(0, ${HEIGHTS.CHART})`)
            .attr("class", "x axis");

        const chartYAxis = g.append("g")
            .attr("class", "y axis");

        const brushG = g.append("g")
            .attr("transform", `translate(0, ${HEIGHTS.CHART + 30})`);
            
        const brushXAxis = g.append("g")
            .attr("transform", `translate(0, ${HEIGHTS.CHART + HEIGHTS.CHARTLABEL + HEIGHTS.BRUSH})`)
            .attr("class", "x axis");

        const chartLine = d3.area()
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d.value))
            .defined(d => x(d.date) >= 0 && x(d.date) <= WIDTH);

        const brushLine = d3.area()
            .x(d => brushX(d.date))
            .y0(brushY(0))
            .y1(d => brushY(d.value));

        d3.json('../data/BrushTest.json').then(data => {
            data.forEach(d => {
                // d.date = parseTime(d.date);
                d.date = new Date(d.date);
            })

            //TODO:
            x.domain(d3.extent(data, d => d.date))
            y.domain([
                d3.min(data, d => d.value) / 1.005, 
                d3.max(data, d => d.value) * 1.005
            ])
            //

            brushX.domain(d3.extent(data, d => d.date))
            brushY.domain([
                d3.min(data, d => d.value) / 1.005, 
                d3.max(data, d => d.value) * 1.005
            ]);
        
            chartXAxis.call(chartXAxisCall.scale(x));
            chartYAxis.call(chartYAxisCall.scale(y));
            brushXAxis.call(brushXAxisCall.scale(brushX));

            const path = chartG.append("path")
                .attr("class", "line")
                .attr("fill", "white")
                .attr("stroke", "grey")
                .attr("stroke-width", "1px")
                .attr("d", chartLine(data))

            brushG.append("path")
                .attr("class", "line")
                .attr("fill", "gray")
                .attr("stroke", "white")
                .attr("stroke-width", "1px")
                .attr("d", brushLine(data))

            const brush = d3.brushX()
                .extent([[0,0], [WIDTH, HEIGHTS.BRUSH]])
                // .on("end", updateChart)
                .on("brush", updateChart)

            const defaultSelection = [WIDTH/3, WIDTH/1.5];
            
            brushG.call(brush)
                .call(brush.move, defaultSelection);

            function updateChart(e) {
                const domain = e.selection.map(s => brushX.invert(s));
                x.domain(domain);
                chartXAxis.call(chartXAxisCall.scale(x));
                path.attr("d", chartLine(data));

                
                // chartYAxis.call(chartYAxisCall.scale(y));
            };
        });

    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default BrushTest;