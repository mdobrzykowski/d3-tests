import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const PieTest = () => {
    const chartAreaRef = useRef(null);

    useEffect(() => {
        const chartArea = chartAreaRef.current;

        const MARGIN = { LEFT: 50, RIGHT: 100, TOP: 50, BOTTOM: 100 };
        const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
        const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
        const RADIUS = Math.min(WIDTH, HEIGHT) / 2;
        
        const svg = d3.select(chartArea).append("svg")
            .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);
            
        const marginLayer = svg.append("g")
            .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

        const chartLayer = marginLayer.append("g")
            .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);

        const color = d3.scaleTime()
            .range([0, 1]);
        
        const arc = d3.arc()
            .outerRadius(RADIUS - 20)
            .innerRadius(RADIUS - 80)
            // !padAngle default 0
            .cornerRadius(4)
            .padAngle(.01);

        const pie = d3.pie()
            .sort(null)
            .value(d => d.value0);

        const parseTime = d3.timeParse("%Y")
        
        d3.json("data/stackTest.json").then(data => {
            data.forEach(d => {
                d.year = parseTime(d.year)
            });

            color.domain(d3.extent(data, d => d.year));

            const g = chartLayer.selectAll('.arc')
                .data(pie(data))
                .enter().append('g')
                .attr('class', 'arc');

            g.append('path')
                .attr('d', arc)
                .attr("fill", d => d3.interpolateSinebow(color(d.data.year)));
        })
    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default PieTest;