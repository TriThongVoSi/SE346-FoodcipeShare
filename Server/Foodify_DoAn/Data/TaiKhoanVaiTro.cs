using Microsoft.AspNetCore.Identity;

namespace Foodify_DoAn.Data
{
    public class TaiKhoanVaiTro : IdentityUserRole<int>
    {
        public TaiKhoan TaiKhoan { get; set; }
        public VaiTro VaiTro { get; set; }
    }
}
