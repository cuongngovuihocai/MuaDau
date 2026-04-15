import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { getCycles, getLogs, getSettings, CycleData, DailyLog } from '@/lib/storage';
import { calculatePredictions } from '@/lib/cycleUtils';
import { format, parseISO, startOfDay, addDays, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function CalendarView({ onDateSelect }: { onDateSelect: (date: string) => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    setCycles(getCycles());
    setLogs(getLogs());
    setSettings(getSettings());
  }, []);

  const periodHeavy: Date[] = [];
  const periodMedium: Date[] = [];
  const periodLight: Date[] = [];
  const ovulationDays: Date[] = [];

  // Filter valid cycles
  const validCycles = cycles.filter(c => c.startDate && isValid(parseISO(c.startDate)));
  
  const predictions = calculatePredictions(cycles, settings, logs);
  const avgCycleLength = predictions.calculatedAverageCycleLength || settings.averageCycleLength || 28;

  // Past cycles
  validCycles.forEach(cycle => {
    const start = parseISO(cycle.startDate);
    const end = cycle.endDate && isValid(parseISO(cycle.endDate)) ? parseISO(cycle.endDate) : startOfDay(new Date());
    
    let current = start;
    let dayCount = 1;
    while (current <= end) {
      if (dayCount <= 2) periodHeavy.push(current);
      else if (dayCount <= 4) periodMedium.push(current);
      else periodLight.push(current);
      
      current = addDays(current, 1);
      dayCount++;
    }
  });

  // Predictions (next 60 cycles for infinite scroll feeling)
  if (validCycles.length > 0 || (settings.lastPeriodDate && isValid(parseISO(settings.lastPeriodDate)))) {
    let lastStartStr = validCycles.length > 0 
      ? [...validCycles].sort((a, b) => parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime())[0].startDate
      : settings.lastPeriodDate;

    let lastStart = parseISO(lastStartStr);
    
    for (let i = 0; i < 60; i++) {
      const nextStart = addDays(lastStart, avgCycleLength);
      const nextEnd = addDays(nextStart, (settings.averagePeriodLength || 5) - 1);
      const ovulation = addDays(nextStart, -14);
      
      let current = nextStart;
      let dayCount = 1;
      while (current <= nextEnd) {
        if (dayCount <= 2) periodHeavy.push(current);
        else if (dayCount <= 4) periodMedium.push(current);
        else periodLight.push(current);
        
        current = addDays(current, 1);
        dayCount++;
      }
      
      ovulationDays.push(ovulation);
      lastStart = nextStart;
    }
    
    // Current cycle ovulation
    const currentOvulation = addDays(addDays(parseISO(lastStartStr), avgCycleLength), -14);
    ovulationDays.push(currentOvulation);
  }

  const modifiers = {
    period: [...periodHeavy, ...periodMedium, ...periodLight],
    heavy: periodHeavy,
    medium: periodMedium,
    light: periodLight,
    ovulation: ovulationDays,
    hasLog: Object.keys(logs).filter(d => isValid(parseISO(d))).map(d => parseISO(d)),
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateSelect(format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-2xl font-bold text-foreground">Lịch của bạn 📅</h2>
        <p className="text-sm text-muted-foreground">Theo dõi chu kỳ và các triệu chứng</p>
      </div>

      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            locale={vi}
            modifiers={modifiers}
            className="p-4"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 text-sm text-muted-foreground flex-wrap px-4">
        <div className="flex items-center gap-1.5">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#ff4d4d" strokeWidth="1" fill="none"/>
            <path d="M12 16c-1.1 0-2-.9-2-2 0-1.33 2-3.6 2-3.6s2 2.27 2 3.6c0 1.1-.9 2-2 2z" fill="#ff0000"/>
          </svg>
          <span>Kỳ kinh</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-pink-300/60 blur-[1px]"></div>
          <span>Rụng trứng</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span>Có ghi chú</span>
        </div>
      </div>
    </div>
  );
}
