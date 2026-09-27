import { Sparkles, Code2, Layers } from 'lucide-react';
import type { VisualSchemeItem } from '../../../domain/entities/AgenticContent';

interface Props {
  scheme: VisualSchemeItem;
}

export function MermaidDiagramViewer({ scheme }: Props) {
  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '1.6rem',
        padding: '2.4rem',
        backdropFilter: 'blur(12px)',
        color: '#f8fafc'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Layers size={20} color="#38bdf8" />
          <h4 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{scheme.title}</h4>
        </div>
        <span
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '1.1rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          {scheme.diagramType}
        </span>
      </div>

      <p style={{ fontSize: '1.3rem', color: '#94a3b8', margin: '0 0 1.6rem', lineHeight: 1.5 }}>
        {scheme.explanation}
      </p>

      {/* Visual Diagram Box */}
      <div
        style={{
          background: 'rgba(2, 6, 23, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.2rem',
          padding: '2.4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '16rem',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.6rem',
            width: '100%'
          }}
        >
          {scheme.mermaidCode
            .split('\n')
            .filter((line) => line.includes('-->') || line.includes('['))
            .map((line, idx) => {
              const cleaned = line.replace(/graph (LR|TD)|[\[\]]/g, '').trim();
              const parts = cleaned.split('-->');

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '1.2rem 1.6rem',
                    borderRadius: '1rem',
                    color: '#e0f2fe',
                    fontSize: '1.3rem',
                    fontWeight: 600
                  }}
                >
                  <Sparkles size={16} color="#38bdf8" />
                  <span>{parts[0]?.trim() || line}</span>
                  {parts[1] && (
                    <>
                      <span style={{ color: '#38bdf8' }}>➔</span>
                      <span>{parts[1]?.trim()}</span>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Mermaid Raw Code Section */}
      <div style={{ marginTop: '1.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <Code2 size={14} color="#64748b" />
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Sintaxis Mermaid.js Compatible
          </span>
        </div>
        <pre
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1rem 1.4rem',
            borderRadius: '0.8rem',
            fontSize: '1.2rem',
            color: '#a5b4fc',
            margin: 0,
            overflowX: 'auto',
            fontFamily: 'monospace'
          }}
        >
          {scheme.mermaidCode}
        </pre>
      </div>
    </div>
  );
}
