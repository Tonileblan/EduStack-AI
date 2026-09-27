import React from 'react';
import { GraduationCap, Sparkles, LayoutDashboard, PlaySquare, ShoppingBag, Bot } from 'lucide-react';

export type AppView = 'dashboard' | 'agentStudio' | 'lms' | 'checkout';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenAIGenerator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAIGenerator,
}) => {
  return (
    <header
      className="glass-panel"
      style={{
        margin: '1.6rem 2.4rem 0',
        padding: '1.2rem 2.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '1.4rem',
        border: '1px solid var(--border-glass-light)'
      }}
    >
      {/* Brand */}
      <div
        onClick={() => setCurrentView('dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', cursor: 'pointer' }}
      >
        <div
          style={{
            width: '3.8rem',
            height: '3.8rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 16px var(--primary-glow)'
          }}
        >
          <GraduationCap size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.9rem', margin: 0, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Sens<span style={{ color: 'var(--primary-light)' }}>AI</span>
          </h1>
          <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            AI CREATOR LMS & AGENTIC STUDIO
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <button
          className={currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setCurrentView('dashboard')}
          style={{ padding: '0.8rem 1.4rem', fontSize: '1.35rem' }}
        >
          <LayoutDashboard size={16} />
          Creator Studio
        </button>

        <button
          className={currentView === 'agentStudio' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setCurrentView('agentStudio')}
          style={{
            padding: '0.8rem 1.6rem',
            fontSize: '1.35rem',
            background: currentView === 'agentStudio' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(99, 102, 241, 0.12)',
            border: currentView === 'agentStudio' ? 'none' : '1px solid rgba(99, 102, 241, 0.3)',
            color: currentView === 'agentStudio' ? '#ffffff' : '#c084fc',
            fontWeight: 700
          }}
        >
          <Bot size={16} />
          Studio Agéntico 360°
        </button>

        <button
          className={currentView === 'lms' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setCurrentView('lms')}
          style={{ padding: '0.8rem 1.4rem', fontSize: '1.35rem' }}
        >
          <PlaySquare size={16} />
          Área de Miembros (LMS)
        </button>

        <button
          className={currentView === 'checkout' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setCurrentView('checkout')}
          style={{ padding: '0.8rem 1.4rem', fontSize: '1.35rem' }}
        >
          <ShoppingBag size={16} />
          Checkout No-Code
        </button>
      </nav>

      {/* AI Quick Generator Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <button className="btn-ai-glow" onClick={onOpenAIGenerator}>
          <Sparkles size={16} />
          <span>Generar Rápido</span>
        </button>
      </div>
    </header>
  );
};
