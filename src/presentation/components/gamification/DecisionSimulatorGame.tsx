import { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import type { DecisionSimulatorItem } from '../../../domain/entities/AgenticContent';

interface Props {
  game: DecisionSimulatorItem;
}

export function DecisionSimulatorGame({ game }: Props) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const selectedChoice = game.choices.find((c) => c.id === selectedChoiceId);

  const handleSelectChoice = (id: string) => {
    setSelectedChoiceId(id);
    const choice = game.choices.find((c) => c.id === id);
    if (choice?.isOptimal) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setSelectedChoiceId(null);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Sparkles size={20} color="#f59e0b" />
          <h4 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Simulador de Decisiones en Vivo</h4>
        </div>

        {selectedChoiceId && (
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
            <RefreshCw size={14} /> Probar otra opción
          </button>
        )}
      </div>

      {/* Scenario Card */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '1.2rem',
          padding: '1.6rem 2rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <HelpCircle size={22} color="#fbbf24" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em' }}>
              Situación Real
            </span>
            <p style={{ fontSize: '1.5rem', color: '#f8fafc', fontWeight: 500, margin: '0.6rem 0 0', lineHeight: 1.5 }}>
              {game.scenario}
            </p>
          </div>
        </div>
      </div>

      {/* Choices Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
        {game.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;

          return (
            <button
              key={choice.id}
              onClick={() => handleSelectChoice(choice.id)}
              style={{
                textAlign: 'left',
                padding: '1.4rem 1.8rem',
                borderRadius: '1rem',
                background: isSelected
                  ? choice.isOptimal
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? choice.isOptimal
                    ? '1px solid #10b981'
                    : '1px solid #ef4444'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f8fafc',
                fontSize: '1.4rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{choice.optionText}</span>
              {isSelected && (
                choice.isOptimal ? <CheckCircle size={20} color="#10b981" /> : <AlertTriangle size={20} color="#ef4444" />
              )}
            </button>
          );
        })}
      </div>

      {/* Outcome Feedback */}
      {selectedChoice && (
        <div
          style={{
            padding: '1.6rem 2rem',
            borderRadius: '1.2rem',
            background: selectedChoice.isOptimal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: selectedChoice.isOptimal ? '1px solid #10b981' : '1px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: selectedChoice.isOptimal ? '#34d399' : '#f87171' }}>
              Resultado del Escenario
            </span>
            <p style={{ fontSize: '1.4rem', margin: '0.4rem 0 0', color: '#f8fafc', fontWeight: 600 }}>
              {selectedChoice.outcome}
            </p>
          </div>

          <div
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '0.8rem',
              background: 'rgba(0,0,0,0.3)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: selectedChoice.score > 0 ? '#34d399' : '#f87171'
            }}
          >
            {selectedChoice.score > 0 ? `+${selectedChoice.score}` : selectedChoice.score} pts
          </div>
        </div>
      )}
    </div>
  );
}
