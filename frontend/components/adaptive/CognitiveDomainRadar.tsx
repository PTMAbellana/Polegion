'use client';

import { useEffect, useRef } from 'react';

interface CognitiveDomainRadarProps {
  userId: string;
}

interface DomainPerformance {
  domain: string;
  score: number;
  attempts: number;
}

export default function CognitiveDomainRadar({ userId }: CognitiveDomainRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchAndRenderRadar();
  }, [userId]);

  const fetchAndRenderRadar = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`/api/adaptive/cognitive-performance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch cognitive performance');
        return;
      }

      const data = await response.json();
      if (data.success && data.data) {
        drawRadarChart(data.data);
      }
    } catch (error) {
      console.error('Error fetching cognitive performance:', error);
    }
  };

  const drawRadarChart = (performance: DomainPerformance[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Domain labels (shortened for radar chart)
    const labels = [
      'Knowledge\nRecall',
      'Concept\nUnderstanding',
      'Procedural\nSkills',
      'Analytical\nThinking',
      'Problem\nSolving',
      'Higher Order\nThinking'
    ];

    const domainMap: { [key: string]: string } = {
      'knowledge_recall': 'Knowledge\nRecall',
      'concept_understanding': 'Concept\nUnderstanding',
      'procedural_skills': 'Procedural\nSkills',
      'analytical_thinking': 'Analytical\nThinking',
      'problem_solving': 'Problem\nSolving',
      'higher_order_thinking': 'Higher Order\nThinking'
    };

    // Map performance to ordered array
    const scores = labels.map(label => {
      const domainKey = Object.keys(domainMap).find(key => domainMap[key] === label);
      const perf = performance.find(p => p.domain === domainKey);
      return perf ? perf.score : 0;
    });

    const numSides = labels.length;
    const angleStep = (Math.PI * 2) / numSides;

    // Draw concentric circles (grid)
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      const r = (radius / 5) * i;
      for (let j = 0; j <= numSides; j++) {
        const angle = angleStep * j - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axis lines
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    for (let i = 0; i < numSides; i++) {
      const angle = angleStep * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.stroke();
    }

    // Draw data polygon
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= numSides; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const score = scores[i % numSides];
      const r = (radius * score) / 100;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#3B82F6';
    for (let i = 0; i < numSides; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const score = scores[i];
      const r = (radius * score) / 100;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < numSides; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const labelRadius = radius + 25;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      const labelLines = labels[i].split('\n');
      labelLines.forEach((line, lineIndex) => {
        ctx.fillText(line, x, y + (lineIndex - 0.5) * 11);
      });

      // Draw score
      ctx.fillStyle = '#6B7280';
      ctx.font = 'bold 11px system-ui';
      const scoreY = y + (labelLines.length - 0.5) * 11 + 12;
      ctx.fillText(`${scores[i]}%`, x, scoreY);
      ctx.fillStyle = '#374151';
      ctx.font = '10px system-ui';
    }
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '16px'
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '12px',
        textAlign: 'center'
      }}>
        Cognitive Skills Profile
      </div>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{
          display: 'block',
          margin: '0 auto'
        }}
      />
      <div style={{
        fontSize: '9px',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: '8px'
      }}>
        Your mastery across different thinking skills
      </div>
    </div>
  );
}
