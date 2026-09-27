import { useState } from 'react';
import {
  Bot,
  Sparkles,
  BookOpen,
  Gamepad2,
  Layers,
  Rocket,
  CheckCircle2,
  Clock,
  Play,
  Share2,
  Download,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import {
  runAgenticCourseStudio,
  INITIAL_AGENT_STATES,
  type AgenticGenerationParams
} from '../../data/sources/agentOrchestrator';
import type {
  AgentRole,
  AgentLog,
  AgentState,
  FullAgenticCourseResult,
  AgenticLesson
} from '../../domain/entities/AgenticContent';
import { MatchPairGame } from '../components/gamification/MatchPairGame';
import { OrderStepsGame } from '../components/gamification/OrderStepsGame';
import { DecisionSimulatorGame } from '../components/gamification/DecisionSimulatorGame';
import { MermaidDiagramViewer } from '../components/gamification/MermaidDiagramViewer';
import { ReelTeleprompterCard } from '../components/gamification/ReelTeleprompterCard';

interface Props {
  onApplyCourseToStudio: (result: FullAgenticCourseResult) => void;
  onBackToDashboard: () => void;
}

export function SensAIAgentStudio({ onApplyCourseToStudio, onBackToDashboard }: Props) {
  const { showToast } = useToast();

  // Inputs
  const [topic, setTopic] = useState('Trading Cuantitativo & Machine Learning con Python');
  const [targetAudience, setTargetAudience] = useState('Programadores y Traders que quieren automatizar estrategias');
  const [depthLevel, setDepthLevel] = useState<AgenticGenerationParams['depthLevel']>('advanced');
  const [modulesCount, setModulesCount] = useState(3);
  const [courseFormat, setCourseFormat] = useState<AgenticGenerationParams['courseFormat']>('standard');

  // Agent State & Execution
  const [isRunning, setIsRunning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [agentStates, setAgentStates] = useState<Record<AgentRole, AgentState>>(INITIAL_AGENT_STATES);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [courseResult, setCourseResult] = useState<FullAgenticCourseResult | null>(null);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'console' | 'syllabus' | 'gamification' | 'schemes' | 'marketing'>('console');
  const [selectedLesson, setSelectedLesson] = useState<AgenticLesson | null>(null);

  const handleRunSwarm = async () => {
    setIsRunning(true);
    setProgressPercent(0);
    setAgentLogs([]);
    setAgentStates(INITIAL_AGENT_STATES);

    try {
      const result = await runAgenticCourseStudio(
        {
          topic,
          targetAudience,
          depthLevel,
          modulesCount,
          courseFormat,
          includeGamification: true,
          includeMarketingSuite: true
        },
        {
          onLog: (log) => setAgentLogs((prev) => [log, ...prev]),
          onStateChange: (states) => setAgentStates(states),
          onProgress: (percent) => setProgressPercent(percent)
        }
      );

      setCourseResult(result);
      if (result.modules[0]?.lessons[0]) {
        setSelectedLesson(result.modules[0].lessons[0]);
      }
      setActiveTab('syllabus');
      showToast(`¡Enjambre completado! Curso y materiales generados con éxito.`, 'success');
    } catch (err: any) {
      showToast(`Error durante la orquestación: ${err.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportToPlatform = () => {
    if (!courseResult) return;
    onApplyCourseToStudio(courseResult);
    showToast('¡Curso y kit de contenidos guardados en el LMS!', 'success');
  };

  return (
    <div style={{ maxWidth: '130rem', margin: '0 auto', padding: '0 2rem 4rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '2.4rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2.4rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '3.6rem',
                height: '3.6rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                SensAI Agentic Studio <span style={{ fontSize: '1.4rem', color: '#a855f7', fontWeight: 600 }}>360°</span>
              </h2>
              <p style={{ fontSize: '1.3rem', color: '#94a3b8', margin: '0.2rem 0 0' }}>
                Enjambre de 6 subagentes de IA especializados en diseño instruccional, gamificación y marketing
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <button
            onClick={onBackToDashboard}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.8rem 1.6rem',
              borderRadius: '0.8rem',
              color: '#cbd5e1',
              fontSize: '1.3rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Volver al Panel
          </button>

          {courseResult && (
            <button
              onClick={handleExportToPlatform}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '0.8rem',
                color: '#ffffff',
                fontSize: '1.3rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Download size={16} /> Exportar al LMS & Guardar
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.8rem',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.6rem',
          borderRadius: '1.2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2.4rem'
        }}
      >
        <button
          onClick={() => setActiveTab('console')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '1.2rem',
            borderRadius: '0.8rem',
            border: 'none',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === 'console' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
            color: activeTab === 'console' ? '#818cf8' : '#94a3b8'
          }}
        >
          <Bot size={18} /> 1. Enjambre Agéntico
        </button>

        <button
          disabled={!courseResult}
          onClick={() => setActiveTab('syllabus')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '1.2rem',
            borderRadius: '0.8rem',
            border: 'none',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: courseResult ? 'pointer' : 'not-allowed',
            opacity: courseResult ? 1 : 0.5,
            transition: 'all 0.2s ease',
            background: activeTab === 'syllabus' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
            color: activeTab === 'syllabus' ? '#38bdf8' : '#94a3b8'
          }}
        >
          <BookOpen size={18} /> 2. Temario & Lecciones
        </button>

        <button
          disabled={!courseResult}
          onClick={() => setActiveTab('gamification')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '1.2rem',
            borderRadius: '0.8rem',
            border: 'none',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: courseResult ? 'pointer' : 'not-allowed',
            opacity: courseResult ? 1 : 0.5,
            transition: 'all 0.2s ease',
            background: activeTab === 'gamification' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
            color: activeTab === 'gamification' ? '#c084fc' : '#94a3b8'
          }}
        >
          <Gamepad2 size={18} /> 3. Minijuegos & Quizzes
        </button>

        <button
          disabled={!courseResult}
          onClick={() => setActiveTab('schemes')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '1.2rem',
            borderRadius: '0.8rem',
            border: 'none',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: courseResult ? 'pointer' : 'not-allowed',
            opacity: courseResult ? 1 : 0.5,
            transition: 'all 0.2s ease',
            background: activeTab === 'schemes' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
            color: activeTab === 'schemes' ? '#fbbf24' : '#94a3b8'
          }}
        >
          <Layers size={18} /> 4. Esquemas Visuales
        </button>

        <button
          disabled={!courseResult}
          onClick={() => setActiveTab('marketing')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '1.2rem',
            borderRadius: '0.8rem',
            border: 'none',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: courseResult ? 'pointer' : 'not-allowed',
            opacity: courseResult ? 1 : 0.5,
            transition: 'all 0.2s ease',
            background: activeTab === 'marketing' ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
            color: activeTab === 'marketing' ? '#fb7185' : '#94a3b8'
          }}
        >
          <Rocket size={18} /> 5. Suite Forja-Reel & Marketing
        </button>
      </div>

      {/* TAB 1: AGENTIC CONSOLE */}
      {activeTab === 'console' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '2.4rem' }}>
          {/* Form Setup */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              borderRadius: '1.6rem',
              padding: '2.4rem',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
              <Sparkles size={20} color="#818cf8" />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Configuración del Curso & Requisitos
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.6rem' }}>
                  Tema o Idea del Curso
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: Automatizaciones con IA para E-commerce"
                  style={{
                    width: '100%',
                    padding: '1.2rem 1.6rem',
                    borderRadius: '1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f8fafc',
                    fontSize: '1.4rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.6rem' }}>
                  Audiencia Objetivo
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ej: Emprendedores y creadores de contenido"
                  style={{
                    width: '100%',
                    padding: '1.2rem 1.6rem',
                    borderRadius: '1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f8fafc',
                    fontSize: '1.4rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.6rem' }}>
                    Nivel Pedagógico
                  </label>
                  <select
                    value={depthLevel}
                    onChange={(e) => setDepthLevel(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '1.2rem 1.6rem',
                      borderRadius: '1rem',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f8fafc',
                      fontSize: '1.4rem',
                      outline: 'none'
                    }}
                  >
                    <option value="beginner">Principiante (Fundamentos)</option>
                    <option value="intermediate">Intermedio (Aplicado)</option>
                    <option value="advanced">Avanzado (Profesional)</option>
                    <option value="masterclass">Masterclass (Élite 360°)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.6rem' }}>
                    Número de Módulos
                  </label>
                  <select
                    value={modulesCount}
                    onChange={(e) => setModulesCount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '1.2rem 1.6rem',
                      borderRadius: '1rem',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f8fafc',
                      fontSize: '1.4rem',
                      outline: 'none'
                    }}
                  >
                    <option value={2}>2 Módulos (Intensivo)</option>
                    <option value={3}>3 Módulos (Estándar)</option>
                    <option value={4}>4 Módulos (Completo)</option>
                    <option value={6}>6 Módulos (Especialización)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.6rem' }}>
                  Formato del Curso
                </label>
                <select
                  value={courseFormat}
                  onChange={(e) => setCourseFormat(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '1.2rem 1.6rem',
                    borderRadius: '1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f8fafc',
                    fontSize: '1.4rem',
                    outline: 'none'
                  }}
                >
                  <option value="standard">Curso Estándar (Lecciones de 10-20 min)</option>
                  <option value="micro_course">Micro-Learning (Píldoras de 5 min)</option>
                  <option value="intensive_bootcamp">Bootcamp Intensivo (Lecciones profundas + Retos)</option>
                </select>
              </div>

              <button
                disabled={isRunning}
                onClick={handleRunSwarm}
                style={{
                  marginTop: '1.2rem',
                  padding: '1.4rem',
                  borderRadius: '1.2rem',
                  border: 'none',
                  background: isRunning
                    ? 'rgba(99, 102, 241, 0.5)'
                    : 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)'
                }}
              >
                {isRunning ? (
                  <>
                    <div
                      style={{
                        width: '1.8rem',
                        height: '1.8rem',
                        border: '2px solid #ffffff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                    <span>Orquestando Enjambre de 6 Agentes ({progressPercent}%)...</span>
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    <span>Ejecutar Enjambre Agéntico con IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Swarm Live Visualizer & Terminal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            {/* Agent Badges Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '1.6rem',
                borderRadius: '1.6rem',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {Object.values(agentStates)
                .filter((a) => a.role !== 'orchestrator')
                .map((agent) => {
                  const isCompleted = agent.status === 'completed';
                  const isWorking = agent.status === 'working';

                  return (
                    <div
                      key={agent.role}
                      style={{
                        padding: '1.2rem 1.4rem',
                        borderRadius: '1rem',
                        background: isCompleted
                          ? 'rgba(16, 185, 129, 0.1)'
                          : isWorking
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: isCompleted
                          ? '1px solid #10b981'
                          : isWorking
                          ? '1px solid #6366f1'
                          : '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isCompleted ? '#34d399' : isWorking ? '#818cf8' : '#94a3b8' }}>
                          {agent.name}
                        </span>
                        {isCompleted && <CheckCircle2 size={16} color="#10b981" />}
                        {isWorking && (
                          <div
                            style={{
                              width: '1.2rem',
                              height: '1.2rem',
                              border: '2px solid #818cf8',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}
                          />
                        )}
                      </div>
                      <span style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>{agent.currentTask}</span>
                    </div>
                  );
                })}
            </div>

            {/* Live Terminal Log */}
            <div
              style={{
                flex: 1,
                background: '#020617',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1.6rem',
                padding: '1.6rem',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                maxHeight: '32rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ width: '0.8rem', height: '0.8rem', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '0.8rem', height: '0.8rem', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '0.8rem', height: '0.8rem', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: '0.8rem', color: '#64748b', fontSize: '1.1rem' }}>SensAI Swarm Terminal</span>
              </div>

              {agentLogs.length === 0 ? (
                <div style={{ color: '#475569', textAlign: 'center', padding: '4rem 0' }}>
                  El terminal se activará al presionar "Ejecutar Enjambre Agéntico"...
                </div>
              ) : (
                agentLogs.map((log) => (
                  <div key={log.id} style={{ display: 'flex', gap: '0.8rem', lineHeight: 1.4 }}>
                    <span style={{ color: '#64748b' }}>[{log.timestamp}]</span>
                    <span
                      style={{
                        fontWeight: 700,
                        color:
                          log.type === 'success'
                            ? '#34d399'
                            : log.type === 'stream'
                            ? '#38bdf8'
                            : log.type === 'critique'
                            ? '#f59e0b'
                            : '#818cf8'
                      }}
                    >
                      {log.agentName}:
                    </span>
                    <span style={{ color: '#f8fafc' }}>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYLLABUS & DEEP LESSONS */}
      {activeTab === 'syllabus' && courseResult && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.4rem' }}>
          {/* Modules List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '2rem',
                borderRadius: '1.6rem',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.6rem' }}>
                {courseResult.courseInfo.title}
              </h3>
              <p style={{ fontSize: '1.3rem', color: '#94a3b8', margin: '0 0 1.2rem' }}>
                {courseResult.courseInfo.tagline}
              </p>
              <div style={{ display: 'flex', gap: '1.2rem', color: '#38bdf8', fontSize: '1.2rem', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} /> {courseResult.courseInfo.totalEstimatedDurationMinutes} min totales
                </span>
                <span>• Nivel: {courseResult.courseInfo.level}</span>
                <span>• {courseResult.courseInfo.suggestedPriceEur}€ sugerido</span>
              </div>
            </div>

            {courseResult.modules.map((mod) => (
              <div
                key={mod.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '1.2rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '1.4rem 1.6rem', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{mod.title}</h4>
                  <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>{mod.durationMinutes} min de duración</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {mod.lessons.map((les) => {
                    const isSelected = selectedLesson?.id === les.id;

                    return (
                      <button
                        key={les.id}
                        onClick={() => setSelectedLesson(les)}
                        style={{
                          textAlign: 'left',
                          padding: '1.2rem 1.6rem',
                          border: 'none',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                          color: isSelected ? '#38bdf8' : '#e2e8f0',
                          fontSize: '1.3rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{les.title}</span>
                        <span style={{ fontSize: '1.1rem', color: '#64748b' }}>{les.durationMinutes}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Deep Lesson Viewer */}
          {selectedLesson && (
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '1.6rem',
                padding: '2.4rem',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                  <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.2rem 0.8rem', borderRadius: '0.6rem', fontSize: '1.1rem', fontWeight: 700 }}>
                    {selectedLesson.durationMinutes} minutos estimados
                  </span>
                </div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  {selectedLesson.title}
                </h3>
              </div>

              {/* Introduction & Guide */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.8rem', borderRadius: '1.2rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8', margin: '0 0 0.8rem' }}>
                  📖 Guion & Desarrollo de la Clase
                </h4>
                <div style={{ fontSize: '1.4rem', color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedLesson.artifacts.fullGuideMarkdown}
                </div>
              </div>

              {/* Key Takeaways & Notes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.6rem', borderRadius: '1.2rem' }}>
                  <h5 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#34d399', margin: '0 0 0.8rem' }}>
                    ✅ Objetivos & Puntos Clave
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: '1.8rem', fontSize: '1.3rem', color: '#e2e8f0' }}>
                    {selectedLesson.artifacts.keyTakeaways.map((k, i) => (
                      <li key={i} style={{ marginBottom: '0.4rem' }}>{k}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.6rem', borderRadius: '1.2rem' }}>
                  <h5 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f87171', margin: '0 0 0.8rem' }}>
                    ⚠️ Errores Comunes del Alumno
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: '1.8rem', fontSize: '1.3rem', color: '#e2e8f0' }}>
                    {selectedLesson.artifacts.commonMistakesToAvoid.map((m, i) => (
                      <li key={i} style={{ marginBottom: '0.4rem' }}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructor Notes */}
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.6rem', borderRadius: '1.2rem' }}>
                <h5 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fbbf24', margin: '0 0 0.4rem' }}>
                  🎓 Notas para el Profesor / Grabación
                </h5>
                <p style={{ fontSize: '1.3rem', color: '#f8fafc', margin: 0 }}>
                  {selectedLesson.artifacts.instructorNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GAMIFICATION & MINIGAMES */}
      {activeTab === 'gamification' && courseResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
          {/* Micro-Pill 60s Card */}
          {selectedLesson?.artifacts.microPill && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '1.6rem',
                padding: '2.4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                  Microlearning • Lectura en 60 Segundos
                </span>
                <h4 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '0.4rem 0 1rem' }}>
                  {selectedLesson.artifacts.microPill.title}
                </h4>
                <ul style={{ margin: 0, paddingLeft: '2rem', color: '#e2e8f0', fontSize: '1.4rem' }}>
                  {selectedLesson.artifacts.microPill.keyPoints.map((kp, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>{kp}</li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '1.6rem 2rem',
                  borderRadius: '1.2rem',
                  maxWidth: '30rem',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  💡 Tip de Acción Inmediata
                </span>
                <p style={{ fontSize: '1.3rem', color: '#f8fafc', fontWeight: 600, margin: '0.6rem 0 0' }}>
                  "{selectedLesson.artifacts.microPill.actionableTip}"
                </p>
              </div>
            </div>
          )}

          {/* Interactive Match Pair Minigame */}
          {selectedLesson?.artifacts.minigames.matchPair && (
            <MatchPairGame game={selectedLesson.artifacts.minigames.matchPair} />
          )}

          {/* Interactive Order Steps Minigame */}
          {selectedLesson?.artifacts.minigames.orderSteps && (
            <OrderStepsGame game={selectedLesson.artifacts.minigames.orderSteps} />
          )}

          {/* Interactive Decision Simulator */}
          {selectedLesson?.artifacts.minigames.decisionSimulator && (
            <DecisionSimulatorGame game={selectedLesson.artifacts.minigames.decisionSimulator} />
          )}

          {/* Quiz Section with Explanation */}
          {selectedLesson?.artifacts.quiz && (
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '1.6rem',
                padding: '2.4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.6rem' }}>
                <HelpCircle size={22} color="#38bdf8" />
                <h4 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  Quiz de Evaluación Formativa con Justificación
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                {selectedLesson.artifacts.quiz.questions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '1.6rem 2rem',
                      borderRadius: '1.2rem',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 1rem' }}>
                      {idx + 1}. {q.question}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          style={{
                            padding: '1rem 1.4rem',
                            borderRadius: '0.8rem',
                            fontSize: '1.3rem',
                            background: oIdx === q.correctIndex ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            border: oIdx === q.correctIndex ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.06)',
                            color: oIdx === q.correctIndex ? '#34d399' : '#cbd5e1',
                            fontWeight: oIdx === q.correctIndex ? 700 : 400
                          }}
                        >
                          {opt} {oIdx === q.correctIndex && '✓ (Respuesta Correcta)'}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '1.2rem', color: '#94a3b8', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '0.8rem 1.2rem', borderRadius: '0.6rem' }}>
                      💡 <strong style={{ color: '#38bdf8' }}>Justificación pedagógica:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: VISUAL SCHEMES & MERMAID */}
      {activeTab === 'schemes' && courseResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {courseResult.modules.flatMap((m) => m.lessons).map((les) => (
            <MermaidDiagramViewer key={les.id} scheme={les.artifacts.visualScheme} />
          ))}
        </div>
      )}

      {/* TAB 5: MARKETING & FORJA-REEL SUITE */}
      {activeTab === 'marketing' && courseResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
          {/* Viral Reels Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.6rem' }}>
              <Rocket size={22} color="#f43f5e" />
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                🎬 3 Guiones de Reels de Alta Conversión (Motor Forja-Reel)
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(36rem, 1fr))', gap: '2rem' }}>
              {courseResult.marketingKit.reelScripts.map((reel) => (
                <ReelTeleprompterCard key={reel.id} reel={reel} />
              ))}
            </div>
          </div>

          {/* Landing Page Copy */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '1.6rem',
              padding: '2.4rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.6rem' }}>
              <Share2 size={20} color="#38bdf8" />
              <h4 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                📄 Copywriting para Landing Page & Checkout
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.6rem', borderRadius: '1rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Titular Principal (H1)
                </span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: '0.4rem 0 0' }}>
                  {courseResult.marketingKit.landingPageCopy.mainHeadline}
                </h2>
                <p style={{ fontSize: '1.4rem', color: '#cbd5e1', margin: '0.8rem 0 0' }}>
                  {courseResult.marketingKit.landingPageCopy.subheadline}
                </p>
              </div>

              <div>
                <h5 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#34d399', margin: '0 0 0.6rem' }}>
                  🎯 Puntos de Conexión con la Audiencia:
                </h5>
                <ul style={{ margin: 0, paddingLeft: '2rem', color: '#cbd5e1', fontSize: '1.3rem' }}>
                  {courseResult.marketingKit.landingPageCopy.targetAudiencePoints.map((p, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Email Sequence */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '1.6rem',
              padding: '2.4rem'
            }}
          >
            <h4 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 1.6rem' }}>
              📧 Secuencia de 5 Emails de Lanzamiento
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(28rem, 1fr))', gap: '1.6rem' }}>
              {courseResult.marketingKit.emailSequence.map((email) => (
                <div
                  key={email.day}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '1.6rem',
                    borderRadius: '1.2rem',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a855f7' }}>
                    DÍA {email.day} • {email.goal}
                  </span>
                  <strong style={{ fontSize: '1.3rem', color: '#f8fafc' }}>{email.subject}</strong>
                  <p style={{ fontSize: '1.2rem', color: '#94a3b8', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {email.bodyMarkdown}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
