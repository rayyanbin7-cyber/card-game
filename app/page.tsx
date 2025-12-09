'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const startGame = async () => {
    // Filter out empty names
    const activePlayers = playerNames.filter((name: string) => name.trim());
    
    if (activePlayers.length < 2) {
      alert('Please enter at least 2 player names');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerNames: activePlayers })
      });

      if (!res.ok) throw new Error('Failed to create game');

      const game = await res.json();
      router.push(`/game/${game._id}`);
    } catch (error) {
      alert('Failed to start game. Make sure cards are in the database.');
      setLoading(false);
    }
  };

  const activeCount = playerNames.filter((name: string) => name.trim()).length;

  return (
    <div className="container">
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '500px', margin: '100px auto' }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Business Card Game</h1>
        
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          Enter 2-4 player names (minimum 2 required)
        </p>

        <div style={{ marginBottom: '30px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder={`Player ${i + 1} Name${i < 2 ? ' (Required)' : ' (Optional)'}`}
                value={playerNames[i]}
                onChange={(e) => handleNameChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginBottom: '16px', color: activeCount >= 2 ? '#4CAF50' : '#f44336' }}>
          {activeCount} player{activeCount !== 1 ? 's' : ''} {activeCount >= 2 ? '✓' : '(need at least 2)'}
        </p>

        <button onClick={startGame} disabled={loading || activeCount < 2} style={{ width: '100%' }}>
          {loading ? 'Starting...' : 'Start Game'}
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/setup" style={{ color: '#667eea', textDecoration: 'none' }}>
            Setup Cards First
          </a>
        </div>
      </div>
    </div>
  );
}
