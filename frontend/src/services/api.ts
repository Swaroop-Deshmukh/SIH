import axios from 'axios';
import { Mine, MineBlock, DrillTarget, ShortfallPrediction, Recommendation, DataSource } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

export const healthApi = {
  check: () => axios.get('/health'),
};

export const minesApi = {
  list: () => api.get<Mine[]>('/mines'),
  getById: (id: string) => api.get<Mine>(`/mines/${id}`),
  getBlocks: (id: string) => api.get<MineBlock[]>(`/mines/${id}/blocks`),
};

export const explorationApi = {
  getProspectivity: () => api.get('/exploration/prospectivity'),
  getOccurrences: () => api.get('/exploration/occurrences'),
  getDataSources: () => api.get<DataSource[]>('/exploration/data-sources'),
};

export const targetsApi = {
  list: () => api.get<DrillTarget[]>('/targets'),
  getById: (id: string) => api.get<DrillTarget>(`/targets/${id}`),
  getExplain: (id: string) => api.get(`/targets/${id}/explain`),
};

export const productionApi = {
  getSummary: () => api.get('/production'),
  getForecast: () => api.get('/production/forecast'),
  getShortfall: () => api.get<ShortfallPrediction[]>('/production/shortfall'),
  getBottlenecks: () => api.get('/production/bottlenecks'),
};

export const equipmentApi = {
  list: () => api.get('/equipment'),
  getAnomalies: () => api.get('/equipment/anomalies'),
};

export const blocksApi = {
  list: () => api.get<MineBlock[]>('/blocks'),
  getReadiness: () => api.get('/blocks/readiness'),
};

export const recommendationsApi = {
  list: () => api.get<Recommendation[]>('/recommendations'),
  approve: (id: string) => api.post(`/recommendations/${id}/approve`),
  reject: (id: string) => api.post(`/recommendations/${id}/reject`),
};
