import React, { useState } from 'react';
import { 
  Play, CheckCircle2, Circle, BookOpen, HelpCircle, 
  ChevronRight, ArrowLeft, Award, Volume2, Maximize2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Product, CourseModule, Lesson } from '../../domain/entities/Product';
import { useToast } from '../context/ToastContext';

interface LMSViewerProps {
  product: Product;
  modules: CourseModule[];
  onBackToStudio: () => void;
}

export const LMSViewer: React.FC<LMSViewerProps> = ({
  product,
  modules,
  onBackToStudio,
}) => {
  const { showToast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(
    modules[0]?.lessons[0] || {
      id: 'les_1',
      moduleId: 'mod_1',
      title: '1. Introducción al Programa',
      contentType: 'video',
      isFreePreview: true,
      orderIndex: 1,
      bodyMarkdown: 'Bienvenido al curso. En esta primera sesión exploraremos los conceptos y herramientas clave.'
    }
  );

  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [activeQuizAnswer, setActiveQuizAnswer] = useState<number | null>(null);

  const allLessons = modules.flatMap(m => m.lessons);
  const progressPercent = allLessons.length > 0 
    ? Math.round((completedLessonIds.size / allLessons.length) * 100) 
    : 0;

  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessonIds(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
        showToast('Lección marcada como pendiente', 'info');
      } else {
        next.add(lessonId);
        showToast('¡Lección completada!', 'success');
        if (next.size === allLessons.length) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          showToast('🎉 ¡Felicidades! Has completado el 100% del curso.', 'success');
        }
      }
      return next;
    });
  };

  return (
    <div style={{ maxWidth: '160rem', margin: '0 auto', padding: '1.6rem 2.4rem', display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      
      {/* Top Bar with Progress */}
      <div
        className="glass-panel"
        style={{
          padding: '1.4rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.6rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
          <button className="btn-secondary" onClick={onBackToStudio} style={{ padding: '0.6rem 1.2rem', fontSize: '1.3rem' }}>
            <ArrowLeft size={16} /> Volver al Studio
          </button>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{product.title}</h2>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Área de Miembros & Visor LMS</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem', minWidth: '28rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Progreso del Alumno</span>
              <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{progressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '0.8rem', background: 'rgba(255,255,255,0.08)', borderRadius: '1rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
                  borderRadius: '1rem',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
          {progressPercent === 100 && (
            <div className="badge-tag badge-green" style={{ padding: '0.6rem 1rem' }}>
              <Award size={16} /> Certificado Listo
            </div>
          )}
        </div>
      </div>

      {/* Main LMS Layout: Video Player (Left 70%) + Curriculum Sidebar (Right 30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 38rem', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left: Video / Lesson Player */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          
          {/* Mockup Player */}
          <div
            className="glass-panel"
            style={{
              position: 'relative',
              borderRadius: '1.6rem',
              overflow: 'hidden',
              background: '#04060a',
              aspectRatio: '16/9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 30px rgba(139, 92, 246, 0.15)'
            }}
          >
            {selectedLesson.contentType === 'video' ? (
              <>
                <div
                  style={{
                    width: '7.2rem',
                    height: '7.2rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.7)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={() => showToast('Iniciando streaming HLS de alta definición...', 'info')}
                >
                  <Play size={32} style={{ marginLeft: '4px' }} />
                </div>
                <span style={{ marginTop: '1.6rem', color: '#94a3b8', fontSize: '1.4rem' }}>
                  HLS Streaming Player (1080p 60fps)
                </span>

                {/* Player Controls Bar */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.4rem 2rem',
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', color: '#fff' }}>
                    <Play size={18} />
                    <Volume2 size={18} />
                    <span style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>04:15 / 18:30</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', color: '#fff' }}>
                    <span className="badge-tag badge-purple" style={{ fontSize: '1.1rem' }}>HD Auto</span>
                    <Maximize2 size={18} />
                  </div>
                </div>
              </>
            ) : (
              /* Quiz or Text Lesson */
              <div style={{ padding: '3rem', width: '100%', height: '100%', overflowY: 'auto' }}>
                <span className="badge-tag badge-purple" style={{ marginBottom: '1.2rem' }}>
                  <HelpCircle size={14} /> Evaluación del Módulo
                </span>
                <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{selectedLesson.title}</h3>
                
                <div className="glass-panel" style={{ padding: '2rem', marginTop: '1.6rem' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.6rem' }}>
                    ¿Cuál es el principio fundamental para garantizar escalabilidad en aplicaciones con Supabase y arquitectura limpia?
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      'Desacoplar la lógica de dominio en usecases independientes del SDK de persistencia',
                      'Hacer llamadas directas a Supabase desde los componentes visuales de React',
                      'Desactivar Row Level Security para mayor velocidad',
                      'Usar ventanas de alert nativas del navegador'
                    ].map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setActiveQuizAnswer(idx); }}
                        style={{
                          padding: '1.2rem 1.6rem',
                          textAlign: 'left',
                          borderRadius: '0.8rem',
                          background: activeQuizAnswer === idx ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.04)',
                          border: activeQuizAnswer === idx ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                          color: '#fff',
                          fontSize: '1.35rem'
                        }}
                      >
                        {String.fromCharCode(65 + idx)}) {opt}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn-primary"
                    style={{ marginTop: '1.6rem' }}
                    onClick={() => {
                      if (activeQuizAnswer === 0) {
                        showToast('¡Respuesta Correcta! +100 puntos', 'success');
                        toggleLessonCompleted(selectedLesson.id);
                      } else {
                        showToast('Respuesta incorrecta. Revisa el contenido de la lección.', 'error');
                      }
                    }}
                  >
                    Validar Respuesta
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Metadata & Complete Button */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{selectedLesson.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.35rem', margin: '0.4rem 0 0' }}>
                {selectedLesson.bodyMarkdown || 'Sigue el material complementario y completa los ejercicios propuestos.'}
              </p>
            </div>

            <button
              className={completedLessonIds.has(selectedLesson.id) ? 'btn-secondary' : 'btn-primary'}
              onClick={() => toggleLessonCompleted(selectedLesson.id)}
              style={{
                background: completedLessonIds.has(selectedLesson.id) ? 'rgba(16, 185, 129, 0.2)' : undefined,
                borderColor: completedLessonIds.has(selectedLesson.id) ? 'var(--success)' : undefined
              }}
            >
              <CheckCircle2 size={16} color={completedLessonIds.has(selectedLesson.id) ? '#10b981' : '#fff'} />
              {completedLessonIds.has(selectedLesson.id) ? 'Completada' : 'Marcar Completada'}
            </button>
          </div>
        </div>

        {/* Right: Curriculum Navigation */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.6rem', maxHeight: '80vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.7rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <BookOpen size={18} color="var(--primary)" />
            Temario del Curso
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {modules.map((mod, mIdx) => (
              <div key={mod.id || mIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {mod.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {mod.lessons.map((les) => {
                    const isSelected = selectedLesson.id === les.id;
                    const isCompleted = completedLessonIds.has(les.id);
                    return (
                      <button
                        key={les.id}
                        onClick={() => setSelectedLesson(les)}
                        style={{
                          padding: '1rem 1.2rem',
                          borderRadius: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          textAlign: 'left',
                          background: isSelected ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? '1px solid var(--border-purple)' : '1px solid transparent',
                          color: isSelected ? '#fff' : '#cbd5e1',
                          fontSize: '1.3rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={16} color="#10b981" />
                        ) : (
                          <Circle size={16} color="#64748b" />
                        )}
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {les.title}
                        </span>
                        <ChevronRight size={14} color="#64748b" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
