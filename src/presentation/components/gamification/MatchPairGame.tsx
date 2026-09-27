import { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import type { MatchPairGameItem } from '../../../domain/entities/AgenticContent';

interface Props {
  game: MatchPairGameItem;
}

export function MatchPairGame({ game }: Props) {
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<{ termId: string; defId: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shuffle definitions for gameplay
  const [shuffledDefs] = useState(() =>
    [...game.pairs].sort(() => Math.random() - 0.5)
  );

  const handleTermClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedTermId(id);
    setWrongPair(null);
  };

  const handleDefClick = (defId: string) => {
    if (!selectedTermId || matchedIds.includes(defId)) return;

    if (selectedTermId === defId) {
      // Correct Match!
      const nextMatched = [...matchedIds, defId];
      setMatchedIds(nextMatched);
      setSelectedTermId(null);
      setWrongPair(null);

      if (nextMatched.length === game.pairs.length) {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    } else {
      // Wrong Match
      setWrongPair({ termId: selectedTermId, defId });
      setTimeout(() => {
        setSelectedTermId(null);
        setWrongPair(null);
      }, 700);
    }
  };

  const handleReset = () => {
    setSelectedTermId(null);
    setMatchedIds([]);
    setWrongPair(null);
    setIsCompleted(false);
  };

  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '1.6rem',
        padding: '2.4rem',
        backdropFilter: 'blur(12px)',
        color: '#f8fafc'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Sparkles size={20} color="#38bdf8" />
            <h4 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{game.title}</h4>
          </div>
          <p style={{ fontSize: '1.3rem', color: '#94a3b8', margin: '0.4rem 0 0' }}>{game.instructions}</p>
        </div>

        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.6rem 1.2rem',
            borderRadius: '0.8rem',
            color: '#cbd5e1',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} /> Reiniciar
        </button>
      </div>

      {isCompleted ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.2rem 1.6rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '1.2rem'
          }}
        >
          <Trophy size={48} color="#10b981" style={{ margin: '0 auto 1.2rem' }} />
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', margin: '0 0 0.8rem' }}>
            ¡Enhorabuena! Has emparejado todos los conceptos
          </h3>
          <p style={{ fontSize: '1.4rem', color: '#94a3b8', maxWidth: '50rem', margin: '0 auto 1.6rem' }}>
            Has consolidado la comprensión estructural de esta lección con éxito.
          </p>
          <button
            onClick={handleReset}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              padding: '1rem 2.4rem',
              borderRadius: '0.8rem',
              fontWeight: 700,
              fontSize: '1.4rem',
              cursor: 'pointer'
            }}
          >
            Jugar otra vez
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Terms Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.05em' }}>
              Términos
            </span>
            {game.pairs.map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedTermId === p.id;
              const isWrong = wrongPair?.termId === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => handleTermClick(p.id)}
                  style={{
                    padding: '1.4rem 1.6rem',
                    borderRadius: '1rem',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    cursor: isMatched ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isMatched
                      ? 'rgba(16, 185, 129, 0.15)'
                      : isWrong
                      ? 'rgba(239, 68, 68, 0.25)'
                      : isSelected
                      ? 'rgba(56, 189, 248, 0.25)'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isMatched
                      ? '1px solid #10b981'
                      : isWrong
                      ? '1px solid #ef4444'
                      : isSelected
                      ? '1px solid #38bdf8'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isMatched ? '#34d399' : '#f8fafc',
                    opacity: isMatched ? 0.6 : 1,
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <span>{p.term}</span>
                  {isMatched && <CheckCircle2 size={18} color="#10b981" />}
                </div>
              );
            })}
          </div>

          {/* Definitions Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', color: '#a78bfa', letterSpacing: '0.05em' }}>
              Definiciones
            </span>
            {shuffledDefs.map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isWrong = wrongPair?.defId === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => handleDefClick(p.id)}
                  style={{
                    padding: '1.4rem 1.6rem',
                    borderRadius: '1rem',
                    fontSize: '1.3rem',
                    cursor: isMatched ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    background: isMatched
                      ? 'rgba(16, 185, 129, 0.15)'
                      : isWrong
                      ? 'rgba(239, 68, 68, 0.25)'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isMatched
                      ? '1px solid #10b981'
                      : isWrong
                      ? '1px solid #ef4444'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isMatched ? '#34d399' : '#cbd5e1',
                    opacity: isMatched ? 0.6 : 1
                  }}
                >
                  {p.definition}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
