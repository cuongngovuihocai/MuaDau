import { addDays, differenceInDays, parseISO, isAfter, isBefore, startOfDay, format, isValid, subDays } from 'date-fns';
import { CycleData, UserSettings, DailyLog } from './storage';

export const calculatePredictions = (cycles: CycleData[], settings: UserSettings, logs: Record<string, DailyLog> = {}) => {
  const today = startOfDay(new Date());
  
  const defaultReturn = {
    currentCycleDay: null,
    nextPeriodDate: null,
    nextPeriodStartRange: null,
    nextPeriodEndRange: null,
    daysUntilNextPeriod: null,
    ovulationDate: null,
    isPeriodActive: false,
    isFertileWindow: false,
    lastStartDate: null,
    predictionMethod: 'history',
    calculatedAverageCycleLength: settings.averageCycleLength || 28
  };

  // Filter out cycles with invalid start dates and sort descending
  const sortedCycles = [...(cycles || [])]
    .filter(c => c.startDate && isValid(parseISO(c.startDate)))
    .sort((a, b) => parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime());

  let lastStartDateStr = null;
  let isPeriodActive = false;

  if (sortedCycles.length > 0) {
    lastStartDateStr = sortedCycles[0].startDate;
    isPeriodActive = sortedCycles[0].endDate === null;
  } else if (settings.lastPeriodDate && isValid(parseISO(settings.lastPeriodDate))) {
    lastStartDateStr = settings.lastPeriodDate;
  }

  if (!lastStartDateStr) {
    return defaultReturn;
  }

  const lastStartDate = parseISO(lastStartDateStr);
  const currentCycleDay = differenceInDays(today, lastStartDate) + 1;

  // 1. Moving Average & Outlier Handling
  let calculatedAverageCycleLength = settings.averageCycleLength || 28;
  
  // Calculate historical cycle lengths
  const validCycleLengths: number[] = [];
  for (let i = 0; i < sortedCycles.length - 1; i++) {
    const currentStart = parseISO(sortedCycles[i].startDate);
    const prevStart = parseISO(sortedCycles[i+1].startDate);
    const length = differenceInDays(currentStart, prevStart);
    
    // Outlier handling: only include cycles between 21 and 45 days
    if (length >= 21 && length <= 45) {
      validCycleLengths.push(length);
    }
  }

  // Use up to 6 most recent valid cycles
  const recentValidCycles = validCycleLengths.slice(0, 6);
  if (recentValidCycles.length >= 3) {
    const sum = recentValidCycles.reduce((a, b) => a + b, 0);
    calculatedAverageCycleLength = Math.round(sum / recentValidCycles.length);
  }

  // Base predictions on history
  let nextPeriodDate = addDays(lastStartDate, calculatedAverageCycleLength);
  let ovulationDate = addDays(nextPeriodDate, -14);
  let predictionMethod = 'history';

  // 2. Symptom-based Logic (Overrides history)
  // We need to look at recent logs (e.g., last 14 days) to adjust predictions
  const recentLogs = Object.values(logs)
    .filter(log => isValid(parseISO(log.date)))
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    .filter(log => differenceInDays(today, parseISO(log.date)) <= 14); // Only look at last 14 days

  // Priority 1: BBT & LH (Biological signs)
  let bbtConfirmedOvulationDate = null;
  const bbtLogs = Object.values(logs)
    .filter(log => isValid(parseISO(log.date)) && log.bbt !== undefined)
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()); // Ascending

  if (bbtLogs.length >= 4) {
    for (let i = bbtLogs.length - 1; i >= 3; i--) {
      const t1 = bbtLogs[i].bbt!;
      const t2 = bbtLogs[i-1].bbt!;
      const t3 = bbtLogs[i-2].bbt!;
      const prevTemp = bbtLogs[i-3].bbt!;
      
      if (t1 >= prevTemp + 0.3 && t2 >= prevTemp + 0.3 && t3 >= prevTemp + 0.3) {
        bbtConfirmedOvulationDate = subDays(parseISO(bbtLogs[i-2].date), 1);
        break;
      }
    }
  }

  const latestLH = recentLogs.find(l => l.lhTest === 'positive');
  
  // Priority 1: Flow (Actual bleeding)
  const latestFlow = recentLogs.find(l => ['Rất ít', 'Ít', 'Vừa', 'Nhiều'].includes(l.flow || ''));
  
  if (latestFlow && differenceInDays(today, parseISO(latestFlow.date)) <= 2 && !isPeriodActive && currentCycleDay > 20) {
    nextPeriodDate = parseISO(latestFlow.date);
    ovulationDate = subDays(nextPeriodDate, 14);
    predictionMethod = 'flow';
  } else if (bbtConfirmedOvulationDate) {
    ovulationDate = bbtConfirmedOvulationDate;
    nextPeriodDate = addDays(ovulationDate, 14);
    predictionMethod = 'bbt';
  } else if (latestLH) {
    // Ovulation is usually 24-36h after positive LH
    ovulationDate = addDays(parseISO(latestLH.date), 1);
    nextPeriodDate = addDays(ovulationDate, 14);
    predictionMethod = 'lh';
  } else {
    // Priority 2: Cervical Mucus & Cervix Position
    const latestEggWhite = recentLogs.find(l => l.cervicalMucus === 'egg_white');
    const latestHighCervix = recentLogs.find(l => l.cervix === 'high');
    
    let ovulationIndicatorDate = null;
    let indicatorMethod = '';

    if (latestEggWhite && differenceInDays(today, parseISO(latestEggWhite.date)) <= 3) {
      ovulationIndicatorDate = parseISO(latestEggWhite.date);
      indicatorMethod = 'cervical_mucus';
    }
    
    if (latestHighCervix && differenceInDays(today, parseISO(latestHighCervix.date)) <= 3) {
      if (!ovulationIndicatorDate || isAfter(parseISO(latestHighCervix.date), ovulationIndicatorDate)) {
        ovulationIndicatorDate = parseISO(latestHighCervix.date);
        indicatorMethod = 'cervix';
      }
    }

    if (ovulationIndicatorDate) {
      // Peak fertility, ovulation in 24-48h
      ovulationDate = addDays(ovulationIndicatorDate, 1);
      nextPeriodDate = addDays(ovulationDate, 14);
      predictionMethod = indicatorMethod;
    } else {
      // Priority 3: Physical Symptoms for upcoming period
      const latestCramps = recentLogs.find(l => l.symptoms.includes('Chuột rút') || l.symptoms.includes('Đau lưng dưới'));
      if (latestCramps && differenceInDays(today, parseISO(latestCramps.date)) <= 2 && currentCycleDay > 20) {
        // Period expected in 24h
        nextPeriodDate = addDays(parseISO(latestCramps.date), 1);
        predictionMethod = 'symptoms';
      } else {
        const latestPMS = recentLogs.find(l => l.symptoms.includes('Đau ngực') || l.symptoms.includes('Nổi mụn') || l.symptoms.includes('Thèm ăn'));
        if (latestPMS && differenceInDays(today, parseISO(latestPMS.date)) <= 5 && currentCycleDay > 20) {
          // Period expected in 2-7 days (let's say 4 days from symptom)
          nextPeriodDate = addDays(parseISO(latestPMS.date), 4);
          predictionMethod = 'symptoms';
        }
      }
    }
  }

  const daysUntilNextPeriod = differenceInDays(nextPeriodDate, today);
  
  const variation = settings.cycleVariation || 0;
  const nextPeriodStartRange = addDays(nextPeriodDate, -variation);
  const nextPeriodEndRange = addDays(nextPeriodDate, variation);

  // Fertile window is typically 5 days before ovulation to 1 day after
  const isFertileWindow = ovulationDate ? 
    differenceInDays(ovulationDate, today) >= -1 && differenceInDays(ovulationDate, today) <= 5 
    : false;

  return {
    currentCycleDay,
    nextPeriodDate,
    nextPeriodStartRange,
    nextPeriodEndRange,
    daysUntilNextPeriod,
    ovulationDate,
    isPeriodActive,
    isFertileWindow,
    lastStartDate,
    predictionMethod,
    calculatedAverageCycleLength
  };
};

export const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');
