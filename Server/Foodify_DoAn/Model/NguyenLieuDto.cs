using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace Foodify_DoAn.Model
{

    public class NguyenLieuDto
    {
        [Required]
        public int MaNL { get; set; }
        [Required]

        public decimal DinhLuong { get; set; }

        [Required]

        public string DonViTinh { get; set; } = null!;
      
    }
}
