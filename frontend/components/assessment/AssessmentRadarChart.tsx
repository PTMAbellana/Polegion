"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface CategoryScore {
  correct: number;
  total: number;
  percentage: number;
}

interface RadarChartProps {
  currentScores: Record<string, CategoryScore>;
  pretestScores?: Record<string, CategoryScore> | null;
}

interface ChartDataPoint {
  category: string;
  fullMark: number;
  current?: number;
  pretest?: number;
}

/**
 * AssessmentRadarChart - Visualizes category scores in radar chart format
 * Shows comparison between pretest (if available) and current results
 */
const AssessmentRadarChart = ({ currentScores, pretestScores = null }: RadarChartProps) => {
  // Transform category scores into radar chart data
  const categories = [
    "Knowledge Recall",
    "Concept Understanding",
    "Procedural Skills",
    "Analytical Thinking",
    "Problem-Solving",
    "Higher-Order Thinking",
  ];

  const chartData: ChartDataPoint[] = categories.map((category) => {
    const dataPoint: ChartDataPoint = {
      category: category.replace(" ", "\n"), // Line break for better display
      fullMark: 100,
    };

    // Add current test scores
    if (currentScores && currentScores[category]) {
      dataPoint.current = currentScores[category].percentage;
    }

    // Add pretest scores if available (for posttest comparison)
    if (pretestScores && pretestScores[category]) {
      dataPoint.pretest = pretestScores[category].percentage;
    }

    return dataPoint;
  });

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#4a5568" strokeWidth={1} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#fff", fontSize: 12 }}
            style={{ fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#a0aec0", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2d3748",
              border: "1px solid #4a5568",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value, name) => [
              `${typeof value === 'number' ? value.toFixed(1) : value}%`,
              name === "current"
                ? "Current Score"
                : name === "pretest"
                ? "Pretest Score"
                : name,
            ]}
          />
          {pretestScores && (
            <Radar
              name="Pretest"
              dataKey="pretest"
              stroke="#60a5fa"
              fill="#60a5fa"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          )}
          <Radar
            name={pretestScores ? "Posttest" : "Current"}
            dataKey="current"
            stroke="#fbbf24"
            fill="#fbbf24"
            fillOpacity={0.5}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Category legend with scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
        {categories.map((category) => {
          const currentScore = currentScores?.[category];
          const pretestScore = pretestScores?.[category];

          return (
            <div
              key={category}
              style={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                borderRadius: '6px',
                padding: '0.5rem',
                border: '1px solid #374151'
              }}
            >
              <h4 style={{ fontSize: '0.7rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.25rem' }}>
                {category}
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {pretestScore && (
                  <div style={{ fontSize: '0.625rem' }}>
                    <span style={{ color: '#60a5fa' }}>Pretest: </span>
                    <span style={{ color: 'white', fontWeight: 700 }}>
                      {pretestScore.percentage.toFixed(1)}%
                    </span>
                  </div>
                )}
                <div style={{ fontSize: '0.625rem' }}>
                  <span style={{ color: pretestScore ? '#fbbf24' : '#60a5fa' }}>
                    {pretestScore ? "Posttest: " : "Score: "}
                  </span>
                  <span style={{ color: 'white', fontWeight: 700 }}>
                    {currentScore?.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              {pretestScore && currentScore && (
                <div style={{ marginTop: '0.125rem', fontSize: '0.625rem' }}>
                  <span style={{ color: '#9ca3af' }}>Improvement: </span>
                  <span
                    style={{
                      color: currentScore.percentage - pretestScore.percentage >= 0 ? '#34d399' : '#f87171',
                      fontWeight: 700
                    }}
                  >
                    {currentScore.percentage - pretestScore.percentage >= 0 ? "+" : ""}
                    {(currentScore.percentage - pretestScore.percentage).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentRadarChart;
