import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSettings, saveSettings, UserSettings } from '@/lib/storage';
import { Settings as SettingsIcon, Save, User, Palette, HeartPulse, AlertTriangle } from 'lucide-react';

const AVATARS = ['🌸', '👩', '👧', '🦊', '🐱', '🦄', '🌻', '🦋'];
const THEMES = [
  { id: 'pink', name: 'Hồng', color: '#ff9eb5' },
  { id: 'purple', name: 'Tím', color: '#b19cd9' },
  { id: 'blue', name: 'Xanh dương', color: '#89cff0' },
  { id: 'green', name: 'Xanh lá', color: '#a8e6cf' },
  { id: 'yellow', name: 'Vàng', color: '#fde047' },
  { id: 'orange', name: 'Cam', color: '#fdba74' },
  { id: 'brown', name: 'Nâu', color: '#d4a373' },
];

export default function Settings() {
  const [settings, setLocalSettings] = useState<UserSettings>({ 
    averageCycleLength: 28, 
    averagePeriodLength: 5,
    cycleVariation: 2,
    lastPeriodDate: '',
    avatar: '🌸',
    themeColor: 'pink',
    name: ''
  });
  const [saved, setSaved] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const loadedSettings = getSettings();
    // Ensure numbers are valid, fallback to defaults if NaN
    setLocalSettings({
      ...loadedSettings,
      averageCycleLength: Number.isNaN(loadedSettings.averageCycleLength) || !loadedSettings.averageCycleLength ? 28 : loadedSettings.averageCycleLength,
      averagePeriodLength: Number.isNaN(loadedSettings.averagePeriodLength) || !loadedSettings.averagePeriodLength ? 5 : loadedSettings.averagePeriodLength,
      cycleVariation: Number.isNaN(loadedSettings.cycleVariation) ? 2 : (loadedSettings.cycleVariation || 0),
    });
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    document.documentElement.setAttribute('data-theme', settings.themeColor);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-2xl font-bold text-foreground">Cài đặt ⚙️</h2>
        <p className="text-sm text-muted-foreground">Tùy chỉnh thông tin cá nhân của bạn</p>
      </div>

      {/* Personalization */}
      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Cá nhân hóa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Tên / Biệt danh</Label>
            <Input 
              value={settings.name || ''}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ví dụ: Luna"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Chọn Avatar</Label>
            <div className="flex flex-wrap gap-3">
              {AVATARS.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => setLocalSettings(prev => ({ ...prev, avatar }))}
                  className={`text-3xl w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    settings.avatar === avatar ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary/50 hover:bg-secondary'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Màu sắc giao diện</Label>
            <div className="flex flex-wrap gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setLocalSettings(prev => ({ ...prev, themeColor: theme.id }))}
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                    settings.themeColor === theme.id ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: theme.color }}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cycle Info */}
      <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            Thông tin chu kỳ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Độ dài chu kỳ trung bình</Label>
              <span className="font-bold text-primary">{settings.averageCycleLength} ngày</span>
            </div>
            <div className="flex items-center gap-4 bg-background p-2 rounded-2xl border border-input">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => setLocalSettings(prev => ({ ...prev, averageCycleLength: Math.max(20, (prev.averageCycleLength || 28) - 1) }))}
              >
                -
              </Button>
              <div className="flex-1 text-center font-bold text-xl text-foreground">
                {settings.averageCycleLength}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => setLocalSettings(prev => ({ ...prev, averageCycleLength: Math.min(45, (prev.averageCycleLength || 28) + 1) }))}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Khoảng thời gian từ ngày đầu tiên của kỳ kinh này đến ngày đầu tiên của kỳ kinh tiếp theo.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Số ngày hành kinh trung bình</Label>
              <span className="font-bold text-primary">{settings.averagePeriodLength} ngày</span>
            </div>
            <div className="flex items-center gap-4 bg-background p-2 rounded-2xl border border-input">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => setLocalSettings(prev => ({ ...prev, averagePeriodLength: Math.max(2, (prev.averagePeriodLength || 5) - 1) }))}
              >
                -
              </Button>
              <div className="flex-1 text-center font-bold text-xl text-foreground">
                {settings.averagePeriodLength}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => setLocalSettings(prev => ({ ...prev, averagePeriodLength: Math.min(10, (prev.averagePeriodLength || 5) + 1) }))}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Số ngày bạn thường ra máu trong mỗi kỳ kinh.</p>
          </div>

          <div className="space-y-4 pt-2 border-t border-border">
            <div className="space-y-2">
              <Label className="text-base font-medium">Ngày kinh đầu tiên gần nhất</Label>
              <Input 
                type="date"
                value={settings.lastPeriodDate || ''}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, lastPeriodDate: e.target.value }))}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">Giúp hệ thống tính toán chính xác chu kỳ tiếp theo của bạn.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Số ngày lệch kinh trung bình</Label>
              <span className="font-bold text-primary">±{settings.cycleVariation} ngày</span>
            </div>
            <div className="flex items-center gap-4 bg-background p-2 rounded-2xl border border-input">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => setLocalSettings(prev => ({ ...prev, cycleVariation: Math.max(0, (prev.cycleVariation || 0) - 1) }))}
              >
                -
              </Button>
              <div className="flex-1 text-center font-bold text-xl text-foreground">
                ±{settings.cycleVariation}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => setLocalSettings(prev => ({ ...prev, cycleVariation: Math.min(10, (prev.cycleVariation || 0) + 1) }))}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Số ngày chu kỳ của bạn thường đến sớm hoặc trễ hơn so với trung bình.</p>
          </div>

        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-none shadow-md bg-destructive/10 backdrop-blur-sm mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Cảnh báo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-destructive/80">
            Nhấn vào nút bên dưới sẽ xóa toàn bộ dữ liệu chu kỳ, ghi chú và cài đặt đã lưu của bạn. Không thể khôi phục sau khi xóa.
          </p>
          {!showConfirmDelete ? (
            <Button 
              variant="destructive" 
              className="w-full rounded-xl"
              onClick={() => setShowConfirmDelete(true)}
            >
              Xóa toàn bộ dữ liệu
            </Button>
          ) : (
            <div className="space-y-3 p-3 bg-destructive/20 rounded-xl border border-destructive/30">
              <p className="text-sm font-medium text-destructive text-center">Bạn có chắc chắn muốn xóa?</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Hủy
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Xác nhận xóa
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full rounded-full shadow-sm py-6 text-base" variant={saved ? "secondary" : "default"}>
        {saved ? 'Đã lưu thành công!' : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Lưu cài đặt
          </>
        )}
      </Button>
    </div>
  );
}
