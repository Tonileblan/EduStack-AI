import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, Users, MessageSquare, Target, Package, 
  Repeat, Download, TrendingUp, DollarSign, Award, ExternalLink, Play
} from 'lucide-react';
import type { Product, ProductType } from '../../domain/entities/Product';

interface CreatorDashboardProps {
  products: Product[];
  onOpenAIGenerator: () => void;
  onSelectProductLMS: (product: Product) => void;
  onSelectProductCheckout: (product: Product) => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  products,
  onOpenAIGenerator,
  onSelectProductLMS,
  onSelectProductCheckout,
}) => {
  const [activeFilter, setActiveFilter] = useState<ProductType | 'all'>('all');

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(p => p.productType === activeFilter);

  const totalRevenue = products.reduce((acc, p) => acc + (p.priceCents / 100) * 14, 0); // simulated students

  const getProductIcon = (type: ProductType) => {
    switch (type) {
      case 'course': return <BookOpen size={18} color="#a78bfa" />;
      case 'community': return <MessageSquare size={18} color="#67e8f9" />;
      case 'coaching': return <Target size={18} color="#f472b6" />;
      case 'bundle': return <Package size={18} color="#fbbf24" />;
      case 'membership': return <Repeat size={18} color="#34d399" />;
      case 'download': return <Download size={18} color="#60a5fa" />;
    }
  };

  const getTypeLabel = (type: ProductType) => {
    switch (type) {
      case 'course': return 'Curso Online';
      case 'community': return 'Comunidad';
      case 'coaching': return 'Coaching 1-a-1';
      case 'bundle': return 'Bundle';
      case 'membership': return 'Membresía';
      case 'download': return 'Descarga Digital';
    }
  };

  return (
    <div style={{ padding: '2.4rem', maxWidth: '140rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
      
      {/* Top Banner / Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(24rem, 1fr))', gap: '1.6rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
          <div style={{ width: '4.8rem', height: '4.8rem', borderRadius: '1.2rem', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color="#10b981" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Ingresos Brutos</span>
            <h3 style={{ fontSize: '2.4rem', margin: '0.2rem 0 0', fontWeight: 800 }}>{totalRevenue.toLocaleString()} €</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
          <div style={{ width: '4.8rem', height: '4.8rem', borderRadius: '1.2rem', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="#a78bfa" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Alumnos Inscritos</span>
            <h3 style={{ fontSize: '2.4rem', margin: '0.2rem 0 0', fontWeight: 800 }}>128 alumnos</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
          <div style={{ width: '4.8rem', height: '4.8rem', borderRadius: '1.2rem', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} color="#06b6d4" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Tasa de Conversión</span>
            <h3 style={{ fontSize: '2.4rem', margin: '0.2rem 0 0', fontWeight: 800 }}>4.82%</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
          <div style={{ width: '4.8rem', height: '4.8rem', borderRadius: '1.2rem', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} color="#f59e0b" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Comisión a Plataforma</span>
            <h3 style={{ fontSize: '2.4rem', margin: '0.2rem 0 0', fontWeight: 800, color: 'var(--success)' }}>0% Comisión</h3>
          </div>
        </div>
      </div>

      {/* Action Header & Type Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.6rem' }}>
        <div>
          <h2 style={{ fontSize: '2.4rem', margin: 0 }}>Catálogo de Productos ({products.length})</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.35rem', margin: '0.4rem 0 0' }}>
            Gestiona cursos, comunidades, coaching, suscripciones y descargas digitales.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button className="btn-ai-glow" onClick={onOpenAIGenerator}>
            <Sparkles size={16} />
            Generar Curso con IA
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
        {[
          { id: 'all', label: 'Todos los Productos', icon: null },
          { id: 'course', label: 'Cursos Online', icon: BookOpen },
          { id: 'community', label: 'Comunidades', icon: MessageSquare },
          { id: 'coaching', label: 'Coaching 1-a-1', icon: Target },
          { id: 'bundle', label: 'Bundles', icon: Package },
          { id: 'membership', label: 'Membresías', icon: Repeat },
          { id: 'download', label: 'Descargas Digitales', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={isActive ? 'btn-primary' : 'btn-secondary'}
              style={{
                padding: '0.7rem 1.4rem',
                fontSize: '1.3rem',
                whiteSpace: 'nowrap',
                borderRadius: '0.8rem'
              }}
            >
              {Icon && <Icon size={15} />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36rem, 1fr))', gap: '2rem' }}>
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="glass-panel-interactive"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Thumbnail Header */}
            <div
              style={{
                height: '16rem',
                background: `linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%), url(${p.thumbnailUrl}) center/cover no-repeat`,
                padding: '1.6rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-tag badge-purple" style={{ backdropFilter: 'blur(8px)', background: 'rgba(10, 14, 23, 0.75)' }}>
                  {getProductIcon(p.productType)}
                  {getTypeLabel(p.productType)}
                </span>
                {p.aiGenerated && (
                  <span className="badge-tag badge-cyan" style={{ backdropFilter: 'blur(8px)', background: 'rgba(10, 14, 23, 0.75)' }}>
                    <Sparkles size={12} /> AI Powered
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {p.priceCents > 0 ? `${(p.priceCents / 100).toFixed(0)} €` : 'GRATIS'}
                  {p.isSubscription && <span style={{ fontSize: '1.2rem', fontWeight: 500 }}> /mes</span>}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.6rem' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{p.title}</h3>
                <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {p.tagline || p.description.slice(0, 120) + '...'}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.4rem' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.8rem 1rem', fontSize: '1.25rem', width: '100%' }}
                  onClick={() => onSelectProductLMS(p)}
                >
                  <Play size={14} color="#a78bfa" />
                  Ver LMS
                </button>

                <button
                  className="btn-primary"
                  style={{ padding: '0.8rem 1rem', fontSize: '1.25rem', width: '100%' }}
                  onClick={() => onSelectProductCheckout(p)}
                >
                  <ExternalLink size={14} />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
