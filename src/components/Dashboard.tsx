import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplets, CalendarHeart, Sparkles, Plus, AlertTriangle, Activity } from 'lucide-react';
import { getCycles, saveCycles, getSettings, getLogs, CycleData } from '@/lib/storage';
import { calculatePredictions, getTodayStr } from '@/lib/cycleUtils';

export default function Dashboard({ onLogClick }: { onLogClick: (date: string) => void }) {
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [settings, setSettings] = useState(getSettings());
  const [predictions, setPredictions] = useState<ReturnType<typeof calculatePredictions> | null>(null);

  useEffect(() => {
    const loadedCycles = getCycles();
    const loadedLogs = getLogs();
    setCycles(loadedCycles);
    setSettings(getSettings());
    setPredictions(calculatePredictions(loadedCycles, getSettings(), loadedLogs));
  }, []);

  const handleTogglePeriod = () => {
    const todayStr = getTodayStr();
    let newCycles = [...cycles];
    
    if (predictions?.isPeriodActive) {
      // End period
      newCycles[0].endDate = todayStr;
    } else {
      // Start new period
      newCycles.unshift({ startDate: todayStr, endDate: null });
    }
    
    saveCycles(newCycles);
    setCycles(newCycles);
    setPredictions(calculatePredictions(newCycles, settings, getLogs()));
  };

  const getAdvice = () => {
    if (!predictions) return "";
    if (predictions.isPeriodActive) {
      if (predictions.currentCycleDay && predictions.currentCycleDay <= 2) {
        return "Hôm nay lượng máu có thể ra nhiều, bạn nhớ mang theo băng vệ sinh dự phòng và uống đồ ấm nhé! 🍵";
      }
      return "Kỳ kinh đang nhạt dần, hãy giữ tinh thần thoải mái và tập vài động tác giãn cơ nhẹ nhàng. 🧘‍♀️";
    }
    if (predictions.isFertileWindow) {
      if (predictions.ovulationDate && getTodayStr() === format(predictions.ovulationDate, 'yyyy-MM-dd')) {
        return "Hôm nay là ngày rụng trứng! Bạn có thể thấy nhiều năng lượng hơn, nhưng cũng dễ thụ thai nhất. ✨";
      }
      return "Bạn đang trong cửa sổ thụ thai. Cơ thể có thể tiết nhiều dịch trong hơn bình thường, hãy chú ý vệ sinh nhé. 💧";
    }
    if (predictions.daysUntilNextPeriod !== null && predictions.daysUntilNextPeriod <= 5) {
      return "Sắp đến kỳ kinh rồi, bạn có thể cảm thấy hơi nhạy cảm hoặc thèm ngọt. Hãy nuông chiều bản thân một chút nhé! 🍫";
    }
    return "Cơ thể đang ở trạng thái tràn đầy năng lượng nhất! Hãy tận dụng thời gian này để làm những việc bạn yêu thích. 🌟";
  };

  if (!predictions) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="text-center space-y-2 py-6">
        <h1 className="text-3xl font-bold text-foreground">Xin chào {settings.name || settings.avatar}!</h1>
        <p className="text-muted-foreground">Hôm nay bạn cảm thấy thế nào?</p>
      </div>

      {/* Warning Section for Fertile Window */}
      {predictions.isFertileWindow && !predictions.isPeriodActive && (
        <Card className="border-none shadow-sm bg-destructive/10">
          <CardContent className="p-4 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive">Khả năng thụ thai cao</h4>
              <p className="text-sm text-destructive/80 mt-1">
                Bạn đang trong giai đoạn dễ thụ thai. Hãy sử dụng biện pháp an toàn (như bao cao su) nếu có quan hệ tình dục để phòng tránh thai ngoài ý muốn.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Status Card */}
      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted" />
              <circle 
                cx="96" cy="96" r="88" 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={!predictions.lastStartDate || Number.isNaN(settings.averageCycleLength) || !settings.averageCycleLength ? 2 * Math.PI * 88 : 2 * Math.PI * 88 * (1 - (predictions.currentCycleDay || 0) / settings.averageCycleLength)}
                className="text-primary transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-sm font-medium text-muted-foreground">Ngày thứ</span>
              <div className="text-4xl font-bold text-primary">{predictions.lastStartDate ? predictions.currentCycleDay : '--'}</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className={`text-lg font-semibold ${predictions.daysUntilNextPeriod !== null && predictions.daysUntilNextPeriod <= 3 && !predictions.isPeriodActive ? 'text-destructive' : ''}`}>
              {!predictions.lastStartDate ? 'Chưa có dữ liệu' :
               predictions.isPeriodActive ? 'Đang trong kỳ kinh' : 
               predictions.daysUntilNextPeriod !== null && predictions.daysUntilNextPeriod <= 3 ? 'Sắp đến kỳ kinh! 🌸' : 
               'Giai đoạn bình thường'}
            </h3>
            {predictions.lastStartDate && predictions.daysUntilNextPeriod !== null && !predictions.isPeriodActive && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dự kiến kỳ kinh tiếp theo: <span className={`font-bold ${predictions.daysUntilNextPeriod <= 3 ? 'text-destructive' : 'text-foreground'}`}>
                    {settings.cycleVariation > 0 && predictions.nextPeriodStartRange && predictions.nextPeriodEndRange
                      ? `${format(predictions.nextPeriodStartRange, 'dd/MM')} - ${format(predictions.nextPeriodEndRange, 'dd/MM')}`
                      : format(predictions.nextPeriodDate!, 'dd/MM')}
                  </span>
                  <br />
                  (trong khoảng {predictions.daysUntilNextPeriod} ngày nữa)
                </p>
                {predictions.predictionMethod !== 'history' && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    <Activity className="w-3 h-3 mr-1" />
                    Dự đoán dựa trên triệu chứng
                  </Badge>
                )}
              </div>
            )}
            {!predictions.lastStartDate && (
              <p className="text-sm text-muted-foreground">
                Hãy ghi nhận ngày bắt đầu kỳ kinh để ứng dụng có thể dự đoán.
              </p>
            )}
          </div>

          {predictions.lastStartDate && (
            <div className="mt-4 p-4 bg-primary/10 rounded-2xl text-sm text-foreground/90 leading-relaxed w-full">
              {getAdvice()}
            </div>
          )}

          <Button 
            size="lg" 
            className="w-full sm:w-auto rounded-full shadow-sm"
            onClick={handleTogglePeriod}
            variant={predictions.isPeriodActive ? "secondary" : "default"}
          >
            <Droplets className="mr-2 w-5 h-5" />
            {predictions.isPeriodActive ? 'Kết thúc kỳ kinh' : 'Bắt đầu kỳ kinh'}
          </Button>
        </CardContent>
      </Card>

      {/* Predictions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-secondary/30">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <CalendarHeart className="w-5 h-5 text-primary" />
            </div>
            <div className="text-sm font-medium text-muted-foreground">Kỳ kinh tiếp theo</div>
            <div className="font-semibold text-sm">
              {!predictions.lastStartDate ? '--' : 
                (settings.cycleVariation > 0 && predictions.nextPeriodStartRange && predictions.nextPeriodEndRange
                ? `${format(predictions.nextPeriodStartRange, 'dd/MM')} - ${format(predictions.nextPeriodEndRange, 'dd/MM')}`
                : (predictions.nextPeriodDate ? format(predictions.nextPeriodDate, 'dd/MM/yyyy') : '--'))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-accent/30">
          <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="text-sm font-medium text-muted-foreground">Ngày rụng trứng</div>
            <div className="font-semibold text-sm">
              {!predictions.lastStartDate || !predictions.ovulationDate ? '--' : format(predictions.ovulationDate, 'dd/MM/yyyy')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Log Action */}
      <Card className="border-none shadow-sm cursor-pointer hover:bg-white/80 transition-colors" onClick={() => onLogClick(getTodayStr())}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Ghi chú hôm nay</h4>
              <p className="text-xs text-muted-foreground">Triệu chứng, tâm trạng, lượng máu...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
