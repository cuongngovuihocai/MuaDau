import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { getLogs, saveLogs, DailyLog } from '@/lib/storage';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const SYMPTOMS = ['Đau ngực', 'Nổi mụn', 'Thèm ăn', 'Chuột rút', 'Đau lưng dưới', 'Đau đầu', 'Mệt mỏi', 'Đầy hơi'];
const FLOWS = ['Không có', 'Rất ít', 'Ít', 'Vừa', 'Nhiều'];

const CERVICAL_MUCUS = [
  { id: 'dry', label: 'Khô / Không có' },
  { id: 'sticky', label: 'Ẩm / Dính' },
  { id: 'egg_white', label: 'Trơn / Dai' }
];

const CERVIX = [
  { id: 'low', label: 'Thấp, Cứng, Đóng' },
  { id: 'high', label: 'Cao, Mềm, Mở' }
];

const LH_TEST = [
  { id: 'positive', label: 'Dương tính' },
  { id: 'negative', label: 'Âm tính' }
];

export default function LogModal({ 
  date, 
  isOpen, 
  onClose 
}: { 
  date: string | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [log, setLog] = useState<DailyLog>({ date: '', symptoms: [], mood: '', flow: '', bbt: undefined, cervicalMucus: '', cervix: '', lhTest: '' });

  useEffect(() => {
    if (date && isOpen) {
      const logs = getLogs();
      setLog(logs[date] || { date, symptoms: [], mood: '', flow: '', bbt: undefined, cervicalMucus: '', cervix: '', lhTest: '' });
    }
  }, [date, isOpen]);

  const handleSave = () => {
    if (!date) return;
    const logs = getLogs();
    logs[date] = log;
    saveLogs(logs);
    onClose();
  };

  const toggleSymptom = (s: string) => {
    setLog(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) 
        ? prev.symptoms.filter(x => x !== s)
        : [...prev.symptoms, s]
    }));
  };

  if (!date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-background border-none shadow-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Ghi chú ngày {format(parseISO(date), 'dd MMMM', { locale: vi })}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            
            {/* Lượng máu */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Lượng máu kinh</h4>
              <div className="flex flex-wrap gap-2">
                {FLOWS.map(f => (
                  <Badge 
                    key={f} 
                    variant={log.flow === f ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-sm rounded-full"
                    onClick={() => setLog(prev => ({ ...prev, flow: prev.flow === f ? '' : f }))}
                  >
                    {f}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dịch nhầy cổ tử cung */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Dịch nhầy cổ tử cung</h4>
              <div className="flex flex-wrap gap-2">
                {CERVICAL_MUCUS.map(m => (
                  <Badge 
                    key={m.id} 
                    variant={log.cervicalMucus === m.id ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-sm rounded-full"
                    onClick={() => setLog(prev => ({ ...prev, cervicalMucus: prev.cervicalMucus === m.id ? '' : m.id as any }))}
                  >
                    {m.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cổ tử cung */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Cổ tử cung</h4>
              <div className="flex flex-wrap gap-2">
                {CERVIX.map(c => (
                  <Badge 
                    key={c.id} 
                    variant={log.cervix === c.id ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-sm rounded-full"
                    onClick={() => setLog(prev => ({ ...prev, cervix: prev.cervix === c.id ? '' : c.id as any }))}
                  >
                    {c.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Chỉ số sinh học */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Chỉ số sinh học</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Nhiệt độ (BBT) °C</label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="Ví dụ: 36.5" 
                    value={log.bbt || ''} 
                    onChange={e => setLog(prev => ({ ...prev, bbt: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Que thử rụng trứng (LH)</label>
                  <div className="flex gap-2">
                    {LH_TEST.map(t => (
                      <Badge 
                        key={t.id} 
                        variant={log.lhTest === t.id ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1 text-sm rounded-full flex-1 justify-center"
                        onClick={() => setLog(prev => ({ ...prev, lhTest: prev.lhTest === t.id ? '' : t.id as any }))}
                      >
                        {t.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Triệu chứng */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Triệu chứng</h4>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map(s => (
                  <Badge 
                    key={s} 
                    variant={log.symptoms.includes(s) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-sm rounded-full"
                    onClick={() => toggleSymptom(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

          </div>
        </ScrollArea>

        <div className="pt-4 flex justify-end gap-2 border-t border-border">
          <Button variant="ghost" onClick={onClose} className="rounded-full">Hủy</Button>
          <Button onClick={handleSave} className="rounded-full shadow-sm">Lưu ghi chú</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
