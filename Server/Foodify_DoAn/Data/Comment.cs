using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Data
{
    public class Comment
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaComment { get; set; }
        [Required]
        public int MaND { get; set; } // Mã người dùng

        [Required]
        public int MaBaiViet { get; set; } // Mã bài viết

        [Required]
        public string NoiDung { get; set; }

        public DateTime ThoiGian { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public NguoiDung NguoiDung { get; set; }
        public CongThuc CongThuc { get; set; }
    }
}
