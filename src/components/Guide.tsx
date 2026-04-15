import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, CalendarHeart, BookOpen, Sparkles, Droplets, Activity, Thermometer, TestTube } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Guide() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col pb-8">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-2xl font-bold text-foreground">Hướng dẫn sử dụng 🧭</h2>
        <p className="text-sm text-muted-foreground">Làm quen với <strong>Mùa Dâu</strong> và cách theo dõi cơ thể</p>
      </div>

      <div className="space-y-4">
        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              Về Mùa Dâu
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/90 leading-relaxed space-y-2">
            <p><strong>Mùa Dâu</strong> là ứng dụng theo dõi chu kỳ kinh nguyệt được phát triển bởi <strong>Ham Chơi Education</strong>.</p>
            <p>Với mục đích mang đến một công cụ thân thiện, khoa học và dễ sử dụng, <strong>Mùa Dâu</strong> giúp các bạn gái hiểu rõ hơn về cơ thể mình, theo dõi sức khỏe sinh sản và tự tin hơn trong cuộc sống hàng ngày.</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              1. Bắt đầu: Cài đặt cá nhân 
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/90 leading-relaxed space-y-2">
            <p>Lần đầu sử dụng, bạn hãy vào tab <strong>Cài đặt</strong> để thiết lập các thông tin cơ bản:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Chọn tên/biệt danh, avatar và màu sắc yêu thích.</li>
              <li>Nhập <strong>Ngày kinh đầu tiên gần nhất</strong> để hệ thống có cơ sở tính toán.</li>
              <li>Điều chỉnh <strong>Độ dài chu kỳ</strong>, <strong>Số ngày hành kinh</strong> và <strong>Số ngày lệch kinh</strong> (nếu chu kỳ của bạn thường đến sớm hoặc trễ).</li>
            </ul>
            <p className="mt-4 font-medium text-primary">⚠️ Rất quan trọng: Bắt đầu kỳ kinh</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Tại <strong>Trang chủ</strong>, hãy nhấn nút <strong>Bắt đầu kỳ kinh</strong> ngay khi bạn thấy "dâu rụng". Hệ thống bắt buộc phải có dữ liệu này để bắt đầu tính toán và dự đoán các chu kỳ tiếp theo một cách chính xác.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              2. Cách <strong>Mùa Dâu</strong> dự đoán chu kỳ
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/90 leading-relaxed space-y-2">
            <p><strong>Mùa Dâu</strong> sử dụng thuật toán thông minh kết hợp giữa việc tính toán dựa trên lịch sử các chu kỳ gần nhất và dấu hiệu cơ thể hiện tại:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong>Trung bình trượt (Moving Average):</strong> Ứng dụng sẽ học từ 3-6 chu kỳ gần nhất của bạn để tính ra số ngày trung bình chính xác nhất, thay vì dùng một con số cố định.</li>
              <li><strong>Loại trừ bất thường (Outliers):</strong> Nếu bạn có một chu kỳ quá ngắn (dưới 21 ngày) hoặc quá dài (trên 45 ngày) do stress hay ốm đau, hệ thống sẽ tự động bỏ qua để không làm sai lệch dự báo tương lai.</li>
              <li><strong>Ưu tiên triệu chứng:</strong> Nếu bạn ghi chú các dấu hiệu sinh lý (Nhiệt độ, Dịch nhầy, Que thử...), hệ thống sẽ <strong>ưu tiên dùng các dấu hiệu này</strong> để dự báo ngày rụng trứng và kỳ kinh chuẩn xác hơn là chỉ dựa vào tính toán trung bình.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Thermometer className="w-5 h-5 text-primary" />
              </div>
              3. Hướng dẫn theo dõi chuyên sâu
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/90 leading-relaxed space-y-4">
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 text-muted-foreground">
              <p>💡 <strong>Lưu ý nhỏ:</strong> Bạn không bắt buộc phải điền tất cả các thông tin trong phần Ghi chú. Hãy chỉ theo dõi những chỉ số mà bạn cảm thấy thoải mái và phù hợp với bản thân. Hệ thống vẫn sẽ hoạt động tốt dù chỉ có một vài dữ liệu.</p>
            </div>
            
            <p>Tại tab <strong>Trang chủ</strong>, nhấn <strong>Ghi chú hôm nay</strong> để nhập các chỉ số sinh lý. Dưới đây là cách lấy dữ liệu chuẩn:</p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">🩸 Lượng máu kinh</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Cách nhận biết:</strong> Dựa vào số lượng băng vệ sinh/tampon bạn phải thay. <em>Rất ít/Ít:</em> Chỉ dính chút máu hoặc thay 1-2 miếng/ngày. <em>Vừa:</em> Thay 3-4 miếng/ngày. <em>Nhiều:</em> Phải thay liên tục mỗi 1-2 tiếng.</li>
                <li><strong>Ý nghĩa:</strong> Việc theo dõi lượng máu giúp hệ thống ghi nhận chính xác số ngày hành kinh thực tế và giúp bạn phát hiện sớm các bất thường (như rong kinh, máu kinh quá ít).</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">🌡️ Nhiệt độ cơ thể cơ bản (BBT)</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Cách đo:</strong> Đo ngay khi vừa thức dậy, <em>trước khi</em> bước ra khỏi giường, nói chuyện hay uống nước. Sử dụng nhiệt kế chuyên dụng (hiển thị 2 chữ số thập phân).</li>
                <li><strong>Ý nghĩa:</strong> Nhiệt độ thường tăng nhẹ (khoảng 0.3°C - 0.5°C) và giữ ở mức cao trong 3 ngày liên tục là dấu hiệu xác nhận <strong>trứng đã rụng</strong>.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">💧 Dịch nhầy cổ tử cung</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Cách kiểm tra:</strong> Quan sát trên giấy vệ sinh trước khi đi tiểu, hoặc rửa sạch tay và dùng ngón tay kiểm tra ở cửa mình.</li>
                <li><strong>Ý nghĩa:</strong> 
                  <br/>- <em>Khô/Ẩm:</em> Giai đoạn ít khả năng thụ thai.
                  <br/>- <em>Trơn/Dai (như lòng trắng trứng):</em> Đỉnh điểm thụ thai, <strong>trứng sắp rụng trong 24-48h</strong>.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">⭕ Vị trí Cổ tử cung</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Cách kiểm tra:</strong> Rửa sạch tay, ngồi xổm hoặc gác một chân lên bồn cầu. Đưa ngón tay trỏ vào âm đạo để cảm nhận cổ tử cung (cảm giác giống như chạm vào chóp mũi hoặc môi).</li>
                <li className="text-destructive/80">⚠️ <strong>Cảnh báo:</strong> Nếu bạn chưa từng quan hệ tình dục, bạn <strong>không nên</strong> thực hiện phương pháp này vì có thể làm rách màng trinh.</li>
                <li><strong>Ý nghĩa:</strong> 
                  <br/>- <em>Thấp, Cứng, Đóng:</em> Giống chóp mũi, thường xuất hiện sau khi rụng trứng hoặc sắp có kinh (ít khả năng thụ thai).
                  <br/>- <em>Cao, Mềm, Mở:</em> Giống đôi môi, xuất hiện quanh thời điểm rụng trứng (đỉnh điểm thụ thai).
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">🧪 Que thử rụng trứng (LH)</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Cách thử:</strong> Thử vào buổi chiều (10h sáng - 8h tối), hạn chế uống nhiều nước trước khi thử 2 tiếng.</li>
                <li><strong>Ý nghĩa:</strong> Kết quả <strong>Dương tính</strong> (2 vạch đậm bằng nhau hoặc vạch T đậm hơn vạch C) báo hiệu trứng sẽ rụng trong vòng 24-36h tới.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">😣 Triệu chứng tiền kinh nguyệt (PMS)</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Ghi nhận các dấu hiệu như: <strong>Đau ngực, nổi mụn, thèm ăn</strong> (báo hiệu kinh nguyệt sẽ đến trong 2-7 ngày).</li>
                <li><strong>Chuột rút, đau lưng dưới</strong> (báo hiệu kinh nguyệt có thể đến trong 24h tới).</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <CalendarHeart className="w-5 h-5 text-primary" />
              </div>
              4. Lên kế hoạch với Lịch
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/90 leading-relaxed space-y-2">
            <p>Tab <strong>Lịch</strong> giúp bạn nhìn xa hơn:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Hệ thống dự đoán chu kỳ và ngày rụng trứng cho nhiều năm tới.</li>
              <li>Rất hữu ích khi bạn cần lên kế hoạch đi du lịch, thi đấu thể thao hay các sự kiện quan trọng.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              5. Hỏi đáp cùng <strong>Bé Dâu</strong>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/90 leading-relaxed space-y-2">
            <p>Nếu có bất kỳ thắc mắc nào về tuổi dậy thì, sức khỏe sinh sản hay tâm sinh lý:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Vào tab <strong>Kiến thức</strong> và trò chuyện cùng trợ lý ảo <strong>Bé Dâu</strong>.</li>
              <li>Bé Dâu luôn sẵn sàng lắng nghe và giải đáp một cách thân thiện, dễ hiểu như một người bạn!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
