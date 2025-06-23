// components/BubbleChart.tsx
import { hierarchy, pack } from 'd3-hierarchy'
import { useEffect, useRef } from 'react'

export default function BubbleChart({ data }: { data: any[] }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const root = hierarchy({ children: data })
      .sum((d: any) => d.weight)
      .sort((a, b) => b.value! - a.value!)

    const packLayout = pack().size([400, 400]).padding(5)
    const packed = packLayout(root)

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    svg
      .selectAll('circle')
      .data(packed.descendants().slice(1))
      .join('circle')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', (d: any) => d.r)
      .attr('fill', '#ff6b6b')
      .attr('stroke', '#fff')

    svg
      .selectAll('text')
      .data(packed.descendants().slice(1))
      .join('text')
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .style('font-size', '10px')
      .text((d: any) => d.data.name)
  }, [data])

  return <svg ref={ref} width={400} height={400} />
}
