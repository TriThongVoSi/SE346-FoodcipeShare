using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Data
{
    public class NguoiDung
    {
        [Key]
        public int MaND { get; set; }
        public int MaTK { get; set; }
        public string TenND { get; set; }
        public bool? GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string TieuSu { get; set; }
        public string SDT { get; set; }
        public string Email { get; set; }
        public string DiaChi { get; set; }
        public int LuotTheoDoi { get; set; }
        public string AnhDaiDien { get; set; }

        public int DeletedPost { get; set; } = 0; // Số lượng bài viết đã bị xóa

        public bool IsValid { get; set; } = true;
        public TaiKhoan TaiKhoan { get; set; }
        public ICollection<DanhGia> DanhGias { get; set; }
        public ICollection<CTDaLuu> CTDaLuus { get; set; }
        public ICollection<CTDaThich> CTDaThichs { get; set; }
        public ICollection<ThongBao> ThongBaos { get; set; }
        public ICollection<TheoDoi> Followers { get; set; }
        public ICollection<TheoDoi> Followeds { get; set; }
        public ICollection<CongThuc> CongThucs { get; set; }

        public ICollection<CtToCaos> CtToCaos { get; set; }
        public ICollection<CtDaShare> CtDaShare { get; set; }
        public ICollection<Comment> Comments { get; set;  }
    }
}
