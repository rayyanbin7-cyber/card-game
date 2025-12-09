'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Card {
  _id: string;
  name: string;
  company: string;
  colors: string[];
  position?: string;
  isWildCard?: boolean;
}

interface Player {
  id: string;
  name: string;
  cards: string[];
}

interface Game {
  _id: string;
  players: Player[];
  currentCard: string;
  currentColors: string[];
  currentPlayerIndex: number;
  drawPile: string[];
  playedCards: string[];
  status: string;
  winner?: string;
}

export default function GamePage() {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [cards, setCards] = useState<{ [key: string]: Card }>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<string | null>(null);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isPickingUp, setIsPickingUp] = useState(false);

  const AVAILABLE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  const fetchGame = async () => {
    const res = await fetch(`/api/game/${params.id}`);
    const data = await res.json();
    setGame(data);
  };

  const fetchCards = async () => {
    const res = await fetch('/api/cards');
    const data = await res.json();
    const cardMap: { [key: string]: Card } = {};
    data.forEach((card: Card) => {
      cardMap[card._id] = card;
    });
    setCards(cardMap);
  };

  useEffect(() => {
    fetchGame();
    fetchCards();
    const interval = setInterval(fetchGame, 2000);
    return () => clearInterval(interval);
  }, [params.id]);

  useEffect(() => {
    if (game?.status === 'finished' && !showWinModal) {
      setTimeout(() => setShowWinModal(true), 500);
    }
  }, [game?.status]);

  const playCard = async (cardId: string, selectedColor?: string) => {
    if (!game) return;
    
    // Start animation
    setAnimatingCard(cardId);
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const playerId = game.players[game.currentPlayerIndex].id;
    const res = await fetch(`/api/game/${params.id}/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, cardId, selectedColor })
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || 'Cannot play this card');
      setAnimatingCard(null);
    } else {
      await fetchGame();
      setAnimatingCard(null);
      setShowColorPicker(false);
      setPendingWildCard(null);
    }
  };

  const handleCardClick = (cardId: string) => {
    if (animatingCard) return; // Prevent clicking during animation
    const card = cards[cardId];
    if (card?.isWildCard) {
      setPendingWildCard(cardId);
      setShowColorPicker(true);
    } else {
      playCard(cardId);
    }
  };

  const restartGame = async () => {
    setShowWinModal(false);
    const res = await fetch(`/api/game/${params.id}/restart`, {
      method: 'POST'
    });
    
    if (res.ok) {
      await fetchGame();
    } else {
      alert('Failed to restart game');
    }
  };

  const handleColorSelect = (color: string) => {
    if (pendingWildCard) {
      playCard(pendingWildCard, color);
    }
  };

  const pickupCard = async () => {
    if (!game || isPickingUp) return;
    setIsPickingUp(true);
    
    const playerId = game.players[game.currentPlayerIndex].id;
    const res = await fetch(`/api/game/${params.id}/pickup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId })
    });
    
    if (!res.ok) {
      const error = await res.json();
      alert(error.error || 'Cannot pick up card');
    } else {
      await fetchGame();
    }
    
    setIsPickingUp(false);
  };

  if (!game) return <div className="container">Loading...</div>;

  const currentCard = cards[game.currentCard];
  const currentPlayer = game.players[game.currentPlayerIndex];

  return (
    <div className="container">
      <div className="status-bar">
        <h2>Business Card Game</h2>
        {game.status === 'finished' ? (
          <p style={{ fontSize: '24px', color: '#667eea', marginTop: '10px' }}>
            🎉 {game.winner} Wins!
          </p>
        ) : (
          <p style={{ marginTop: '10px' }}>
            Current Turn: <strong>{game.players[game.currentPlayerIndex].name}</strong>
            <span style={{ marginLeft: '20px', color: '#666' }}>
              Draw Pile: {game.drawPile.length} cards
            </span>
            {game.drawPile.length === 0 && game.playedCards && game.playedCards.length > 0 && (
              <span style={{ marginLeft: '10px', color: '#FFA07A', fontWeight: 'bold' }}>
                ({game.playedCards.length} cards ready to reshuffle)
              </span>
            )}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {game.players.map((player: Player, idx: number) => (
          <div
            key={player.id}
            style={{
              background: game.currentPlayerIndex === idx ? '#667eea' : '#e0e0e0',
              color: game.currentPlayerIndex === idx ? 'white' : '#333',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: game.currentPlayerIndex === idx ? 'bold' : 'normal',
              border: game.currentPlayerIndex === idx ? '3px solid #5568d3' : '3px solid transparent',
              transition: 'all 0.3s'
            }}
          >
            {player.name} ({player.cards.length} cards)
            {game.currentPlayerIndex === idx && ' 👈'}
          </div>
        ))}
      </div>

      <div className="game-board">
        <div className="center-card" style={{ 
          borderRadius: currentCard?.isWildCard ? '50%' : '12px',
          width: currentCard?.isWildCard ? '200px' : 'auto',
          height: currentCard?.isWildCard ? '200px' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h3>Current Card</h3>
          {currentCard && (
            <>
              {currentCard.isWildCard ? (
                <>
                  <p style={{ fontSize: '48px', margin: '12px 0' }}>🃏</p>
                  <p style={{ fontWeight: 'bold' }}>WILD CARD</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '20px', marginTop: '12px' }}><strong>{currentCard.name}</strong></p>
                  <p style={{ color: '#666' }}>{currentCard.company}</p>
                </>
              )}
              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '12px', marginBottom: '6px' }}>Active Colors:</p>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {game.currentColors.map((color: string, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        width: '30px',
                        height: '30px',
                        background: color,
                        borderRadius: '6px',
                        border: '2px solid #333'
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <h3 style={{ color: 'white', marginBottom: '16px', textAlign: 'center', fontSize: '24px' }}>
            {currentPlayer.name}'s Turn
          </h3>
          <div className="player-hand">
            {currentPlayer.cards.map((cardId: string) => {
              const card = cards[cardId];
              if (!card) return null;
              
              const canPlay = game.status === 'active' && (
                card.isWildCard || 
                card.colors.some((c: string) => game.currentColors.includes(c))
              );
              
              return (
                <div
                  key={cardId}
                  className={`card ${!canPlay ? 'disabled' : ''} ${card.isWildCard ? 'wild-card' : ''} ${animatingCard === cardId ? 'card-flying' : ''}`}
                  onClick={() => canPlay && handleCardClick(cardId)}
                >
                  {card.isWildCard ? (
                    <>
                      <p style={{ fontSize: '36px' }}>🃏</p>
                      <p style={{ fontWeight: 'bold', fontSize: '12px' }}>WILD</p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{card.name}</p>
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{card.company}</p>
                      {card.position && <p style={{ fontSize: '11px', color: '#999' }}>{card.position}</p>}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '8px', justifyContent: 'center' }}>
                        {card.colors.map((color: string, idx: number) => (
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
              );
            })}
          </div>
          
          {game.status === 'active' && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={pickupCard} 
                disabled={isPickingUp}
                className={isPickingUp ? 'button-loading' : ''}
              >
                {isPickingUp ? 'Picking up...' : `Pick Up Card (${game.drawPile.length} left)`}
              </button>
            </div>
          )}
        </div>
      </div>

      {showColorPicker && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '20px' }}>Choose a Color</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              {AVAILABLE_COLORS.map((color: string) => (
                <div
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  style={{
                    width: '60px',
                    height: '60px',
                    background: color,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: '3px solid #333',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
            <button 
              onClick={() => {
                setShowColorPicker(false);
                setPendingWildCard(null);
              }}
              style={{ marginTop: '20px', background: '#ccc' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showWinModal && game?.status === 'finished' && (
        <div className="modal-overlay win-modal">
          <div className="modal-content win-content">
            <div className="confetti">🎉</div>
            <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#667eea' }}>
              {game.winner} Wins!
            </h1>
            <p style={{ fontSize: '24px', marginBottom: '30px' }}>
              🏆 Congratulations! 🏆
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={restartGame}
                style={{ 
                  padding: '15px 30px', 
                  fontSize: '18px',
                  background: '#667eea',
                  color: 'white'
                }}
              >
                Play Again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                style={{ 
                  padding: '15px 30px', 
                  fontSize: '18px',
                  background: '#4CAF50',
                  color: 'white'
                }}
              >
                New Players
              </button>
              <button 
                onClick={() => setShowWinModal(false)}
                style={{ 
                  padding: '15px 30px', 
                  fontSize: '18px',
                  background: '#ccc'
                }}
              >
                View Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
