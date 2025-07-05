using Microsoft.AspNetCore.Identity;

namespace Foodify_DoAn.Data
{
    public class VaiTro : IdentityRole<int>
    {
        public ICollection<TaiKhoanVaiTro> TaiKhoanVaiTros { get; set; }
    }
}
