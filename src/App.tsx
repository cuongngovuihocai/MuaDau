/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Calendar as CalendarIcon, BookOpen, Settings as SettingsIcon, Info } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import Education from './components/Education';
import Settings from './components/Settings';
import Guide from './components/Guide';
import LogModal from './components/LogModal';
import { getSettings } from '@/lib/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [logDate, setLogDate] = useState<string | null>(null);

  useEffect(() => {
    const settings = getSettings();
    document.documentElement.setAttribute('data-theme', settings.themeColor || 'pink');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-gradient-to-b from-background to-white/50">
        
        <main className="p-4 h-full overflow-y-auto pb-24 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsContent value="home" className="h-full mt-0">
              <Dashboard onLogClick={setLogDate} />
            </TabsContent>
            
            <TabsContent value="calendar" className="h-full mt-0">
              <CalendarView onDateSelect={setLogDate} />
            </TabsContent>

            <TabsContent value="guide" className="h-full mt-0">
              <Guide />
            </TabsContent>
            
            <TabsContent value="education" className="h-full mt-0">
              <Education />
            </TabsContent>

            <TabsContent value="settings" className="h-full mt-0">
              <Settings />
            </TabsContent>
          </Tabs>

          {/* Logo Ham Chơi Education */}
          <div className="mt-10 mb-6 flex justify-center w-full shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/d/1oTxhowzJvB_4EvS_mNOD-EWYtdYmptBw" 
              alt="Ham Chơi Education" 
              className="w-40 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:absolute bg-white/80 backdrop-blur-md border-t border-border p-2 px-2 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <NavButton 
            icon={<Home />} 
            label="Trang chủ" 
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <NavButton 
            icon={<CalendarIcon />} 
            label="Lịch" 
            isActive={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
          />
          <NavButton 
            icon={<Info />} 
            label="Hướng dẫn" 
            isActive={activeTab === 'guide'} 
            onClick={() => setActiveTab('guide')} 
          />
          <NavButton 
            icon={<BookOpen />} 
            label="Kiến thức" 
            isActive={activeTab === 'education'} 
            onClick={() => setActiveTab('education')} 
          />
          <NavButton 
            icon={<SettingsIcon />} 
            label="Cài đặt" 
            isActive={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>

        <LogModal 
          date={logDate} 
          isOpen={!!logDate} 
          onClose={() => setLogDate(null)} 
        />
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 ${
        isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-black/5'
      }`}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110 mb-1' : 'scale-100 mb-1'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-medium transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
        {label}
      </span>
    </button>
  );
}
