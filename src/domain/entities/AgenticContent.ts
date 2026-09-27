export type AgentRole =
  | 'orchestrator'
  | 'architect'
  | 'content_writer'
  | 'game_master'
  | 'visualizer'
  | 'copywriter'
  | 'qa_critic';

export type AgentStatus = 'idle' | 'working' | 'completed' | 'failed';

export interface AgentLog {
  id: string;
  agentRole: AgentRole;
  agentName: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'critique' | 'stream' | 'warning';
}

export interface AgentState {
  role: AgentRole;
  name: string;
  status: AgentStatus;
  currentTask: string;
  progressPercent: number;
}

export interface QuizQuestionItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MatchPairGameItem {
  title: string;
  instructions: string;
  pairs: {
    id: string;
    term: string;
    definition: string;
  }[];
}

export interface OrderStepsGameItem {
  title: string;
  instructions: string;
  correctSteps: string[];
}

export interface DecisionSimulatorItem {
  scenario: string;
  choices: {
    id: string;
    optionText: string;
    outcome: string;
    isOptimal: boolean;
    score: number;
  }[];
}

export interface MicroPillItem {
  title: string;
  readTimeSeconds: number;
  keyPoints: string[];
  actionableTip: string;
}

export interface VisualSchemeItem {
  title: string;
  diagramType: 'mindmap' | 'flowchart' | 'sequence';
  mermaidCode: string;
  explanation: string;
}

export interface DeepLessonArtifacts {
  durationMinutes: number;
  introduction: string;
  fullGuideMarkdown: string;
  keyTakeaways: string[];
  instructorNotes: string;
  commonMistakesToAvoid: string[];
  microPill: MicroPillItem;
  visualScheme: VisualSchemeItem;
  quiz: {
    questions: QuizQuestionItem[];
  };
  minigames: {
    matchPair?: MatchPairGameItem;
    orderSteps?: OrderStepsGameItem;
    decisionSimulator?: DecisionSimulatorItem;
  };
}

export interface AgenticLesson {
  id: string;
  title: string;
  durationMinutes: number;
  contentType: 'video' | 'text' | 'quiz' | 'interactive';
  artifacts: DeepLessonArtifacts;
}

export interface AgenticModule {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  lessons: AgenticLesson[];
}

export interface ReelScriptItem {
  id: string;
  title: string;
  hook: string;
  problem: string;
  solution: string;
  callToAction: string;
  durationSeconds: number;
  bRollSuggestions: string[];
  teleprompterText: string;
}

export interface LandingPageCopy {
  mainHeadline: string;
  subheadline: string;
  targetAudiencePoints: string[];
  coreTransformation: string;
  curriculumHighlights: string[];
  guaranteeText: string;
  faqList: { question: string; answer: string }[];
}

export interface EmailSequenceItem {
  day: number;
  subject: string;
  previewText: string;
  goal: string;
  bodyMarkdown: string;
}

export interface LeadMagnetItem {
  title: string;
  tagline: string;
  format: 'checklist' | 'guide' | 'template' | 'calculator';
  contentMarkdown: string;
  ctaToCourse: string;
}

export interface MarketingKit {
  reelScripts: ReelScriptItem[];
  landingPageCopy: LandingPageCopy;
  emailSequence: EmailSequenceItem[];
  leadMagnet: LeadMagnetItem;
}

export interface FullAgenticCourseResult {
  courseInfo: {
    title: string;
    tagline: string;
    description: string;
    targetAudience: string;
    level: string;
    totalEstimatedDurationMinutes: number;
    suggestedPriceEur: number;
  };
  modules: AgenticModule[];
  marketingKit: MarketingKit;
  qaEvaluation: {
    score: number;
    feedback: string;
    status: 'approved' | 'refined';
  };
}
