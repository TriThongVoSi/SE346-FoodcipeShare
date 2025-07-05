using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Data
{
    public class NguyenLieu
    {
        [Key]
        public int MaNL { get; set; }
        public string TenNL { get; set; }
        public decimal? Calories { get; set; }
        public string AnhNL { get; set; }

        public ICollection<CTCongThuc> CTCongThucs { get; set; }
    }
}
