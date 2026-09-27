import { useState } from 'react';
import { ToastProvider, useToast } from './presentation/context/ToastContext';
import { Navbar, type AppView } from './presentation/components/Navbar';
import { CreatorDashboard } from './presentation/views/CreatorDashboard';
import { AICourseGeneratorModal } from './presentation/views/AICourseGeneratorModal';
import { LMSViewer } from './presentation/views/LMSViewer';
import { PublicCheckout } from './presentation/views/PublicCheckout';
import { SensAIAgentStudio } from './presentation/views/SensAIAgentStudio';
import type { Product, CourseModule } from './domain/entities/Product';
import type { GeneratedCoursePlan } from './data/sources/geminiClient';
import type { FullAgenticCourseResult } from './domain/entities/AgenticContent';

// Seed Initial Products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_trading_ai',
    creatorId: 'user_toni',
    productType: 'course',
    title: 'Trading Cuantitativo & Algoritmos con Python e IA',
    slug: 'trading-cuantitativo-ia',
    tagline: 'Desarrolla bots de alta frecuencia y análisis cuantitativo de order book.',
    description: 'Aprende a programar estrategias de trading con Python, backtesting profesional, gestión de riesgo y despliegue en tiempo real.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
    priceCents: 19700,
    currency: 'EUR',
    isSubscription: false,
    status: 'published',
    aiGenerated: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_community_vip',
    creatorId: 'user_toni',
    productType: 'community',
    title: 'Club Privado de Creadores & Desarrolladores IA',
    slug: 'club-privado-creadores',
    tagline: 'Red exclusiva de networking, soporte técnico diario y recursos privados.',
    description: 'Accede a sesiones semanales en directo, canal privado de dudas y colaboraciones de alto nivel.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
    priceCents: 2900,
    currency: 'EUR',
    isSubscription: true,
    billingPeriod: 'monthly',
    status: 'published',
    aiGenerated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_coaching_1on1',
    creatorId: 'user_toni',
    productType: 'coaching',
    title: 'Mentoría 1-a-1: Arquitectura de Software & SaaS con Toni',
    slug: 'mentoria-arquitectura-saas',
    tagline: 'Sesión intensiva de 60 minutos para auditar tu código y arquitectura limpia.',
    description: 'Revisión paso a paso de tu base de datos Supabase, políticas RLS y directrices de UI/UX.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
    priceCents: 15000,
    currency: 'EUR',
    isSubscription: false,
    status: 'published',
    aiGenerated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_templates_pack',
    creatorId: 'user_toni',
    productType: 'download',
    title: 'Kit de Plantillas Clean Architecture & Directivas SDD',
    slug: 'kit-clean-architecture-sdd',
    tagline: 'Andamiajes listos para producción con Supabase y React 19.',
    description: 'Incluye esquemas SQL con RLS estricto, hooks de streaming Gemini y tokens CSS Glassmorphism.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    priceCents: 4700,
    currency: 'EUR',
    isSubscription: false,
    status: 'published',
    aiGenerated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_MODULES: CourseModule[] = [
  {
    id: 'mod_1',
    productId: 'prod_trading_ai',
    title: 'Módulo 1: Fundamentos & Arquitectura de Trading',
    orderIndex: 1,
    lessons: [
      {
        id: 'les_1',
        moduleId: 'mod_1',
        title: '1.1 Bienvenida y Configuración del Entorno',
        contentType: 'video',
        isFreePreview: true,
        orderIndex: 1,
        bodyMarkdown: 'En esta lección configuraremos las herramientas y el entorno de trabajo para trading automatizado.'
      },
      {
        id: 'les_2',
        moduleId: 'mod_1',
        title: '1.2 Conexión con APIs de Mercado y WebSockets',
        contentType: 'video',
        isFreePreview: false,
        orderIndex: 2,
        bodyMarkdown: 'Aprenderemos a recibir datos tick-by-tick y gestionar buffers en tiempo real.'
      },
      {
        id: 'les_3',
        moduleId: 'mod_1',
        title: '1.3 Quiz de Validación de Conceptos',
        contentType: 'quiz',
        isFreePreview: false,
        orderIndex: 3,
        bodyMarkdown: 'Evaluación rápida de conceptos clave del módulo.'
      }
    ]
  },
  {
    id: 'mod_2',
    productId: 'prod_trading_ai',
    title: 'Módulo 2: Algoritmos de Machine Learning & Backtesting',
    orderIndex: 2,
    lessons: [
      {
        id: 'les_4',
        moduleId: 'mod_2',
        title: '2.1 Modelos Predictivos y Feature Engineering',
        contentType: 'video',
        isFreePreview: false,
        orderIndex: 1,
        bodyMarkdown: 'Extracción de variables explicativas y entrenamiento de modelos supervisados.'
      },
      {
        id: 'les_5',
        moduleId: 'mod_2',
        title: '2.2 Motor de Backtesting con Vectorización',
        contentType: 'video',
        isFreePreview: false,
        orderIndex: 2,
        bodyMarkdown: 'Simulación precisa teniendo en cuenta comisiones y slippage de mercado.'
      }
    ]
  }
];

function MainAppContent() {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [modules, setModules] = useState<CourseModule[]>(INITIAL_MODULES);
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleApplyAIPlan = (plan: GeneratedCoursePlan) => {
    const newProduct: Product = {
      id: `prod_ai_${Date.now()}`,
      creatorId: 'user_toni',
      productType: 'course',
      title: plan.title,
      slug: plan.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      tagline: plan.tagline,
      description: plan.description,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      priceCents: plan.suggestedPriceEur * 100,
      currency: 'EUR',
      isSubscription: false,
      status: 'published',
      aiGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newModules: CourseModule[] = plan.modules.map((m, mIdx) => ({
      id: `mod_${Date.now()}_${mIdx}`,
      productId: newProduct.id,
      title: m.title,
      description: m.description,
      orderIndex: mIdx + 1,
      lessons: m.lessons.map((l, lIdx) => ({
        id: `les_${Date.now()}_${mIdx}_${lIdx}`,
        moduleId: `mod_${Date.now()}_${mIdx}`,
        title: l.title,
        contentType: l.contentType,
        isFreePreview: lIdx === 0,
        orderIndex: lIdx + 1,
        bodyMarkdown: l.contentMarkdown || l.summary
      }))
    }));

    setProducts([newProduct, ...products]);
    setSelectedProduct(newProduct);
    setModules(newModules);
    setCurrentView('dashboard');
    showToast(`¡Curso "${plan.title}" añadido al Creator Studio!`, 'success');
  };

  const handleApplyAgenticCourse = (res: FullAgenticCourseResult) => {
    const newProduct: Product = {
      id: `prod_agentic_${Date.now()}`,
      creatorId: 'user_toni',
      productType: 'course',
      title: res.courseInfo.title,
      slug: res.courseInfo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      tagline: res.courseInfo.tagline,
      description: res.courseInfo.description,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
      priceCents: res.courseInfo.suggestedPriceEur * 100,
      currency: 'EUR',
      isSubscription: false,
      status: 'published',
      aiGenerated: true,
      metaJson: {
        marketingKit: res.marketingKit,
        qaScore: res.qaEvaluation.score
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newModules: CourseModule[] = res.modules.map((m, mIdx) => ({
      id: m.id || `mod_ag_${Date.now()}_${mIdx}`,
      productId: newProduct.id,
      title: m.title,
      description: m.description,
      orderIndex: mIdx + 1,
      lessons: m.lessons.map((l, lIdx) => ({
        id: l.id || `les_ag_${Date.now()}_${mIdx}_${lIdx}`,
        moduleId: m.id,
        title: l.title,
        contentType: l.contentType,
        videoDurationSeconds: l.durationMinutes * 60,
        isFreePreview: lIdx === 0,
        orderIndex: lIdx + 1,
        bodyMarkdown: l.artifacts.fullGuideMarkdown
      }))
    }));

    setProducts([newProduct, ...products]);
    setSelectedProduct(newProduct);
    setModules(newModules);
    setCurrentView('lms');
    showToast(`¡Curso Agéntico 360° "${res.courseInfo.title}" importado y listo en el LMS!`, 'success');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAIGenerator={() => setIsAIModalOpen(true)}
      />

      <main style={{ flex: 1, padding: '1.6rem 0' }}>
        {currentView === 'dashboard' && (
          <CreatorDashboard
            products={products}
            onOpenAIGenerator={() => setIsAIModalOpen(true)}
            onSelectProductLMS={(p) => {
              setSelectedProduct(p);
              setCurrentView('lms');
            }}
            onSelectProductCheckout={(p) => {
              setSelectedProduct(p);
              setCurrentView('checkout');
            }}
          />
        )}

        {currentView === 'agentStudio' && (
          <SensAIAgentStudio
            onApplyCourseToStudio={handleApplyAgenticCourse}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'lms' && (
          <LMSViewer
            product={selectedProduct}
            modules={modules}
            onBackToStudio={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'checkout' && (
          <PublicCheckout
            product={selectedProduct}
            onBackToStudio={() => setCurrentView('dashboard')}
            onEnrollSuccess={() => setCurrentView('lms')}
          />
        )}
      </main>

      <AICourseGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyPlan={handleApplyAIPlan}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
