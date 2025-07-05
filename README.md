# ĐỒ ÁN LẬP TRÌNH TRÊN THIẾT BỊ DI ĐỘNG
# NGUYỄN TẤN TOÀN
# FoodcipeShare

FoodcipeShare là ứng dụng chia sẻ công thức nấu ăn, gồm frontend (React Native/Expo) và backend (ASP.NET Core/.NET 8, PostgreSQL, Docker). Ứng dụng cho phép người dùng đăng ký, đăng nhập, đăng bài, bình luận, lưu và chia sẻ công thức, quản lý nguyên liệu, nhận thông báo, v.v.

## Cấu trúc dự án

```
FoodcipeShare/
├── Cilent/           # Frontend React Native (Expo)
│   ├── src/
│   │   ├── API/      # Định nghĩa endpoint API
│   │   ├── assets/   # Ảnh, icon, font
│   │   ├── components/ # Các component UI
│   │   ├── constants/  # Theme, biến màu sắc
│   │   ├── helpers/    # Hàm tiện ích
│   │   ├── screens/    # Các màn hình chính
│   │   └── App.js      # Khởi tạo app, navigation
│   ├── app.json      # Cấu hình Expo
│   ├── package.json  # Thông tin package, script
│   └── ...
├── Server/           # Backend ASP.NET Core
│   └── Foodify_DoAn/
│       ├── Controllers/ # API controllers (Account, CongThuc, NguoiDung, NguyenLieu, Image)
│       ├── Data/        # Entity, DbContext
│       ├── Model/       # DTO, model phụ trợ
│       ├── Repository/  # Interface repository
│       ├── Service/     # Triển khai service
│       ├── Migrations/  # Migration DB
│       ├── Program.cs   # Khởi tạo app
│       ├── appsettings.json # Cấu hình
│       ├── Dockerfile   # Docker build/run
│       └── ...
└── README.md          # Hướng dẫn tổng quan
```

## Chức năng chính

### Frontend (Cilent)
- Đăng ký, xác thực OTP, đăng nhập, đổi mật khẩu, quên mật khẩu
- Trang chủ, dashboard, tìm kiếm, xem chi tiết công thức
- Đăng bài, chỉnh sửa, xóa bài, bình luận, like, share, lưu công thức
- Quản lý nguyên liệu, thêm/xóa nguyên liệu
- Quản lý hồ sơ cá nhân, chỉnh sửa thông tin
- Thông báo, theo dõi người dùng khác
- Giao diện đẹp, responsive, hỗ trợ Android/iOS/Web (Expo)

### Backend (Server)
- API xác thực JWT, quản lý tài khoản, OTP qua email
- Quản lý công thức, nguyên liệu, bình luận, thông báo
- Quản lý người dùng, theo dõi, phân quyền (admin/user)
- Upload ảnh (Cloudinary)
- Swagger UI docs tại `/swagger`
- Hỗ trợ Docker, cấu hình môi trường qua biến môi trường/appsettings

## Hướng dẫn cài đặt

### 1. Yêu cầu
- Node.js >= 16, npm >= 8
- Expo CLI (`npm install -g expo-cli`)
- .NET 8 SDK
- PostgreSQL
- Docker (nếu muốn chạy backend bằng container)

### 2. Cài đặt & chạy Frontend (Cilent)
```bash
cd Cilent
npm install
npm start # hoặc expo start
```
- Để build Android/iOS: dùng `expo run:android` hoặc `expo run:ios`
- App sẽ kết nối API backend qua URL trong `src/API/index.js`

### 3. Cài đặt & chạy Backend (Server)
#### a. Chạy bằng Docker
```bash
cd Server/Foodify_DoAn
# Sửa appsettings.json hoặc đặt biến môi trường cho DB, JWT, Email, Cloudinary
# Build và chạy container:
docker build -t foodify-backend .
docker run -d -p 8080:8080 --env-file .env foodify-backend
```
- API docs: http://localhost:8080/swagger

#### b. Chạy thủ công
```bash
cd Server/Foodify_DoAn
# Sửa appsettings.json hoặc đặt biến môi trường
# Update DB nếu cần:
dotnet ef database update
# Chạy app:
dotnet run
```
- Mặc định chạy ở http://localhost:5000 hoặc PORT bạn cấu hình

### 4. Cấu hình môi trường
- Sửa file `appsettings.json` hoặc dùng biến môi trường cho:
  - ConnectionStrings:MyDB (PostgreSQL)
  - JWT:ValidAudience, ValidIssuer, SecretKey
  - EmailSettings (SMTP)
  - CloudinarySettings (Cloudinary API)
  
## API Keys
Dự án này sử dụng 1 API kiểm duyệt bình luận:
- **Gemini Flash (Google AI)**: Đăng ký và lấy API key tại https://makersuite.google.com/app/apikey

Sau đó cập nhật file cấu hình (hoặc thay thế trực tiếp trong code) với các giá trị:
```jsx
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

---
FoodcipeShare - Đồ án chia sẻ công thức nấu ăn, hỗ trợ học tập và sáng tạo ẩm thực! 

---
Tác giả: [Nguyễn Ngọc Anh Khoa - Phạm Bảo Khang - Từ Minh Khoa - Võ Sĩ Trí Thông] 
---
Nếu cần file .docx báo cáo đồ án liên hệ qua gmail vosithongtri@gmail.com (hạt dẻ 150 cành cả nhóm)
