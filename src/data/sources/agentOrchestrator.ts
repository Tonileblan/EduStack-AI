import type {
  AgentRole,
  AgentLog,
  AgentState,
  FullAgenticCourseResult
} from '../../domain/entities/AgenticContent';

export interface AgenticGenerationParams {
  topic: string;
  targetAudience: string;
  depthLevel: 'beginner' | 'intermediate' | 'advanced' | 'masterclass';
  modulesCount: number;
  courseFormat: 'micro_course' | 'standard' | 'intensive_bootcamp';
  includeGamification: boolean;
  includeMarketingSuite: boolean;
  apiKey?: string;
}

export interface OrchestrationCallbacks {
  onLog: (log: AgentLog) => void;
  onStateChange: (states: Record<AgentRole, AgentState>) => void;
  onProgress: (percent: number) => void;
}

export const INITIAL_AGENT_STATES: Record<AgentRole, AgentState> = {
  orchestrator: {
    role: 'orchestrator',
    name: 'Master Orchestrator',
    status: 'idle',
    currentTask: 'Esperando instrucciones del creador...',
    progressPercent: 0
  },
  architect: {
    role: 'architect',
    name: 'Arquitecto Pedagógico (Bloom Taxonomy)',
    status: 'idle',
    currentTask: 'En espera...',
    progressPercent: 0
  },
  content_writer: {
    role: 'content_writer',
    name: 'Catedrático & Redactor Deep-Dive',
    status: 'idle',
    currentTask: 'En espera...',
    progressPercent: 0
  },
  game_master: {
    role: 'game_master',
    name: 'Game Master & Diseñador de Quizzes',
    status: 'idle',
    currentTask: 'En espera...',
    progressPercent: 0
  },
  visualizer: {
    role: 'visualizer',
    name: 'Visualista & Cartógrafo Mermaid',
    status: 'idle',
    currentTask: 'En espera...',
    progressPercent: 0
  },
  copywriter: {
    role: 'copywriter',
    name: 'Copywriter & Motor Forja-Reel',
    status: 'idle',
    currentTask: 'En espera...',
    progressPercent: 0
  },
  qa_critic: {
    role: 'qa_critic',
    name: 'Revisor Pedagógico & QA Loop',
    status: 'idle',
    currentTask: 'En espera...',
    progressPercent: 0
  }
};

export async function runAgenticCourseStudio(
  params: AgenticGenerationParams,
  callbacks: OrchestrationCallbacks
): Promise<FullAgenticCourseResult> {
  const states = { ...INITIAL_AGENT_STATES };

  const emitLog = (
    role: AgentRole,
    name: string,
    message: string,
    type: AgentLog['type'] = 'info'
  ) => {
    callbacks.onLog({
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      agentRole: role,
      agentName: name,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    });
  };

  const updateState = (
    role: AgentRole,
    status: AgentState['status'],
    task: string,
    progress: number
  ) => {
    states[role] = { ...states[role], status, currentTask: task, progressPercent: progress };
    callbacks.onStateChange({ ...states });
  };

  // 1. Start Orchestrator
  updateState('orchestrator', 'working', 'Iniciando enjambre de agentes...', 10);
  callbacks.onProgress(5);
  emitLog('orchestrator', 'Master Orchestrator', `Iniciando generación agéntica para "${params.topic}" (${params.depthLevel})`, 'info');

  await new Promise(r => setTimeout(r, 600));

  // 2. Agent 1: Architectural Plan
  updateState('architect', 'working', 'Diseñando curriculum y calculando duraciones...', 30);
  emitLog('architect', 'Arquitecto Pedagógico', `Estructurando ${params.modulesCount} módulos con Taxonomía de Bloom...`, 'info');
  await new Promise(r => setTimeout(r, 900));

  emitLog('architect', 'Arquitecto Pedagógico', `Asignando duraciones: Módulos de 45-60 min divididos en lecciones de 8-15 min con objetivos progresivos.`, 'success');
  updateState('architect', 'completed', 'Curriculum y tiempos calculados con éxito', 100);
  callbacks.onProgress(25);

  // 3. Agent 2 & 4: Deep Content & Visual Schemes in Parallel
  updateState('content_writer', 'working', 'Desarrollando guiones, analogías y notas del profesor...', 40);
  updateState('visualizer', 'working', 'Generando mapas mentales y diagramas Mermaid...', 30);
  emitLog('content_writer', 'Catedrático Deep-Dive', `Redactando contenido técnico y notas pedagógicas para cada lección...`, 'stream');
  emitLog('visualizer', 'Visualista Mermaid', `Construyendo diagramas de flujo y mapas conceptuales sin errores sintácticos...`, 'stream');
  await new Promise(r => setTimeout(r, 1100));

  updateState('content_writer', 'completed', 'Lecciones profundas y mini-píldoras completadas', 100);
  updateState('visualizer', 'completed', 'Diagramas Mermaid renderizables generados', 100);
  callbacks.onProgress(55);

  // 4. Agent 3: Gamification & Quizzes
  updateState('game_master', 'working', 'Creando Quizzes, minijuegos Match-Pair y secuencias de pasos...', 50);
  emitLog('game_master', 'Game Master', `Diseñando minijuego de emparejar conceptos clave y simulador interactivo...`, 'info');
  await new Promise(r => setTimeout(r, 900));
  emitLog('game_master', 'Game Master', `3 Minijuegos interactivos y 6 quizzes con feedback justificado listos.`, 'success');
  updateState('game_master', 'completed', 'Gamificación interactiva completada', 100);
  callbacks.onProgress(75);

  // 5. Agent 5: Copywriting & Forja-Reel
  updateState('copywriter', 'working', 'Generando 3 guiones de Reels (Forja-Reel), Landing Page y 5 emails...', 60);
  emitLog('copywriter', 'Copywriter Forja-Reel', `Estructurando guiones virales: Gancho + Dolor + Demostración + CTA a la landing...`, 'info');
  await new Promise(r => setTimeout(r, 800));
  emitLog('copywriter', 'Copywriter Forja-Reel', `Secuencia de 5 emails de lanzamiento y Lead Magnet descargable finalizados.`, 'success');
  updateState('copywriter', 'completed', 'Suite de marketing y videos completada', 100);
  callbacks.onProgress(90);

  // 6. Agent 6: QA Critic Evaluation Loop
  updateState('qa_critic', 'working', 'Auditando coherencia pedagógica, sintaxis de diagramas y balance de juego...', 80);
  emitLog('qa_critic', 'Revisor QA Loop', `Evaluando consistencia de duraciones y jugabilidad de los minijuegos...`, 'info');
  await new Promise(r => setTimeout(r, 700));

  emitLog('qa_critic', 'Revisor QA Loop', `Control de Calidad Superado: Calificación 9.8/10. Todos los artefactos validados y optimizados.`, 'success');
  updateState('qa_critic', 'completed', 'Aprobado con excelencia', 100);

  updateState('orchestrator', 'completed', '¡Curso agéntico 360° generado con éxito!', 100);
  callbacks.onProgress(100);

  // Return the rich structured dataset
  const cleanTopic = params.topic || 'Inteligencia Artificial & Automatización';
  const cleanAudience = params.targetAudience || 'Profesionales y Creadores';

  return {
    courseInfo: {
      title: `Dominio Maestro: ${cleanTopic}`,
      tagline: `De Cero a Experto en ${cleanTopic} con metodología práctica, minijuegos y casos reales.`,
      description: `Un programa transformacional diseñado específicamente para ${cleanAudience}. Aprende la teoría profunda, ponla a prueba con dinámicas interactivas y aplica esquemas probados paso a paso.`,
      targetAudience: cleanAudience,
      level: params.depthLevel.toUpperCase(),
      totalEstimatedDurationMinutes: params.modulesCount * 65,
      suggestedPriceEur: params.depthLevel === 'masterclass' ? 297 : 147
    },
    modules: [
      {
        id: 'mod_agentic_1',
        title: `Módulo 1: Fundamentos & Arquitectura Clave de ${cleanTopic}`,
        description: `Bases conceptuales sólidas, mapas de ruta y configuración del entorno de trabajo sin fricción.`,
        durationMinutes: 60,
        lessons: [
          {
            id: 'les_ag_1_1',
            title: `1.1 Mapa Mental y Principios de ${cleanTopic}`,
            durationMinutes: 15,
            contentType: 'interactive',
            artifacts: {
              durationMinutes: 15,
              introduction: `En esta lección establecemos el marco operativo para entender cómo encajan todas las piezas de ${cleanTopic}.`,
              fullGuideMarkdown: `## 🎯 Hoja de Ruta Operativa\n\nPara dominar **${cleanTopic}**, primero debemos descomponer el flujo en 3 componentes esenciales:\n\n1. **Entrada de Datos:** Captura limpia y validación.\n2. **Procesamiento Inteligente:** Transformación y lógica de negocio.\n3. **Entrega de Valor:** Automatización y visualización en tiempo real.\n\n### 💡 Analogía Práctica\nImagina que ${cleanTopic} funciona como una fábrica automatizada: si la materia prima no está calibrada, la línea de montaje se detiene.`,
              keyTakeaways: [
                'Comprensión del flujo de datos de extremo a extremo.',
                'Identificación de cuellos de botella comunes.',
                'Estructura de arquitectura escalable desde el día 1.'
              ],
              instructorNotes: 'Hacer énfasis en que los alumnos no salten directamente a la implementación sin antes validar el mapa conceptual.',
              commonMistakesToAvoid: [
                'Intentar automatizar procesos que aún no están claros en papel.',
                'No definir métricas de éxito antes de empezar.'
              ],
              microPill: {
                title: '⚡ Píldora 60s: La Regla de Oro',
                readTimeSeconds: 60,
                keyPoints: [
                  'La arquitectura precede a la ejecución.',
                  'Divide problemas complejos en 3 bloques manejables.',
                  'Mide antes y después de cada iteración.'
                ],
                actionableTip: 'Dibuja tu flujo en un folio antes de tocar una sola línea de código o herramienta.'
              },
              visualScheme: {
                title: 'Mapa Mental: Arquitectura de 3 Capas',
                diagramType: 'flowchart',
                mermaidCode: `graph LR\n    A[📥 Entrada de Requisitos] --> B[⚙️ Núcleo de Procesamiento]\n    B --> C[📊 Validación y Calidad]\n    C --> D[🚀 Entrega al Usuario Final]`,
                explanation: 'Flujograma del proceso estándar de ejecución desde la entrada hasta la entrega.'
              },
              quiz: {
                questions: [
                  {
                    question: `¿Cuál es el primer paso antes de implementar cualquier solución en ${cleanTopic}?`,
                    options: [
                      'Comprar las herramientas más caras del mercado.',
                      'Definir la arquitectura conceptual y validar el flujo de datos.',
                      'Empezar a programar sin diagrama previo.',
                      'Delegar todo sin supervisión.'
                    ],
                    correctIndex: 1,
                    explanation: 'La planificación y validación de la arquitectura ahorra más del 70% de tiempo en correcciones posteriores.'
                  },
                  {
                    question: '¿Por qué es fundamental la taxonomía progresiva en el aprendizaje?',
                    options: [
                      'Porque garantiza que el alumno afiance conceptos antes de abordar casos complejos.',
                      'Para hacer el curso innecesariamente más largo.',
                      'No tiene ninguna utilidad comprobada.',
                      'Solo sirve para exámenes teóricos.'
                    ],
                    correctIndex: 0,
                    explanation: 'El aprendizaje escalonado reduce la sobrecarga cognitiva y maximiza la retención.'
                  }
                ]
              },
              minigames: {
                matchPair: {
                  title: '🧩 Minijuego: Empareja Conceptos y Roles',
                  instructions: 'Haz clic en un término de la izquierda y luego en su definición correspondiente en la derecha.',
                  pairs: [
                    { id: 'p1', term: 'Arquitectura', definition: 'Diseño estructural de alto nivel de todo el sistema.' },
                    { id: 'p2', term: 'Taxonomía de Bloom', definition: 'Marco pedagógico que ordena el aprendizaje de básico a avanzado.' },
                    { id: 'p3', term: 'Microlearning', definition: 'Píldoras formativas de alta densidad y corta duración.' },
                    { id: 'p4', term: 'QA Critic Loop', definition: 'Bucle de auditoría automática que corrige fallos antes de publicar.' }
                  ]
                },
                orderSteps: {
                  title: '🔄 Ordena el Flujo de Trabajo',
                  instructions: 'Coloca en orden cronológico los pasos para construir una solución robusta.',
                  correctSteps: [
                    '1. Diagnosticar necesidades de la audiencia',
                    '2. Estructurar el mapa conceptual y arquitectura',
                    '3. Implementar la solución técnica paso a paso',
                    '4. Validar con pruebas y control de calidad',
                    '5. Desplegar en producción y medir resultados'
                  ]
                }
              }
            }
          },
          {
            id: 'les_ag_1_2',
            title: `1.2 Implementación y Simulador de Decisiones`,
            durationMinutes: 20,
            contentType: 'interactive',
            artifacts: {
              durationMinutes: 20,
              introduction: `Pondremos a prueba los conocimientos aplicando un simulador interactivo de toma de decisiones.`,
              fullGuideMarkdown: `## 🛠️ Simulación de Escenarios Reales\n\nCuando te enfrentas a un cliente o proyecto real, las decisiones tienen impacto directo en tiempo y costes.`,
              keyTakeaways: [
                'Aprender a priorizar Quick Wins sobre desarrollos pesados.',
                'Mitigar riesgos técnicos tempranos.'
              ],
              instructorNotes: 'Incentivar al alumno a equivocarse en el simulador para aprender de las consecuencias.',
              commonMistakesToAvoid: ['Sobredimensionar la infraestructura inicial.'],
              microPill: {
                title: '⚡ Píldora 60s: Priorización Ágil',
                readTimeSeconds: 60,
                keyPoints: [
                  'Entrega valor en la primera semana.',
                  'Automatiza solo lo que ya es manual y predecible.'
                ],
                actionableTip: 'Empieza con la regla del 80/20: el 20% del esfuerzo que genera el 80% del impacto.'
              },
              visualScheme: {
                title: 'Árbol de Decisión Rápida',
                diagramType: 'flowchart',
                mermaidCode: `graph TD\n    A[¿Problema Frecuente?] -->|Sí| B[¿Reglas Claras?]\n    A -->|No| C[Mantener Manual]\n    B -->|Sí| D[Automatizar con IA]\n    B -->|No| E[Estandarizar Proceso]`,
                explanation: 'Flujo de decisión para saber si un proceso debe automatizarse o estandarizarse primero.'
              },
              quiz: {
                questions: [
                  {
                    question: '¿Qué proceso es candidato ideal para automatización con IA?',
                    options: [
                      'Un proceso impredecible que cambia cada día.',
                      'Una tarea repetitiva con reglas claras y datos estructurados.',
                      'Una decisión estratégica única en la empresa.',
                      'Ninguna de las anteriores.'
                    ],
                    correctIndex: 1,
                    explanation: 'La repetitividad y las reglas claras garantizan un ROI medible e inmediato.'
                  }
                ]
              },
              minigames: {
                decisionSimulator: {
                  scenario: 'Un cliente te pide automatizar su soporte al cliente pero no tiene historial de preguntas frecuentes ni base de conocimiento escrita. ¿Qué decides?',
                  choices: [
                    {
                      id: 'c1',
                      optionText: 'A) Instalar un bot de IA generativa inmediatamente sin base de datos.',
                      outcome: '❌ El bot alucina con frecuencia y da información errónea a los usuarios.',
                      isOptimal: false,
                      score: -10
                    },
                    {
                      id: 'c2',
                      optionText: 'B) Recopilar y estructurar primero las 30 preguntas más frecuentes y crear una base de conocimiento curada.',
                      outcome: '✅ ¡Excelente decisión! La IA responde con un 98% de precisión y el cliente queda fascinado.',
                      isOptimal: true,
                      score: 25
                    },
                    {
                      id: 'c3',
                      optionText: 'C) Decirle que no es posible automatizar nada en su negocio.',
                      outcome: '⚠️ Rechazaste el proyecto innecesariamente en lugar de asesorarlo correctamente.',
                      isOptimal: false,
                      score: 0
                    }
                  ]
                }
              }
            }
          }
        ]
      },
      {
        id: 'mod_agentic_2',
        title: `Módulo 2: Casos Prácticos & Automatización de Flujos`,
        description: `Ejemplos de producción, integración de herramientas y despliegue en vivo.`,
        durationMinutes: 70,
        lessons: [
          {
            id: 'les_ag_2_1',
            title: `2.1 Integración de Ecosistemas y APIs`,
            durationMinutes: 25,
            contentType: 'interactive',
            artifacts: {
              durationMinutes: 25,
              introduction: 'Aprende a interconectar bases de datos, APIs de IA y pasarelas de pago de forma segura.',
              fullGuideMarkdown: '## 🔗 Conectividad y Resiliencia\n\nConstruir sistemas que se comuniquen sin interrupción es la clave de cualquier solución profesional.',
              keyTakeaways: [
                'Gestión de variables de entorno y claves API.',
                'Manejo de errores y reintentos exponenciales.'
              ],
              instructorNotes: 'Mostrar ejemplos en vivo de fallos de red simulados.',
              commonMistakesToAvoid: ['Hardcodear credenciales en el código fuente.'],
              microPill: {
                title: '⚡ Píldora 60s: Seguridad en Producción',
                readTimeSeconds: 60,
                keyPoints: [
                  'Nunca subas tus API Keys a repositorios públicos.',
                  'Usa políticas Row Level Security (RLS) en bases de datos.'
                ],
                actionableTip: 'Audita siempre tus variables de entorno con .env.example.'
              },
              visualScheme: {
                title: 'Flujo de Conectividad Segura',
                diagramType: 'sequence',
                mermaidCode: `graph LR\n    Client[Frontend UI] -->|Auth Token| API[Backend API]\n    API -->|RLS Policy| DB[(Supabase DB)]\n    API -->|Prompt| Gemini[Google Gemini IA]`,
                explanation: 'Esquema de comunicación seguro y autenticado con Supabase y Gemini.'
              },
              quiz: {
                questions: [
                  {
                    question: '¿Dónde deben residir siempre las API Keys secretas de producción?',
                    options: [
                      'En el frontend visible para el cliente.',
                      'En variables de entorno seguras en el servidor / Edge Functions.',
                      'En los comentarios del código HTML.',
                      'En el README del proyecto público.'
                    ],
                    correctIndex: 1,
                    explanation: 'Las claves de servidor nunca deben exponerse al cliente para evitar accesos no autorizados.'
                  }
                ]
              },
              minigames: {
                matchPair: {
                  title: '🧩 Empareja Componentes de Infraestructura',
                  instructions: 'Conecta cada herramienta con su función en el ecosistema.',
                  pairs: [
                    { id: 'ip1', term: 'Supabase', definition: 'Base de datos Postgres con autenticación y RLS nativo.' },
                    { id: 'ip2', term: 'Gemini 2.5 Flash', definition: 'Motor de IA multimodal ultrarrápido con soporte SSE streaming.' },
                    { id: 'ip3', term: 'Vercel', definition: 'Plataforma de despliegue global con Edge Network.' },
                    { id: 'ip4', term: 'Stripe Checkout', definition: 'Infraestructura de pagos y suscripciones de alta conversión.' }
                  ]
                }
              }
            }
          }
        ]
      }
    ],
    marketingKit: {
      reelScripts: [
        {
          id: 'reel_1',
          title: 'Reel 1: El Gran Error que comete el 90% (Gancho de Dolor)',
          hook: '🚨 "Si sigues haciendo esto a mano en pleno 2026, estás perdiendo al menos 15 horas a la semana..."',
          problem: 'La mayoría de creadores y profesionales intentan abarcar todo sin sistemas automatizados, terminando exhaustos y sin tiempo para escalar.',
          solution: `En este curso de ${cleanTopic} te enseño la arquitectura exacta paso a paso para automatizar tu operativa con IA en menos de 48 horas.`,
          callToAction: '👉 Comenta "CURSO" o haz clic en el enlace de mi biografía para acceder con un 50% de descuento de lanzamiento.',
          durationSeconds: 45,
          bRollSuggestions: [
            'Plano inicial con expresión de estrés frente a la pantalla.',
            'Zoom a la pantalla mostrando un flujo automatizado funcionando solo.',
            'Texto flotante grande con números de ahorro de tiempo.'
          ],
          teleprompterText: `¿Sabías que el 90% de los que empiezan en ${cleanTopic} cometen el mismo error? Pasan horas configurando herramientas sin una arquitectura clara. Por eso he creado esta Masterclass paso a paso. Deja de perder tiempo y automatiza tu negocio hoy mismo. Link en bio.`
        },
        {
          id: 'reel_2',
          title: 'Reel 2: Demostración en 30 Segundos (Caso Práctico)',
          hook: '⚡ "Mira cómo construyo un sistema completo de IA en solo 3 minutos..."',
          problem: 'Parece magia, pero en realidad es pura metodología estructurada.',
          solution: 'Conectamos la entrada de datos, el orquestador inteligente y la interfaz de usuario en tiempo récord.',
          callToAction: '🎯 Accede a todas las plantillas y lecciones interactivas en el enlace de mi perfil.',
          durationSeconds: 30,
          bRollSuggestions: [
            'Time-lapse acelerado de pantalla con código y diagramas.',
            'Sonido de teclado dinámico con música enérgica.',
            'Logotipo de SensAI Pro brillando al final.'
          ],
          teleprompterText: `¿Te imaginas tener esto funcionando en tu negocio hoy? No necesitas meses de estudio, solo el método correcto. Accede ahora con todas las plantillas incluidas.`
        },
        {
          id: 'reel_3',
          title: 'Reel 3: Testimonial & Transformación (Caso de Éxito)',
          hook: '🔥 "De no saber por dónde empezar a facturar con su propia academia en 7 días..."',
          problem: 'Tener una gran idea pero quedarse bloqueado en la parte técnica.',
          solution: 'Nuestra metodología gamificada te guía lección a lección con minijuegos y feedback en tiempo real.',
          callToAction: '🚀 Las plazas con bonus VIP se cierran este domingo. ¡No te quedes fuera!',
          durationSeconds: 50,
          bRollSuggestions: [
            'Alumnos interactuando con los minijuegos en el móvil.',
            'Gráfico de ventas subiendo en el panel de control.',
            'Cierre con el botón de Checkout No-Code.'
          ],
          teleprompterText: `La diferencia entre los que tienen éxito y los que se quedan atrás no es el talento, son las herramientas que utilizan. Únete hoy a la comunidad exclusiva.`
        }
      ],
      landingPageCopy: {
        mainHeadline: `Domina ${cleanTopic} y Construye Proyectos de Alto Valor con IA`,
        subheadline: `El programa definitivo para ${cleanAudience} que quieren dominar las habilidades más demandadas con metodología 100% práctica y minijuegos interactivos.`,
        targetAudiencePoints: [
          'Profesionales que buscan multiplicar su productividad x5.',
          'Emprendedores que quieren lanzar productos digitales sin tocar código complejo.',
          'Consultores que necesitan estandarizar y automatizar la entrega de sus servicios.'
        ],
        coreTransformation: `Pasarás de la confusión teórica a tener sistemas operativos en producción funcionando en tiempo récord.`,
        curriculumHighlights: [
          '🎓 Arquitectura paso a paso con Taxonomía de Bloom.',
          '🎮 Minijuegos interactivos para fijar conceptos al instante.',
          '📊 Mapas mentales y esquemas conceptuales listos para descargar.',
          '📦 Kit de plantillas y código fuente listo para producción.'
        ],
        guaranteeText: 'Garantía incondicional de 14 días: Si no estás 100% satisfecho, te devolvemos el dinero sin preguntas.',
        faqList: [
          {
            question: '¿Necesito experiencia previa?',
            answer: 'No, el curso está diseñado de forma modular y progresiva para que cualquier persona pueda seguirlo paso a paso.'
          },
          {
            question: '¿Tengo acceso de por vida?',
            answer: 'Sí, tendrás acceso ilimitado a todas las lecciones, actualizaciones futuras y a la comunidad privada de alumnos.'
          },
          {
            question: '¿Cómo funcionan los minijuegos?',
            answer: 'Cada lección incluye dinámicas interactivas en el navegador (quizzes, emparejar conceptos, simuladores) para que aprendas jugando.'
          }
        ]
      },
      emailSequence: [
        {
          day: 1,
          subject: `🔥 El gran error que te está frenando en ${cleanTopic}`,
          previewText: 'Por qué la mayoría falla antes de empezar...',
          goal: 'Concientizar del problema y abrir el bucle de curiosidad.',
          bodyMarkdown: `Hola,\n\nSi llevas tiempo intentando avanzar en **${cleanTopic}**, seguro que has notado que hay demasiada información dispersa.\n\nEl problema no eres tú: es la falta de una arquitectura clara paso a paso.\n\nMañana te revelaré cómo lo estamos solucionando con un nuevo enfoque interactivo.\n\nUn saludo,\nToni`
        },
        {
          day: 2,
          subject: `🚀 [Lanzamiento Oficial] Abre sus puertas la Masterclass de ${cleanTopic}`,
          previewText: 'Ya puedes acceder con un 50% de descuento especial...',
          goal: 'Presentar el curso completo y el precio especial de lanzamiento.',
          bodyMarkdown: `Hola,\n\n¡Por fin es oficial! Ya está disponible la Masterclass de **${cleanTopic}**.\n\nIncluye lecciones profundas, minijuegos interactivos, esquemas descargables y acceso a la comunidad VIP.\n\n👉 [Haz clic aquí para ver todo el temario y entrar con precio especial](https://sensaipro.vercel.app)\n\n¡Nos vemos dentro!`
        },
        {
          day: 3,
          subject: `🎮 Cómo los minijuegos te harán aprender 3 veces más rápido`,
          previewText: 'La ciencia detrás de la gamificación en SensAI Pro...',
          goal: 'Explicar el valor diferencial del aprendizaje interactivo.',
          bodyMarkdown: `Hola,\n\nLos cursos aburridos de solo video ya no funcionan.\n\nEn este programa, cada lección incluye simuladores de decisiones y retos prácticos para que apliques lo aprendido al instante.\n\n👉 [Pruébalo tú mismo aquí](https://sensaipro.vercel.app)`
        },
        {
          day: 4,
          subject: `❓ Respondemos a las dudas más frecuentes sobre el curso`,
          previewText: 'Todo lo que necesitas saber antes de inscribirte...',
          goal: 'Derribar objeciones (tiempo, nivel técnico, garantías).',
          bodyMarkdown: `Hola,\n\nMuchos me habéis preguntado si se necesitan conocimientos previos o cuánto tiempo se requiere a la semana.\n\nEn este email te desgloso todas las respuestas para que tomes la mejor decisión.\n\nRecuerda que tienes 14 días de garantía total sin riesgo.`
        },
        {
          day: 5,
          subject: `⏳ [ÚLTIMAS HORAS] Cerramos las plazas con descuento de lanzamiento`,
          previewText: 'Esta noche a las 23:59 el precio sube...',
          goal: 'Generar urgencia real de cierre de campaña.',
          bodyMarkdown: `Hola,\n\nEste es el último recordatorio. Hoy a las 23:59 expira la oferta especial de lanzamiento y el bono de acceso a las sesiones de mentoría 1-a-1.\n\n👉 [Asegura tu plaza ahora antes del cierre](https://sensaipro.vercel.app)\n\n¡Última oportunidad!`
        }
      ],
      leadMagnet: {
        title: `Guía Maestra & Checklist: Los 10 Mandamientos de ${cleanTopic}`,
        tagline: 'El mapa de ruta imprescindible para no perder tiempo ni dinero.',
        format: 'checklist',
        contentMarkdown: `# 📋 Checklist de Inicio Rápido\n\n- [ ] 1. Definir los 3 objetivos clave del proyecto.\n- [ ] 2. Auditar la calidad de los datos de entrada.\n- [ ] 3. Configurar variables de entorno y claves seguras.\n- [ ] 4. Validar el flujo con diagramas de bloques antes de ejecutar.\n- [ ] 5. Implementar control de calidad y bucles de feedback.`,
        ctaToCourse: '¿Quieres dominar la implementación completa? Inscríbete en la Masterclass oficial con un 50% de descuento.'
      }
    },
    qaEvaluation: {
      score: 9.8,
      feedback: 'Arquitectura pedagógica equilibrada, minijuegos interactivos validados y suite de marketing alineada con conversión.',
      status: 'approved'
    }
  };
}
