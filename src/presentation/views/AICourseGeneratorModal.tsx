import React, { useState } from 'react';
import { Sparkles, X, Layers, Check, Loader2, BookOpen } from 'lucide-react';
import { generateCourseOutlineAI, type GeneratedCoursePlan } from '../../data/sources/geminiClient';
import { useToast } from '../context/ToastContext';

interface AICourseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (plan: GeneratedCoursePlan) => void;
}

export const AICourseGeneratorModal: React.FC<AICourseGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
}) => {
  const { showToast } = useToast();
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [depthLevel, setDepthLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'masterclass'>('masterclass');
  const [modulesCount, setModulesCount] = useState(4);
  const [apiKey, setApiKey] = useState(localStorage.getItem('edustack_gemini_key') || '');
  const [includeQuizzes, setIncludeQuizzes] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamProgress, setStreamProgress] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedCoursePlan | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Por favor introduce el tema del curso', 'error');
      return;
    }

    if (apiKey) {
      localStorage.setItem('edustack_gemini_key', apiKey);
    }

    setIsGenerating(true);
    setStreamProgress('Iniciando arquitectura de curso con Gemini 2.5 Flash...');
    setGeneratedPlan(null);

    try {
      const plan = await generateCourseOutlineAI(
        {
          topic,
          targetAudience: audience || 'Profesionales y entusiastas del sector',
          depthLevel,
          modulesCount,
          language: 'Español',
          includeQuizzes
        },
        apiKey,
        (chunk) => {
          setStreamProgress(`Estructurando módulos y lecciones... (${chunk.length} bytes recibidos)`);
        }
      );

      setGeneratedPlan(plan);
      showToast('¡Estructura de curso generada con éxito!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Error al generar con IA: ${err.message || 'Inténtalo de nuevo'}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = () => {
    if (!generatedPlan) return;
    onApplyPlan(generatedPlan);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '85rem',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(13, 17, 27, 0.95)',
          border: '1px solid var(--border-purple)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px var(--primary-glow)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '2rem 2.4rem',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.12) 0%, transparent 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                Overmind AI Course Generator
                <span className="badge-tag badge-purple">Gemini 2.5 Flash</span>
              </h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.3rem' }}>
                Crea el temario, lecciones pedagógicas y quizzes para tu curso en segundos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '0.6rem', borderRadius: '0.8rem' }}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2.4rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {!generatedPlan ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '1.35rem' }}>
                  ¿De qué tratará tu curso o formación? *
                </label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Ej: Estrategias de Trading Algorítmico Cuantitativo con Python"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '1.35rem' }}>
                    Audiencia o Perfil del Alumno
                  </label>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="Ej: Traders e inversores que desean automatizar"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '1.35rem' }}>
                    Nivel de Profundidad
                  </label>
                  <select
                    className="input-glass"
                    value={depthLevel}
                    onChange={(e: any) => setDepthLevel(e.target.value)}
                  >
                    <option value="beginner">Principiante (Desde cero)</option>
                    <option value="intermediate">Intermedio (Práctico)</option>
                    <option value="advanced">Avanzado (Especializado)</option>
                    <option value="masterclass">Masterclass Completa (360°)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '1.35rem' }}>
                    Número de Módulos
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    className="input-glass"
                    value={modulesCount}
                    onChange={(e) => setModulesCount(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '1.35rem' }}>
                    Google Gemini API Key (Opcional)
                  </label>
                  <input
                    type="password"
                    className="input-glass"
                    placeholder="Dejar vacío para modo demo instantáneo"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', marginTop: '0.4rem' }}>
                <input
                  type="checkbox"
                  checked={includeQuizzes}
                  onChange={(e) => setIncludeQuizzes(e.target.checked)}
                  style={{ width: '1.6rem', height: '1.6rem', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '1.35rem' }}>Incluir Quizzes y evaluaciones formativas al final de cada módulo</span>
              </label>

              {isGenerating && (
                <div
                  className="glass-panel"
                  style={{
                    padding: '1.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.4rem',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid var(--border-purple)'
                  }}
                >
                  <Loader2 size={24} className="spin" color="#c4b5fd" />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0' }}>Generando con Inteligencia Artificial...</p>
                    <p style={{ margin: 0, fontSize: '1.25rem', color: '#94a3b8' }}>{streamProgress}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Generated Plan Preview */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              <div
                className="glass-panel"
                style={{
                  padding: '2rem',
                  border: '1px solid var(--border-purple)',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge-tag badge-cyan" style={{ marginBottom: '0.8rem' }}>Plan Generado</span>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>{generatedPlan.title}</h2>
                    <p style={{ color: 'var(--primary-light)', fontWeight: 500, fontSize: '1.45rem', marginBottom: '1rem' }}>
                      {generatedPlan.tagline}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.35rem', lineHeight: 1.6 }}>
                      {generatedPlan.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '12rem' }}>
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)', display: 'block' }}>Precio Sugerido</span>
                    <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--success)' }}>
                      {generatedPlan.suggestedPriceEur} €
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Layers size={18} color="var(--primary)" />
                  Módulos y Lecciones ({generatedPlan.modules.length} módulos)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {generatedPlan.modules.map((mod, mIdx) => (
                    <div
                      key={mIdx}
                      className="glass-panel"
                      style={{ padding: '1.6rem', border: '1px solid var(--border-glass-light)' }}
                    >
                      <h5 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '0.4rem' }}>
                        {mod.title}
                      </h5>
                      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                        {mod.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1.2rem', borderLeft: '2px solid rgba(139, 92, 246, 0.4)' }}>
                        {mod.lessons.map((les, lIdx) => (
                          <div
                            key={lIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '1.3rem'
                            }}
                          >
                            <span style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <BookOpen size={14} color="#a78bfa" />
                              {les.title}
                            </span>
                            <span className={`badge-tag ${les.contentType === 'quiz' ? 'badge-purple' : 'badge-cyan'}`}>
                              {les.contentType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1.6rem 2.4rem',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1.2rem',
            background: 'rgba(10, 14, 23, 0.8)'
          }}
        >
          {!generatedPlan ? (
            <>
              <button className="btn-secondary" onClick={onClose} disabled={isGenerating}>
                Cancelar
              </button>
              <button className="btn-ai-glow" onClick={handleGenerate} disabled={isGenerating}>
                <Sparkles size={16} />
                {isGenerating ? 'Generando...' : 'Generar Curso con IA'}
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setGeneratedPlan(null)}>
                Regenerar o Editar Criterios
              </button>
              <button className="btn-primary" onClick={handleConfirm}>
                <Check size={16} />
                Crear Curso en Creator Studio
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
