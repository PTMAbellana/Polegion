'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Chapter4Page() {
  const router = useRouter();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Castle 5 - Floor 4: The Core of Volumes</h1>
      <p>Chapter content coming soon...</p>
      <button 
        onClick={() => router.push('/student/worldmap/castle5')}
        style={{ 
          padding: '0.75rem 1.5rem', 
          marginTop: '1rem', 
          cursor: 'pointer',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1rem'
        }}
      >
        Back to Castle
      </button>
    </div>
  );
}
