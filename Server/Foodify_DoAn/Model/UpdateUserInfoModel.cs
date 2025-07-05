namespace Foodify_DoAn.Model
{
    public class UpdateUserInfoModel
    {
        public string token { get; set; } = string.Empty;
        public string TenND { get; set; } = string.Empty;
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public string SDT { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string TieuSu { get; set; } = string.Empty;

        public string Avatar { get; set; } = string.Empty;


    }
}
