using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Policy;

namespace Foodify_DoAn.Data
{
    [Table("CtDaShare")]
    public class CtDaShare
    {
        public int MaShare { get; set; }
        public int MaND { get; set; }
        public int MaCT { get; set; }

        public DateTime ThoiGian { get; set; }

        public NguoiDung NguoiDung { get; set; }
        public CongThuc CongThuc { get; set; }
    }
}
