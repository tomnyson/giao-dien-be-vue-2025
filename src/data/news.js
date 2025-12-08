export const newsPosts = [
  {
    id: 'n-001',
    slug: 'ai-va-tuong-lai-mua-sam',
    title: 'AI và tương lai trải nghiệm mua sắm trực tuyến',
    category: 'Công nghệ',
    author: 'Vũ Minh',
    date: '2025-01-05',
    cover: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Công nghệ AI đang thay đổi cách người dùng tìm kiếm, so sánh và đặt hàng trên các nền tảng thương mại điện tử.',
    content: `
      <p>Trí tuệ nhân tạo (AI) đã đi từ khái niệm xa lạ đến công cụ không thể thiếu trong thương mại điện tử. 
      Từ các đề xuất cá nhân hóa đến chatbot hỗ trợ 24/7, AI đang giúp doanh nghiệp rút ngắn hành trình mua hàng 
      và tăng tỷ lệ chuyển đổi.</p>
      <p>Một số ứng dụng nổi bật:</p>
      <ul>
        <li>Đề xuất sản phẩm theo hành vi duyệt web và lịch sử mua hàng.</li>
        <li>Chatbot thông minh hỗ trợ khách hàng tự phục vụ.</li>
        <li>Phân tích dữ liệu để tối ưu tồn kho và định giá động.</li>
      </ul>
      <p>Trong 2-3 năm tới, chúng ta sẽ thấy nhiều trải nghiệm tương tác hơn như thử đồ AR/VR và tư vấn bằng giọng nói.</p>
    `
  },
  {
    id: 'n-002',
    slug: 'xu-huong-giao-hang-xanh',
    title: 'Xu hướng giao hàng xanh: tối ưu chi phí và bảo vệ môi trường',
    category: 'Logistics',
    author: 'Lan Anh',
    date: '2025-01-10',
    cover: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Giao hàng xanh không chỉ là khẩu hiệu. Doanh nghiệp đang giảm phát thải bằng quy trình tối ưu và bao bì tái chế.',
    content: `
      <p>Áp lực giảm phát thải thúc đẩy các sàn TMĐT thử nghiệm tuyến giao hàng ngắn hơn, kết hợp kho trung chuyển và xe điện.</p>
      <p>3 bước dễ triển khai:</p>
      <ol>
        <li>Tối ưu lộ trình giao bằng thuật toán, giảm quãng đường trống.</li>
        <li>Dùng vật liệu đóng gói tái chế và chuẩn kích thước để giảm rác thải.</li>
        <li>Khuyến khích người dùng chọn giao tiêu chuẩn thay vì giao siêu tốc khi không cần thiết.</li>
      </ol>
      <p>Kết quả là chi phí giao hàng giảm, hình ảnh thương hiệu được cải thiện.</p>
    `
  },
  {
    id: 'n-003',
    slug: 'bao-mat-thanh-toan-2025',
    title: 'Bảo mật thanh toán 2025: 3 lớp bảo vệ cho cửa hàng online',
    category: 'Bảo mật',
    author: 'Quốc Huy',
    date: '2025-01-15',
    cover: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Việc gia tăng gian lận trực tuyến khiến các cửa hàng phải trang bị thêm lớp bảo vệ cho giao dịch.',
    content: `
      <p>Các hình thức tấn công như phishing, chiếm đoạt tài khoản và thẻ giả đang tăng. Một mô hình 3 lớp gợi ý:</p>
      <ul>
        <li>Xác thực đa yếu tố (MFA) cho bước thanh toán và quản trị.</li>
        <li>Phát hiện gian lận theo hành vi (ví dụ kiểm tra IP lạ, tốc độ đặt đơn bất thường).</li>
        <li>Mã hóa end-to-end và tuân thủ PCI DSS khi lưu trữ thông tin thẻ.</li>
      </ul>
      <p>Doanh nghiệp cần liên tục diễn tập kịch bản sự cố và cập nhật quy trình phản ứng nhanh.</p>
    `
  }
]

export const getNewsBySlug = (slug) => newsPosts.find(p => p.slug === slug)
export const getCategories = () => Array.from(new Set(newsPosts.map(p => p.category)))
