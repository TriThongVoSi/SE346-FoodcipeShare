using Microsoft.AspNetCore.Identity;

namespace Foodify_DoAn.Data
{
    public class TaiKhoan : IdentityUser<int>
    {
        public NguoiDung NguoiDung { get; set; }
        public ICollection<TaiKhoanVaiTro> TaiKhoanVaiTros { get; set; }
    }
}
