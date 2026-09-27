import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Check, ArrowLeft, Tag, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Product } from '../../domain/entities/Product';
import { useToast } from '../context/ToastContext';

interface PublicCheckoutProps {
  product: Product;
  onBackToStudio: () => void;
  onEnrollSuccess: () => void;
}

export const PublicCheckout: React.FC<PublicCheckoutProps> = ({
  product,
  onBackToStudio,
  onEnrollSuccess,
}) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const basePrice = product.priceCents / 100;
  const finalPrice = Math.max(0, basePrice * (1 - discountPercent / 100));

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showToast('Por favor introduce un cupón', 'error');
      return;
    }
    if (couponCode.toUpperCase() === 'TONI100' || couponCode.toUpperCase() === 'VIP') {
      setDiscountPercent(100);
      setCouponApplied(true);
      showToast('¡Cupón 100% aplicado con éxito!', 'success');
    } else if (couponCode.toUpperCase() === 'LAUNCH50') {
      setDiscountPercent(50);
      setCouponApplied(true);
      showToast('¡Cupón 50% de descuento aplicado!', 'success');
    } else {
      showToast('Cupón inválido o expirado', 'error');
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      showToast('Por favor completa todos los campos del formulario', 'error');
      return;
    }

    setIsProcessing(true);
    showToast('Procesando pago seguro con Stripe...', 'info');

    setTimeout(() => {
      setIsProcessing(false);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      showToast('🎉 ¡Matrícula confirmada con éxito! Acceso inmediato concedido.', 'success');
      onEnrollSuccess();
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '110rem', margin: '0 auto', padding: '2.4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <button className="btn-secondary" onClick={onBackToStudio} style={{ width: 'fit-content', padding: '0.6rem 1.2rem', fontSize: '1.3rem' }}>
        <ArrowLeft size={16} /> Volver al Creator Studio
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.4rem', alignItems: 'start' }}>
        
        {/* Left: Product Overview */}
        <div className="glass-panel" style={{ padding: '2.4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <span className="badge-tag badge-purple" style={{ marginBottom: '1rem' }}>
              Checkout Seguro 256-bit SSL
            </span>
            <h2 style={{ fontSize: '2.8rem', margin: 0 }}>{product.title}</h2>
            <p style={{ color: 'var(--primary-light)', fontSize: '1.5rem', fontWeight: 600, marginTop: '0.6rem' }}>
              {product.tagline}
            </p>
          </div>

          <div
            style={{
              padding: '1.6rem',
              borderRadius: '1.2rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.35rem' }}>
              <Check size={18} color="#10b981" />
              <span>Acceso ilimitado y de por vida a todas las lecciones</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.35rem' }}>
              <Check size={18} color="#10b981" />
              <span>Certificado de finalización oficial verificado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.35rem' }}>
              <Check size={18} color="#10b981" />
              <span>Descargas de código fuente, plantillas y recursos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.35rem' }}>
              <Check size={18} color="#10b981" />
              <span>Garantía de satisfacción incondicional 14 días</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '1.25rem' }}>
            <ShieldCheck size={20} color="#10b981" />
            <span>Pagos encriptados punto a punto procesados por Stripe</span>
          </div>
        </div>

        {/* Right: Checkout Payment Form */}
        <div
          className="glass-panel"
          style={{
            padding: '2.4rem',
            background: 'rgba(13, 17, 27, 0.95)',
            border: '1px solid var(--border-purple)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)'
          }}
        >
          <h3 style={{ fontSize: '1.9rem', marginBottom: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Lock size={18} color="var(--primary)" />
            Detalles de Compra
          </h3>

          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                className="input-glass"
                placeholder="Tu nombre y apellidos"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                Correo Electrónico para Acceso *
              </label>
              <input
                type="email"
                className="input-glass"
                placeholder="alumno@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Coupon Box */}
            <div>
              <label style={{ display: 'block', fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                ¿Tienes un Cupón de Descuento?
              </label>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Ej: TONI100 o LAUNCH50"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                  style={{ padding: '0.8rem 1.4rem' }}
                >
                  <Tag size={15} /> Aplicar
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ padding: '1.4rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', marginBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Precio Original</span>
                <span>{basePrice.toFixed(2)} €</span>
              </div>
              {couponApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', color: 'var(--success)', marginBottom: '0.6rem' }}>
                  <span>Descuento Cupón ({discountPercent}%)</span>
                  <span>-{(basePrice * (discountPercent / 100)).toFixed(2)} €</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.8rem', fontWeight: 800, borderTop: '1px solid var(--border-glass)', paddingTop: '0.8rem' }}>
                <span>Total a Pagar</span>
                <span style={{ color: 'var(--primary-light)' }}>{finalPrice.toFixed(2)} €</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isProcessing}
              style={{ padding: '1.4rem', fontSize: '1.5rem', width: '100%', marginTop: '0.4rem' }}
            >
              <Zap size={18} />
              {isProcessing ? 'Procesando...' : `Completar Matrícula (${finalPrice.toFixed(2)} €)`}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
