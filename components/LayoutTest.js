import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const DynamicTest = () => {
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
    

        /** 
         *  layouts
         *  d3.pie()
         *  d3.force()
         *  d3.stack()
         *  d3.treemap()
         *  d3.layout.cloud()
         * 
         * console.log(pie(data));
         */

    }, []);

    return (
        <div ref={chartAreaRef}></div>
    );
}

export default DynamicTest;