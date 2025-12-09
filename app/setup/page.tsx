'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

export default function SetupPage() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [form, setForm] = useState({ 
    name: '', 
    company: '', 
    colors: [] as string[], 
    position: '',
    isWildCard: false 
  });

  const fetchCards = async () => {
    const res = await fetch('/api/cards');
    const data = await res.json();
    setCards(data);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const toggleColor = (color: string) => {
    if (form.isWildCard) return; // Wild cards don't need colors
    
    if (form.colors.includes(color)) {
      setForm({ ...form, colors: form.colors.filter((c: string) => c !== color) });
    } else {
      setForm({ ...form, colors: [...form.colors, color] });
    }
  };

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.isWildCard && form.colors.length === 0) {
      alert('Please select at least one color');
      return;
    }
    
    const cardData = form.isWildCard 
      ? { name: form.name, company: form.company, colors: [], isWildCard: true }
      : { ...form };
    
    await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData)
    });
    setForm({ name: '', company: '', colors: [], position: '', isWildCard: false });
    fetchCards();
  };

  return (
    <div className="container">
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '800px', margin: '50px auto' }}>
        <h1 style={{ marginBottom: '30px' }}>Setup Business Cards</h1>
        
        <form onSubmit={addCard} style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.isWildCard}
                onChange={(e) => setForm({ ...form, isWildCard: e.target.checked, colors: [] })}
              />
              <span>Wild Card (Circle Shape)</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            required
          />
          {!form.isWildCard && (
            <input
              type="text"
              placeholder="Position (optional)"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
          )}
          
          {!form.isWildCard && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Colors (select 1-3):
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {COLORS.map(color => (
                  <div
                    key={color}
                    onClick={() => toggleColor(color)}
                    style={{
                      width: '50px',
                      height: '50px',
                      background: color,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: form.colors.includes(color) ? '4px solid #333' : '4px solid transparent',
                      position: 'relative'
                    }}
                  >
                    {form.colors.includes(color) && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        fontSize: '24px'
                      }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Selected: {form.colors.length} color(s)
              </p>
            </div>
          )}

          <button type="submit" style={{ width: '100%' }}>
            {form.isWildCard ? 'Add Wild Card' : 'Add Business Card'}
          </button>
        </form>

        <h2 style={{ marginBottom: '20px' }}>Cards in Database ({cards.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
          {cards.map((card: any) => (
            <div 
              key={card._id} 
              className={`card ${card.isWildCard ? 'wild-card' : ''}`}
              style={{ 
                borderRadius: card.isWildCard ? '50%' : '12px',
                width: card.isWildCard ? '150px' : 'auto',
                height: card.isWildCard ? '150px' : 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {card.isWildCard ? (
                <>
                  <p style={{ fontSize: '48px' }}>🃏</p>
                  <p style={{ fontWeight: 'bold', fontSize: '12px' }}>WILD</p>
                </>
              ) : (
                <>
                  <p style={{ fontWeight: 'bold' }}>{card.name}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{card.company}</p>
                  {card.position && <p style={{ fontSize: '11px', color: '#999' }}>{card.position}</p>}
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px', justifyContent: 'center' }}>
                    {card.colors?.map((color: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          width: '20px',
                          height: '20px',
                          background: color,
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => router.push('/')} style={{ marginTop: '30px', width: '100%' }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
