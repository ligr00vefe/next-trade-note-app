"use client"

import React, { useState, useRef, useEffect } from "react"
import * as d3 from "d3"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import styles from './InfoClient.module.scss'
import Container from "@/components/ui/Container"

// d3 버블 차트와 recharts 꺾은선 차트는 별도 컴포넌트로 분리 예정
// (임시로 내부에 작성, 추후 분리)

// props 타입 정의
interface Issue {
  name: string
  related: string[]
  weight: number
}
interface Stock {
  date: string
  [key: string]: number | string
}
interface InfoClientProps {
  issues: Issue[]
  stocks: Stock[]
}

const BUBBLE_SIZE = 400

// hoveredTheme에 해당하는 종목 등락률 데이터 변환 함수
type LineChartData = { date: string; [stock: string]: number | string }
const getLineChartData = (theme: string, issues: Issue[], stocks: Stock[]): LineChartData[] => {
  // 해당 테마의 관련 종목 추출
  const themeObj = issues.find(i => i.name === theme)
  if (!themeObj) return []
  // 관련 종목 최대 5개만
  const relatedStocks = themeObj.related.slice(0, 5)
  // stocks 배열에서 관련 종목만 추출
  return stocks.map(stock => {
    const entry: LineChartData = { date: stock.date }
    relatedStocks.forEach(name => {
      if (stock[name] !== undefined) entry[name] = stock[name]
    })
    return entry
  })
}

const InfoClient: React.FC<InfoClientProps> = ({ issues, stocks }) => {
  const [hoveredTheme, setHoveredTheme] = useState<string>(issues[0]?.name || "")
  const svgRef = useRef<SVGSVGElement>(null)

  // d3 버블 차트 렌더링
  useEffect(() => {
    if (!issues.length) return
    const root = d3.hierarchy<{ children: Issue[] } | Issue>({ children: issues })
      .sum((d: any) => (d as Issue).weight || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))
    const pack = d3.pack<{ children: Issue[] } | Issue>().size([BUBBLE_SIZE, BUBBLE_SIZE]).padding(10)
    const nodes = pack(root).leaves() as d3.HierarchyCircularNode<Issue>[]

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // 버블(원) 그리기
    svg.selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .attr("fill", (d) => hoveredTheme === d.data.name ? "#ffb300" : "#ff6b6b")
      .attr("stroke", "#fff")
      .attr("tabindex", 0)
      .attr("aria-label", (d) => d.data.name)
      .style("cursor", "pointer")
      .on("mouseenter", function (_: any, d) { setHoveredTheme(d.data.name) })
      .on("focus", function (_: any, d) { setHoveredTheme(d.data.name) })
      .on("mouseleave", function () { setHoveredTheme(issues[0]?.name || "") })
      .on("keydown", function (event: any, d) {
        if (event.key === "Enter" || event.key === " ") setHoveredTheme(d.data.name)
      })

    // 텍스트(테마명) 그리기
    svg.selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .style("font-size", (d) => `${Math.max(12, d.r / 3)}px`)
      .style("pointer-events", "none")
      .style("fill", "#fff")
      .text((d) => d.data.name)
  }, [issues, hoveredTheme])

  // recharts용 데이터 변환
  const lineChartData = getLineChartData(hoveredTheme, issues, stocks)
  const themeObj = issues.find(i => i.name === hoveredTheme)
  const relatedStocks = themeObj ? themeObj.related.slice(0, 5) : []

  return (
    <Container>
        <h1>AI 이슈포착</h1>
        <div className={styles["info-container"]}>
            <div className={styles["info-content-row"]}>
                {/* 왼쪽: d3 버블 차트 */}
                <div className={styles["bubble-chart-area"]}>
                <svg
                    ref={svgRef}
                    width={BUBBLE_SIZE}
                    height={BUBBLE_SIZE}
                    className={styles["bubble-chart-svg"]}
                    aria-label="테마별 버블 차트"
                />
                </div>
                {/* 오른쪽: recharts 꺾은선 차트 */}
                <div className={styles["line-chart-area"]}>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {relatedStocks.map(stock => (
                        <Line key={stock} type="monotone" dataKey={stock} stroke="#8884d8" dot={false} />
                    ))}
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
        </div>
    </Container>    
  )
}

export default InfoClient
