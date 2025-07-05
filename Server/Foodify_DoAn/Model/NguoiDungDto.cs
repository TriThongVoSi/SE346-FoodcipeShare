using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Model
{
    public class NguoiDungDto
    {
        [Key]
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
        public bool isFollowed { get; set; }

    }
}
