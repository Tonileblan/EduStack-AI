import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import type { OrderStepsGameItem } from '../../../domain/entities/AgenticContent';

interface Props {
  game: OrderStepsGameItem;
}

export function OrderStepsGame({ game }: Props) {
  // Shuffle steps initially
  const [currentOrder, setCurrentOrder] = useState<string[]>(() =>
    [...game.correctSteps].sort(() => Math.random() - 0.5)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentOrder.length) return;
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setCurrentOrder(newOrder);
    setIsSubmitted(false);
  };

  const handleVerify = () => {
    const isCorrect = currentOrder.every((step, idx) => step === game.correctSteps[idx]);
    setIsSubmitted(true);
    setIsAllCorrect(isCorrect);

    if (isCorrect) {
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setCurrentOrder([...game.correctSteps].sort(() => Math.random() - 0.5));
    setIsSubmitted(false);
    setIsAllCorrect(false);
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
            <Sparkles size={20} color="#a855f7" />
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
          <RefreshCw size={14} /> Barajar
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {currentOrder.map((step, idx) => {
          const isCorrectPosition = isSubmitted && step === game.correctSteps[idx];
          const isWrongPosition = isSubmitted && step !== game.correctSteps[idx];

          return (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.2rem 1.6rem',
                borderRadius: '1rem',
                background: isCorrectPosition
                  ? 'rgba(16, 185, 129, 0.2)'
                  : isWrongPosition
                  ? 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isCorrectPosition
                  ? '1px solid #10b981'
                  : isWrongPosition
                  ? '1px solid #ef4444'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <span
                  style={{
                    width: '2.8rem',
                    height: '2.8rem',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#e2e8f0'
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 500, color: '#f8fafc' }}>{step}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, idx - 1)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: idx === 0 ? '#475569' : '#e2e8f0',
                    width: '3.2rem',
                    height: '3.2rem',
                    borderRadius: '0.6rem',
                    cursor: idx === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}
                >
                  ▲
                </button>
                <button
                  disabled={idx === currentOrder.length - 1}
                  onClick={() => moveItem(idx, idx + 1)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: idx === currentOrder.length - 1 ? '#475569' : '#e2e8f0',
                    width: '3.2rem',
                    height: '3.2rem',
                    borderRadius: '0.6rem',
                    cursor: idx === currentOrder.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {isSubmitted && isAllCorrect && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#34d399', fontWeight: 700 }}>
              <Trophy size={20} /> ¡Secuencia perfecta! Has ordenado el proceso correctamente.
            </div>
          )}
          {isSubmitted && !isAllCorrect && (
            <div style={{ color: '#f87171', fontSize: '1.3rem', fontWeight: 600 }}>
              Algunos pasos están desordenados. Revisa el flujo y vuelve a comprobar.
            </div>
          )}
        </div>

        <button
          onClick={handleVerify}
          style={{
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            color: '#ffffff',
            border: 'none',
            padding: '1rem 2.4rem',
            borderRadius: '0.8rem',
            fontWeight: 700,
            fontSize: '1.4rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          <Check size={18} /> Comprobar Orden
        </button>
      </div>
    </div>
  );
}
