export type ProductType = 'course' | 'community' | 'coaching' | 'bundle' | 'membership' | 'download';
export type ProductStatus = 'draft' | 'published' | 'archived' | 'presale';

export interface Product {
  id: string;
  creatorId: string;
  productType: ProductType;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  thumbnailUrl: string;
  priceCents: number;
  currency: string;
  isSubscription: boolean;
  billingPeriod?: 'monthly' | 'yearly' | 'quarterly';
  status: ProductStatus;
  aiGenerated: boolean;
  metaJson?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  productId: string;
  title: string;
  description?: string;
  orderIndex: number;
  isDripLocked?: boolean;
  dripDays?: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: 'video' | 'text' | 'quiz' | 'audio' | 'download' | 'interactive';
  videoUrl?: string;
  videoDurationSeconds?: number;
  hlsPlaybackUrl?: string;
  bodyMarkdown?: string;
  isFreePreview: boolean;
  orderIndex: number;
  aiGenerated?: boolean;
  attachments?: { title: string; url: string; size?: string }[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'open_text';
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Enrollment {
  id: string;
  productId: string;
  userId: string;
  status: 'active' | 'expired' | 'refunded' | 'cancelled';
  grantedBy: 'purchase' | 'manual' | 'bundle' | 'subscription';
  expiresAt?: string;
  certificateIssuedAt?: string;
  createdAt: string;
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
  videoTimestampSeconds: number;
  quizScore?: number;
  completedAt?: string;
}
