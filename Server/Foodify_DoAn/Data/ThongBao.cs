using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Data
{
    public class ThongBao
    {
        [Key]
        public int MaTB { get; set; }
        public int MaND { get; set; }

        public int MaBaiViet { get; set; }
        public string NoiDung { get; set; }
        public bool DaXem { get; set; }
        public DateTime NgayTao { get; set; }

      
        public NguoiDung NguoiDung { get; set; }
    }
}
