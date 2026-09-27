export interface AICourseOutlineRequest {
  topic: string;
  targetAudience: string;
  depthLevel: 'beginner' | 'intermediate' | 'advanced' | 'masterclass';
  modulesCount: number;
  language: string;
  includeQuizzes: boolean;
}

export interface GeneratedLesson {
  title: string;
  contentType: 'video' | 'text' | 'quiz' | 'download';
  summary: string;
  contentMarkdown?: string;
}

export interface GeneratedModule {
  title: string;
  description: string;
  lessons: GeneratedLesson[];
}

export interface GeneratedCoursePlan {
  title: string;
  tagline: string;
  description: string;
  suggestedPriceEur: number;
  modules: GeneratedModule[];
}

export async function generateCourseOutlineAI(
  req: AICourseOutlineRequest,
  apiKey: string,
  onChunk?: (text: string) => void
): Promise<GeneratedCoursePlan> {
  const prompt = `Eres un experto internacional en diseño instruccional, pedagogía avanzada y creación de cursos online de alto valor (inspirado en Skillplate y Overmind AI).
Genera un plan de curso completo, estructurado y profesional para el siguiente requerimiento:

- Tema: "${req.topic}"
- Audiencia Objetivo: "${req.targetAudience}"
- Nivel: "${req.depthLevel}"
- Número de Módulos deseados: ${req.modulesCount}
- Idioma: "${req.language}"
- Incluir Quizzes/Exámenes: ${req.includeQuizzes ? 'Sí' : 'No'}

Devuelve EXCLUSIVAMENTE un JSON válido (sin formato markdown adicional exterior o con bloque \`\`\`json) que cumpla con la siguiente estructura:
{
  "title": "Título magnético del curso",
  "tagline": "Subtítulo de alto impacto comercial",
  "description": "Descripción persuasiva del curso con beneficios clave y objetivos de aprendizaje",
  "suggestedPriceEur": 97,
  "modules": [
    {
      "title": "Nombre del Módulo 1",
      "description": "Qué aprenderá el estudiante en este módulo",
      "lessons": [
        {
          "title": "Nombre de la Lección 1.1",
          "contentType": "video",
          "summary": "Resumen conciso y objetivos de la lección",
          "contentMarkdown": "Guión o contenido base de la lección..."
        }
      ]
    }
  ]
}`;

  if (!apiKey) {
    // Fallback instant preview generator for demo mode when API key is not yet set
    await new Promise(r => setTimeout(r, 1200));
    return {
      title: `Masterclass: ${req.topic}`,
      tagline: `Aprende ${req.topic} paso a paso y domina las habilidades más demandadas.`,
      description: `Un programa de formación intensivo diseñado para ${req.targetAudience}. Desarrollado con metodología paso a paso, ejercicios prácticos y recursos descargables.`,
      suggestedPriceEur: 147,
      modules: Array.from({ length: req.modulesCount || 4 }).map((_, mIdx) => ({
        title: `Módulo ${mIdx + 1}: Fundamentos & Estrategias Clave de ${req.topic}`,
        description: `En este módulo comprenderás los principios operativos y la arquitectura práctica.`,
        lessons: [
          {
            title: `1. Introducción y Hoja de Ruta`,
            contentType: 'video',
            summary: `Presentación del módulo y conceptos fundamentales.`,
            contentMarkdown: `## Objetivos de la lección\n- Comprender los fundamentos de ${req.topic}.\n- Configurar tu entorno de trabajo.`
          },
          {
            title: `2. Implementación Práctica Paso a Paso`,
            contentType: 'video',
            summary: `Guía detallada con casos reales y ejercicios interactivos.`,
            contentMarkdown: `## Caso de Estudio\nAplicación directa en proyectos de producción.`
          },
          {
            title: `3. Quiz de Evaluación & Recursos Descargables`,
            contentType: 'quiz',
            summary: `Valida tus conocimientos y descarga las plantillas del módulo.`,
            contentMarkdown: `Preguntas de validación sobre los conceptos explicados.`
          }
        ]
      }))
    };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Error al conectar con Gemini: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            fullText += candidateText;
            if (onChunk) onChunk(fullText);
          } catch (e) {
            // ignore streaming parse errors on individual lines
          }
        }
      }
    }
  }

  // Parse final JSON
  const cleanedJson = fullText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedJson);
}
