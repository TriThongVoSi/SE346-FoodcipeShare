using Foodify_DoAn.Data;

namespace Foodify_DoAn.Model
{
    public class RecipeDto
    {
        public string token { get; set; }
        public string TenCT { get; set; }
        public string MoTaCT { get; set; }
        public decimal TongCalories { get; set; }
        public string AnhCT { get; set; }
        public int LuotXem { get; set; }
        public int LuotLuu { get; set; }
        public int LuotThich { get; set; }
        public DateTime NgayCapNhat { get; set; }

        public List<CtCongThucDto> NguyenLieus { get; set; }

    }
}
