export type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'mr';

export type UserRole = 'farmer' | 'admin';

export interface User {
  name: string;
  phone: string;
  email?: string; // Optional, mainly for admin
  role: UserRole;
  language: Language;
  avatar?: string;
  uid: string; // Unique identifier for Firebase Auth
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  isAudio?: boolean;
}

export interface CropData {
  name: string;
  health: number; // 0-100
  moisture: number; // 0-100
  harvestDate: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  alert?: string;
}

export enum AppView {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  TEACHER = 'TEACHER',
  DOCTOR = 'DOCTOR',
  LESSONS = 'LESSONS',
  PROFILE = 'PROFILE'
}