'use client';

import React from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';

interface PointIconProps {
  width?: number;
  height?: number;
}

export const PointIcon: React.FC<PointIconProps> = ({ width = 120, height = 80 }) => {
  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Point */}
        <Circle x={width / 2} y={height / 2 - 10} radius={6} fill="#E8F4FD" />
        {/* Label */}
        <Text
          x={width / 2 - 10}
          y={height / 2 + 10}
          text="A"
          fontSize={18}
          fill="#FFD700"
          fontStyle="bold"
        />
      </Layer>
    </Stage>
  );
};

export const LineSegmentIcon: React.FC<PointIconProps> = ({ width = 200, height = 80 }) => {
  const startX = 30;
  const endX = width - 30;
  const y = height / 2 - 5;

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Line */}
        <Line
          points={[startX, y, endX, y]}
          stroke="#E8F4FD"
          strokeWidth={3}
        />
        {/* Start point */}
        <Circle x={startX} y={y} radius={5} fill="#E8F4FD" />
        {/* End point */}
        <Circle x={endX} y={y} radius={5} fill="#E8F4FD" />
        
        {/* Labels - positioned below and slightly outside the points */}
        <Text
          x={startX - 8}
          y={y + 12}
          text="A"
          fontSize={16}
          fill="#FFD700"
          fontStyle="bold"
        />
        <Text
          x={endX - 5}
          y={y + 12}
          text="B"
          fontSize={16}
          fill="#FFD700"
          fontStyle="bold"
        />
        
        {/* Notation - Line segment bar above AB */}
        <Text
          x={width / 2 - 15}
          y={y - 30}
          text="AB"
          fontSize={14}
          fill="#FFD700"
        />
        <Line
          points={[width / 2 - 16, y - 32, width / 2 + 16, y - 32]}
          stroke="#FFD700"
          strokeWidth={2}
        />
      </Layer>
    </Stage>
  );
};

export const RayIcon: React.FC<PointIconProps> = ({ width = 200, height = 80 }) => {
  const startX = 30;
  const endX = width - 30;
  const y = height / 2 - 5;
  const arrowSize = 8;

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Line - stops before the arrow */}
        <Line
          points={[startX, y, endX - arrowSize, y]}
          stroke="#E8F4FD"
          strokeWidth={3}
        />
        {/* Start point */}
        <Circle x={startX} y={y} radius={5} fill="#E8F4FD" />
        
        {/* Arrow head - no gap */}
        <Line
          points={[
            endX - arrowSize, y - arrowSize,
            endX, y,
            endX - arrowSize, y + arrowSize
          ]}
          stroke="#E8F4FD"
          strokeWidth={3}
          lineCap="round"
          lineJoin="round"
        />
        
        {/* Labels - A at start point, B along the ray */}
        <Text
          x={startX - 8}
          y={y + 12}
          text="A"
          fontSize={16}
          fill="#FFD700"
          fontStyle="bold"
        />
        <Text
          x={startX + 50}
          y={y + 12}
          text="B"
          fontSize={16}
          fill="#FFD700"
          fontStyle="bold"
        />
        
        {/* Notation - Ray arrow over AB */}
        <Text
          x={width / 2 - 15}
          y={y - 30}
          text="AB"
          fontSize={14}
          fill="#FFD700"
        />
        {/* Arrow above the text */}
        <Line
          points={[width / 2 - 16, y - 32, width / 2 + 20, y - 32]}
          stroke="#FFD700"
          strokeWidth={2}
        />
        <Line
          points={[
            width / 2 + 16, y - 35,
            width / 2 + 20, y - 32,
            width / 2 + 16, y - 29
          ]}
          stroke="#FFD700"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      </Layer>
    </Stage>
  );
};

export const LineIcon: React.FC<PointIconProps> = ({ width = 200, height = 80 }) => {
  const startX = 30;
  const endX = width - 30;
  const y = height / 2 - 5;
  const arrowSize = 8;

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Line - between the two arrows */}
        <Line
          points={[startX + arrowSize, y, endX - arrowSize, y]}
          stroke="#E8F4FD"
          strokeWidth={3}
        />
        
        {/* Left arrow head - no gap */}
        <Line
          points={[
            startX + arrowSize, y - arrowSize,
            startX, y,
            startX + arrowSize, y + arrowSize
          ]}
          stroke="#E8F4FD"
          strokeWidth={3}
          lineCap="round"
          lineJoin="round"
        />
        
        {/* Right arrow head - no gap */}
        <Line
          points={[
            endX - arrowSize, y - arrowSize,
            endX, y,
            endX - arrowSize, y + arrowSize
          ]}
          stroke="#E8F4FD"
          strokeWidth={3}
          lineCap="round"
          lineJoin="round"
        />
        
        {/* Labels - positioned along the line */}
        <Text
          x={width / 2 - 60}
          y={y + 12}
          text="A"
          fontSize={16}
          fill="#FFD700"
          fontStyle="bold"
        />
        <Text
          x={width / 2 + 45}
          y={y + 12}
          text="B"
          fontSize={16}
          fill="#FFD700"
          fontStyle="bold"
        />
        
        {/* Notation - Double arrow over AB */}
        <Text
          x={width / 2 - 15}
          y={y - 30}
          text="AB"
          fontSize={14}
          fill="#FFD700"
        />
        {/* Left arrow */}
        <Line
          points={[width / 2 - 16, y - 32, width / 2 - 26, y - 32]}
          stroke="#FFD700"
          strokeWidth={2}
        />
        <Line
          points={[
            width / 2 - 22, y - 35,
            width / 2 - 26, y - 32,
            width / 2 - 22, y - 29
          ]}
          stroke="#FFD700"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
        {/* Right arrow */}
        <Line
          points={[width / 2 + 16, y - 32, width / 2 + 26, y - 32]}
          stroke="#FFD700"
          strokeWidth={2}
        />
        <Line
          points={[
            width / 2 + 22, y - 35,
            width / 2 + 26, y - 32,
            width / 2 + 22, y - 29
          ]}
          stroke="#FFD700"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      </Layer>
    </Stage>
  );
};
