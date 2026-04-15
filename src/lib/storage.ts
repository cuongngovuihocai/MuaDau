export type DailyLog = {
  date: string; // YYYY-MM-DD
  symptoms: string[];
  mood: string;
  flow: string;
  bbt?: number;
  cervicalMucus?: 'dry' | 'sticky' | 'egg_white' | '';
  cervix?: 'low' | 'high' | '';
  lhTest?: 'positive' | 'negative' | '';
};

export type CycleData = {
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
};

export type UserSettings = {
  averageCycleLength: number;
  averagePeriodLength: number;
  cycleVariation: number;
  lastPeriodDate: string;
  avatar: string;
  themeColor: string;
  name: string;
};

const STORAGE_KEYS = {
  CYCLES: 'blossom_cycles',
  LOGS: 'blossom_logs',
  SETTINGS: 'blossom_settings',
};

export const getCycles = (): CycleData[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CYCLES);
  return data ? JSON.parse(data) : [];
};

export const saveCycles = (cycles: CycleData[]) => {
  localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
};

export const getLogs = (): Record<string, DailyLog> => {
  const data = localStorage.getItem(STORAGE_KEYS.LOGS);
  return data ? JSON.parse(data) : {};
};

export const saveLogs = (logs: Record<string, DailyLog>) => {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
};

export const getSettings = (): UserSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const parsed = data ? JSON.parse(data) : {};
  
  return {
    averageCycleLength: Number.isNaN(parsed.averageCycleLength) || !parsed.averageCycleLength ? 28 : parsed.averageCycleLength,
    averagePeriodLength: Number.isNaN(parsed.averagePeriodLength) || !parsed.averagePeriodLength ? 5 : parsed.averagePeriodLength,
    cycleVariation: Number.isNaN(parsed.cycleVariation) ? 2 : (parsed.cycleVariation || 0),
    lastPeriodDate: parsed.lastPeriodDate || '',
    avatar: parsed.avatar || '🌸',
    themeColor: parsed.themeColor || 'pink',
    name: parsed.name || ''
  };
};

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
