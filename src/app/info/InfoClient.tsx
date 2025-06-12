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
}
// stocks 타입 변경
interface StocksByDate {
  [date: string]: {
    [issueName: string]: {
      [stockName: string]: number
    }
  }
}
interface InfoClientProps {
  issues: StocksByDate
}

const BUBBLE_SIZE = 400

interface IssueWithAveragePrice extends Issue {
  averagePrice: number
}

// IssuesByDate 타입 정의
interface IssuesByDate {
  [date: string]: {
    [issueName: string]: {
      [stockName: string]: number
    }
  }
}

// hoveredTheme에 해당하는 종목 등락률 데이터 변환 함수
// (이슈명, 종목명, 날짜별로 데이터 추출)
type LineChartData = { date: string; [stock: string]: number | string }
const getLineChartData = (
  theme: string,
  issues: StocksByDate
): LineChartData[] => {
  const dates = Object.keys(issues).sort()
  // 최신 날짜의 이슈에서 종목명 추출
  const latestDate = dates[dates.length - 1]
  const relatedStocks = Object.keys(issues[latestDate][theme] || {}).slice(0, 5)
  return dates.map(date => {
    const entry: LineChartData = { date }
    const issueStocks = issues[date]?.[theme] || {}
    relatedStocks.forEach(name => {
      if (issueStocks[name] !== undefined) entry[name] = issueStocks[name]
    })
    return entry
  })
}

const InfoClient: React.FC<InfoClientProps> = ({ issues }) => {
  // 최신 날짜, 이슈명 목록
  const dates = Object.keys(issues).sort()
  const latestDate = dates[dates.length - 1]
  const issueNames = Object.keys(issues[latestDate] || {})
  const [hoveredTheme, setHoveredTheme] = useState<string>(issueNames[0] || "")
  const svgRef = useRef<SVGSVGElement>(null)
  const [bubbleNodes, setBubbleNodes] = useState<d3.HierarchyCircularNode<any>[]>([])

  // d3 버블 차트 렌더링
  useEffect(() => {
    if (!issueNames.length) return
    const latestStockData = issues[latestDate]
    if (!latestStockData) return

    // 각 이슈의 관련 주식들의 최신 기준 평균 가격 계산
    const issuesWithAveragePrice = issueNames.map(issueName => {
      const stockPrices = Object.values(latestStockData[issueName] || {})
      const averagePrice =
        stockPrices.length > 0
          ? stockPrices.reduce((sum, price) => sum + price, 0) / stockPrices.length
          : 0
      return {
        name: issueName,
        related: Object.keys(latestStockData[issueName] || {}),
        averagePrice
      }
    })

    // d3.pack() 설정
    const root = d3
      .hierarchy({ children: issuesWithAveragePrice } as any)
      .sum(d => (d as any).averagePrice || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    const pack = d3.pack().size([BUBBLE_SIZE, BUBBLE_SIZE]).padding(50)
    const nodes = pack(root).descendants().slice(1)
    setBubbleNodes(nodes as any)
  }, [issues, latestDate])

  if (!bubbleNodes.length) return null

  // recharts용 데이터 변환
  const lineChartData = getLineChartData(hoveredTheme, issues)
  const relatedStocks = Object.keys(issues[latestDate][hoveredTheme] || {}).slice(0, 5)

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
            >
              <g transform={`translate(${BUBBLE_SIZE / 2},${BUBBLE_SIZE / 2})`}>
                {bubbleNodes.map((node: any, index) => (
                  <g
                    key={node.data.name}
                    transform={`translate(${node.x - BUBBLE_SIZE / 2},${node.y - BUBBLE_SIZE / 2})`}
                    onMouseEnter={e => {
                      e.stopPropagation()
                      setHoveredTheme(node.data.name)
                    }}
                    onFocus={e => {
                      e.stopPropagation()
                      setHoveredTheme(node.data.name)
                    }}
                    onMouseLeave={e => {
                      e.stopPropagation()
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setHoveredTheme(node.data.name)
                      }
                    }}
                  >
                    <circle
                      r={Math.max(node.r, 30)} // 최소 반지름 30px 보장
                      fill={node.data.name === hoveredTheme ? "#2563eb" : "#3b82f6"}
                      opacity={0.8}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      dy=".3em"
                      textAnchor="middle"
                      fill="white"
                      fontSize={12}
                      style={{ pointerEvents: "none" }}
                    >
                      {node.data.name}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
          {/* 오른쪽: recharts 꺾은선 차트 */}
          <div className={styles["line-chart-area"]}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" stroke="#666" tick={{ fill: "#666" }} />
                <YAxis stroke="#666" tick={{ fill: "#666" }} tickFormatter={value => `${value}%`} />
                <Tooltip formatter={(value: number) => [`${value}%`, "등락률"]} labelFormatter={label => `날짜: ${label}`} />
                <Legend />
                {relatedStocks.map((stock, index) => (
                  <Line
                    key={stock}
                    type="monotone"
                    dataKey={stock}
                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
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