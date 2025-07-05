using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Model
{
    public class NguyenLieuOutputDto
    {

        [Required]
        public int MaNL { get; set; }
        [Required]

        public string TenNL { get; set; } = null!;

        public decimal DinhLuong { get; set; }

        [Required]

        public string DonViTinh { get; set; } = null!;
    }
}
