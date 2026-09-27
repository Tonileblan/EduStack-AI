# 🎓 EduStack-AI (Skillplate Clone & LMS Creator Platform)

**ID del Proyecto:** `proj_edustack`  
**Esquema Supabase:** `mia_academy`  
**Directorio Local:** `EduStack-AI`  
**URL Producción (Vercel):** [https://sensaipro.vercel.app](https://sensaipro.vercel.app)  
**Repositorio Remoto:** `https://github.com/Tonileblan/EduStack-AI.git`  
**Carpeta Google Drive:** [1lWPlfQ3KtLijHklYE0O993J-HwQInjZW](https://drive.google.com/drive/folders/1lWPlfQ3KtLijHklYE0O993J-HwQInjZW)  
**Fecha de Creación:** 2026-09-27  
**Estado:** En Producción (Vercel) / Fase Activa

---

## 🚀 Resumen Ejecutivo

**EduStack-AI** es una plataforma SaaS All-in-One de monetización para creadores de contenido, educadores, consultores y academias digitales. Inspirada en el benchmark de **Skillplate.com**, combina:

1. **Generación Inteligente de Cursos por IA (Overmind Engine)** con modelos Gemini 2.5 Flash con streaming.
2. **LMS Moderno & Reproductor Adaptativo** con tracking de progreso y soporte HLS.
3. **6 Tipos de Productos Nativos:**
   - 📚 Cursos Online (módulos, lecciones, video, texto, descargas).
   - 👥 Comunidades y Foros de Discusión.
   - 🎯 Sesiones de Coaching 1-a-1 y Mentoría.
   - 📦 Bundles y Paquetes de Productos.
   - 🔄 Membresías y Suscripciones Recurrentes.
   - 💾 Descargas Digitales (Ebooks, templates, presets).
4. **Checkout No-Code de Alta Conversión** con 1-click buy, cupones, order bumps y pagos con Stripe.
5. **Certificados de Finalización y Quizzes Dinámicos**.

---

## 🏛️ Arquitectura Técnica (*Clean Architecture*)

```
src/
├── domain/                      # Capa de Negocio Pura (Cero dependencias)
│   ├── entities/               # Course, Lesson, Module, Product, Quiz, Enrollment
│   ├── usecases/               # GenerateCourseAI, EnrollStudent, TrackLessonProgress
│   └── repositories/           # ICourseRepository, IProductRepository, IAuthRepository
├── data/                        # Capa de Datos e Infraestructura
│   ├── models/                 # DTOs y Mappers Supabase
│   ├── repositories/           # SupabaseCourseRepository, SupabaseProductRepository
│   └── sources/                # SupabaseClient (schema mia_academy), GeminiClient
└── presentation/                # Capa de Presentación React 19
    ├── components/             # UI Components (Cards, Players, Generators, Modals)
    ├── views/                  # CreatorStudio, CourseGenerator, LMSViewer, Checkout
    ├── context/                # AuthContext, ToastContext, CourseContext
    └── hooks/                  # useGeminiGenerator, useLessonProgress
```

---

## 🗄️ Esquema Supabase (`mia_academy`)

- `mia_academy.creators`
- `mia_academy.products`
- `mia_academy.modules`
- `mia_academy.lessons`
- `mia_academy.quizzes`
- `mia_academy.quiz_questions`
- `mia_academy.enrollments`
- `mia_academy.lesson_progress`
- `mia_academy.coupons`
- `mia_academy.coaching_slots`

---

## 🔒 Cumplimiento de Directivas Maestras

| Directiva | Implementación en EduStack-AI |
| :--- | :--- |
| **Clean Architecture** | Separación estricta en 3 capas (`domain`, `data`, `presentation`). |
| **Zero Native Dialogs** | Prohibido `alert()`, `confirm()`, `prompt()`. Toasts accesibles con `aria-live`. |
| **Dimensionamiento rem 10px** | `html { font-size: 62.5%; }` en `:root` con CSS variables. |
| **Row Level Security (RLS)** | Aislamiento multi-creador (`auth.uid() = creator_id`) y verificación de matrículas. |
| **Auto-Sync Cross Machine** | Integrado en `antigravity-config/projects.json` para sincronización Mac/Windows. |
