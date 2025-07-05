using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Data
{
    public class DanhGia
    {
        [Key]
        public int MaBL { get; set; }
        public int? MaND { get; set; }
        public int MaCT { get; set; }
        public int Diem { get; set; }
        public string NoiDung { get; set; }
        public DateTime NgayTao { get; set; }

        public NguoiDung NguoiDung { get; set; }
        public CongThuc CongThuc { get; set; }
    }
}
