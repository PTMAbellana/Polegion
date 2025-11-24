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
    <div className="w-full h-[500px] flex flex-col items-center">
      <ResponsiveContainer width="100%" height="100%">
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
      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-3xl px-4">
        {categories.map((category) => {
          const currentScore = currentScores?.[category];
          const pretestScore = pretestScores?.[category];

          return (
            <div
              key={category}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
            >
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                {category}
              </h4>
              <div className="flex justify-between items-center">
                {pretestScore && (
                  <div className="text-xs">
                    <span className="text-blue-400">Pretest: </span>
                    <span className="text-white font-bold">
                      {pretestScore.percentage.toFixed(1)}%
                    </span>
                  </div>
                )}
                <div className="text-xs">
                  <span className={pretestScore ? "text-yellow-400" : "text-blue-400"}>
                    {pretestScore ? "Posttest: " : "Score: "}
                  </span>
                  <span className="text-white font-bold">
                    {currentScore?.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              {pretestScore && currentScore && (
                <div className="mt-1 text-xs">
                  <span className="text-gray-400">Improvement: </span>
                  <span
                    className={
                      currentScore.percentage - pretestScore.percentage >= 0
                        ? "text-green-400 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    {currentScore.percentage - pretestScore.percentage >= 0
                      ? "+"
                      : ""}
                    {(
                      currentScore.percentage - pretestScore.percentage
                    ).toFixed(1)}
                    %
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
