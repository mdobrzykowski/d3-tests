import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const ScaleTest = () => {
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

        d3.json('../data/scaleTest.json').then(data => {

            // const scaleLog = d3.scaleLog()
            //     .domain([100, 100000])
            //     .range([0, 200])
            //     .base(10);

            // console.log(scaleLog(5));
            // console.log(scaleLog(500));
            // console.log(scaleLog(5000));
            // console.log(scaleLog(50000));


            // const scaleTime = d3.scaleTime()
            //     .domain([
            //         new Date(2021, 0, 1),
            //         new Date(2021, 1, 1),
            //     ])
            //     .range([0, 200]);

            // console.log(scaleTime(new Date(2021, 0, 5)));
            // console.log(scaleTime(new Date(2021, 0, 29)));


            // const scaleOrdinal = d3.scaleOrdinal()
            //     .domain([
            //         'Test 1',
            //         'Test 2',
            //         'Test 3',
            //     ])
            // //  // .range([
            // //  //     'Test 1v2',
            // //  //     'Test 2v2',
            // //  //     'Test 3v2',
            // //  // ]);
            //     .range(d3.schemeCategory10);

            // console.log(scaleOrdinal('Test 2'));


            // const min = d3.min(data, d => d.value);
            // const max = d3.max(data, d => d.value);
            // const extent = d3.extent(data, d => d.value); // [min, max]

            // console.log(min, max, extent);


            
            // const scaleY = d3.scaleLinear()
            //     .domain(d3.extent(data, d => d.value))
            //     .range([0, 300]);




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
                .attr('fill', "blue");

            // d3.interval(() => {
            //     console.log("Test");
            // }, 1000);

        });

    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default ScaleTest;