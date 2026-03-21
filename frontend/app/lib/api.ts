import axios from 'axios';
import { getToken } from './auth';
import { MessageSquare, Send, Sparkles, FileText, Scale, Lightbulb, Upload, Volume2, VolumeX, Pause, ShieldAlert } from 'lucide-react';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UploadResponse {
  id: string;
  filename: string;
  status: string;
  privacyMode: boolean;
}

export interface DocumentData {
  id: string;
  filename: string;
  status: string;
  privacyMode: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisResponse {
  riskScore: number;
  keyClauses: Array<{ clause: string; implication: string; riskLevel: 'high' | 'medium' | 'low' }>;
  identifiedEntities: string[];
  missingClauses: string[];
}

export interface ComparisonResponse {
  conflicts: Array<{ clauseId: string; description: string; impact: string }>;
  differences: Array<{ section: string; doc1Text: string; doc2Text: string }>;
  proClientVerdict: string;
}

export const LegalAPI = {
  uploadDocument: async (file: File, privacyMode: boolean = false): Promise<UploadResponse[]> => {
    const formData = new FormData();
    formData.append('document', file);
    if (privacyMode) {
      formData.append('privacyMode', 'true');
    }

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return [response.data.data];
  },

  getDocuments: async (): Promise<{ success: boolean; count: number; data: DocumentData[] }> => {
    const response = await apiClient.get('/documents');
    return response.data;
  },

  analyzeDocument: async (id: string, language: string = 'English'): Promise<AnalysisResponse> => {
    const response = await apiClient.post(`/analyze/${id}`, { language });
    return response.data.data;
  },

  compareDocuments: async (docId1: string, docId2: string): Promise<ComparisonResponse> => {
    const response = await apiClient.post('/compare', { docId1, docId2 });
    return response.data.data;
  },

  chat: async (documentId: string | null, query: string, mode: 'general' | 'document' | 'terminology' = 'document', language: string = 'English'): Promise<{ answer: string; confidence: string; risk_flags: string[]; disclaimer: string }> => {
    const response = await apiClient.post('/chat', { documentId, query, mode, language });
    return response.data.data;
  },

  agentChat: async (documentId: string, agentType: string, query: string): Promise<{ answer: string }> => {
    const response = await apiClient.post('/agents/chat', { documentId, agentType, query });
    return response.data.data;
  },

  deleteDocument: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  },
};
