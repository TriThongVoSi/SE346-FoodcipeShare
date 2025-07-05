using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Foodify_DoAn.Data
{
    [Table("CongThuc")]
    public class CongThuc
    {
        [Key]
        public int MaCT { get; set; }
        public string TenCT { get; set; }
        public string MoTaCT { get; set; }
        public decimal TongCalories { get; set; }
        public string AnhCT { get; set; }
        public int LuotXem { get; set; }

        public int LuotComment { get; set; }
        public int LuotLuu { get; set; }
        public int LuotThich { get; set; }

        public int LuotToCao { get; set; }
        public int LuotShare { get; set; }
        public int MaND { get; set; }
        public DateTime NgayCapNhat { get; set; }

        public ICollection<CTCongThuc> CTCongThucs { get; set; }
        public ICollection<DanhGia> DanhGias { get; set; }
        public ICollection<CTDaLuu> CTDaLuus { get; set; }
        public ICollection<CTDaThich> CTDaThichs { get; set; }

        public ICollection<CtToCaos> CtToCaos { get; set; }
        public ICollection<CtDaShare> CtDaShares { get; set;  }
        public ICollection<Comment> Comments { get; set; }
        public NguoiDung NguoiDung { get; set; } = null!;
    }

}
    