using System.Security.Policy;

namespace Foodify_DoAn.Model
{
    public class ConfirmOtp
    {
        public string email { get; set; } = null!;
        public string otp { get; set; } = null!;  
    }
}
