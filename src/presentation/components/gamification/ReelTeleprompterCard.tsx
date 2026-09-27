import { useState } from 'react';
import { Video, Copy, Check, Clock, Film, Eye } from 'lucide-react';
import type { ReelScriptItem } from '../../../domain/entities/AgenticContent';

interface Props {
  reel: ReelScriptItem;
}

export function ReelTeleprompterCard({ reel }: Props) {
  const [copied, setCopied] = useState(false);
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reel.teleprompterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '1.6rem',
        padding: '2.4rem',
        backdropFilter: 'blur(12px)',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.6rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Video size={20} color="#f43f5e" />
          <h4 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>{reel.title}</h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '1.2rem' }}>
          <Clock size={14} />
          <span>{reel.durationSeconds}s</span>
        </div>
      </div>

      {/* Script Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Hook */}
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            borderLeft: '4px solid #f43f5e',
            padding: '1.2rem 1.6rem',
            borderRadius: '0 0.8rem 0.8rem 0'
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fb7185', textTransform: 'uppercase' }}>
            1. Gancho Visual / Hook (0-5s)
          </span>
          <p style={{ fontSize: '1.4rem', fontWeight: 600, color: '#f8fafc', margin: '0.4rem 0 0' }}>
            {reel.hook}
          </p>
        </div>

        {/* Problem & Solution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '1.2rem 1.4rem',
              borderRadius: '0.8rem'
            }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
              2. El Dolor / Problema
            </span>
            <p style={{ fontSize: '1.3rem', color: '#cbd5e1', margin: '0.4rem 0 0' }}>{reel.problem}</p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '1.2rem 1.4rem',
              borderRadius: '0.8rem'
            }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
              3. Solución del Curso
            </span>
            <p style={{ fontSize: '1.3rem', color: '#cbd5e1', margin: '0.4rem 0 0' }}>{reel.solution}</p>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderLeft: '4px solid #10b981',
            padding: '1.2rem 1.6rem',
            borderRadius: '0 0.8rem 0.8rem 0'
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
            4. Llamada a la Acción (CTA)
          </span>
          <p style={{ fontSize: '1.3rem', fontWeight: 600, color: '#f8fafc', margin: '0.4rem 0 0' }}>
            {reel.callToAction}
          </p>
        </div>
      </div>

      {/* B-Roll Suggestions */}
      <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1.2rem 1.6rem', borderRadius: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <Film size={14} color="#94a3b8" />
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Tomas de Apoyo (B-Roll Sugerido)
          </span>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.8rem', fontSize: '1.2rem', color: '#cbd5e1' }}>
          {reel.bRollSuggestions.map((b, idx) => (
            <li key={idx} style={{ marginBottom: '0.4rem' }}>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem' }}>
        <button
          onClick={() => setShowTeleprompter(!showTeleprompter)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.8rem 1.4rem',
            borderRadius: '0.8rem',
            color: '#e2e8f0',
            fontSize: '1.3rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Eye size={16} /> {showTeleprompter ? 'Ocultar Teleprompter' : 'Modo Teleprompter'}
        </button>

        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: copied ? '#10b981' : 'linear-gradient(135deg, #f43f5e, #e11d48)',
            border: 'none',
            padding: '0.8rem 1.6rem',
            borderRadius: '0.8rem',
            color: '#ffffff',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? '¡Copiado!' : 'Copiar Guion'}
        </button>
      </div>

      {/* Teleprompter Box */}
      {showTeleprompter && (
        <div
          style={{
            background: '#000000',
            border: '1px solid #f43f5e',
            borderRadius: '1.2rem',
            padding: '2rem',
            color: '#ffffff',
            fontSize: '1.8rem',
            lineHeight: 1.6,
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '0.02em',
            boxShadow: '0 0 20px rgba(244, 63, 94, 0.2)'
          }}
        >
          {reel.teleprompterText}
        </div>
      )}
    </div>
  );
}
