import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const ARTICLES = [
  {
    title: 'Kỳ kinh nguyệt là gì?',
    desc: 'Tìm hiểu những điều cơ bản về chu kỳ kinh nguyệt và cơ thể bạn.',
    content: 'Kinh nguyệt là hiện tượng chảy máu tử cung dưới tác động của sự tụt giảm đột ngột estrogen hoặc estrogen và progesterone. Chu kỳ kinh nguyệt bình thường kéo dài từ 21 đến 35 ngày. Đây là một phần hoàn toàn tự nhiên và khỏe mạnh của quá trình trưởng thành ở nữ giới. Trong những ngày này, bạn có thể cảm thấy hơi mệt mỏi hoặc đau bụng nhẹ, điều này là bình thường.'
  },
  {
    title: 'Cách giảm đau bụng kinh',
    desc: 'Những mẹo nhỏ giúp bạn cảm thấy dễ chịu hơn trong những ngày "đèn đỏ".',
    content: 'Để giảm đau bụng kinh, bạn có thể áp dụng các cách sau:\n\n1. Chườm ấm vùng bụng dưới bằng túi chườm hoặc chai nước ấm.\n2. Uống nhiều nước ấm, trà gừng hoặc trà hoa cúc.\n3. Tập các bài tập yoga nhẹ nhàng hoặc đi bộ.\n4. Nghỉ ngơi đầy đủ và tránh thức khuya.\n5. Tránh đồ ăn quá mặn, nhiều dầu mỡ hoặc đồ uống có chứa caffeine.'
  },
  {
    title: 'Vệ sinh đúng cách',
    desc: 'Hướng dẫn sử dụng băng vệ sinh và giữ gìn vệ sinh cá nhân.',
    content: 'Giữ vệ sinh trong kỳ kinh là rất quan trọng để tránh viêm nhiễm:\n\n1. Thay băng vệ sinh mỗi 4-6 tiếng một lần, ngay cả khi lượng máu ít.\n2. Rửa sạch vùng kín bằng nước sạch hoặc dung dịch vệ sinh phụ nữ dịu nhẹ từ trước ra sau.\n3. Lau khô bằng khăn sạch hoặc giấy vệ sinh mềm.\n4. Mặc quần lót cotton thoáng mát và thay giặt hàng ngày.'
  },
  {
    title: 'Biện pháp phòng tránh thai',
    desc: 'Kiến thức cơ bản về các biện pháp an toàn và phòng tránh thai ngoài ý muốn.',
    content: 'Khi bước vào tuổi dậy thì, cơ thể đã có khả năng mang thai. Nếu có quan hệ tình dục, việc sử dụng biện pháp tránh thai là cực kỳ quan trọng để bảo vệ bản thân khỏi việc mang thai ngoài ý muốn và các bệnh lây truyền qua đường tình dục (STDs).\n\n1. Bao cao su: Là biện pháp duy nhất vừa tránh thai vừa phòng STDs hiệu quả.\n2. Thuốc tránh thai hàng ngày: Cần uống đều đặn mỗi ngày theo chỉ định.\n3. Tính ngày an toàn: Không hiệu quả cao, đặc biệt với chu kỳ không đều.\n\nHãy luôn ưu tiên sử dụng bao cao su và tham khảo ý kiến bác sĩ khi cần thiết.'
  }
];

export default function Education() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Mình là Bé Dâu! Bạn có câu hỏi nào về sức khỏe, tuổi dậy thì hay kỳ kinh nguyệt không? Đừng ngại hỏi mình nhé! 🍓' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<typeof ARTICLES[0] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing API Key");
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'Bạn là một trợ lý ảo thân thiện, nhẹ nhàng và tâm lý tên là Bé Dâu. Nhiệm vụ của bạn là tư vấn, giải đáp thắc mắc cho các bạn gái ở độ tuổi dậy thì về sức khỏe sinh sản, chu kỳ kinh nguyệt, tâm sinh lý. TUYỆT ĐỐI KHÔNG gọi người dùng là "em". Hãy xưng hô là "mình" và gọi người dùng bằng tên (nếu biết), hoặc "bạn", "bồ". Ngôn ngữ cần thân thiện, dễ hiểu, tích cực, ấm áp. Tránh dùng từ ngữ quá hàn lâm y khoa.',
        }
      });

      const text = response.text || 'Xin lỗi, tính năng này chưa hoạt động do chưa có kinh phí mua API Key :D';
      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'Xin lỗi, tính năng này chưa hoạt động do chưa có kinh phí mua API Key :D' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-2xl font-bold text-foreground">Góc Kiến Thức 📚</h2>
        <p className="text-sm text-muted-foreground">Khám phá và học hỏi về cơ thể bạn</p>
      </div>

      {/* Chatbot Section */}
      <Card className="flex-1 flex flex-col border-none shadow-md bg-white/50 backdrop-blur-sm overflow-hidden min-h-[400px]">
        <CardHeader className="bg-primary/5 pb-4 border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Hỏi đáp cùng Bé Dâu
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="p-4 bg-background/50 border-t border-border/50 flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi của bạn..."
              className="rounded-full bg-white border-none shadow-sm"
            />
            <Button onClick={handleSend} disabled={isLoading} size="icon" className="rounded-full shrink-0 shadow-sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Bài viết hữu ích
        </h3>
        <div className="grid gap-3">
          {ARTICLES.map((article, idx) => (
            <Card 
              key={idx} 
              className="border-none shadow-sm hover:bg-white/80 transition-colors cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground">{article.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{article.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="sm:max-w-[425px] bg-background border-none shadow-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="py-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {selectedArticle?.content}
            </div>
          </ScrollArea>
          <div className="pt-4 flex justify-end border-t border-border">
            <Button onClick={() => setSelectedArticle(null)} className="rounded-full shadow-sm">Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
