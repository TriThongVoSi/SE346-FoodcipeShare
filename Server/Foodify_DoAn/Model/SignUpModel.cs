using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Model
{
    public class SignUpModel
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        [Required]
        public string confirmPassword { get; set; } = null!;
    }
}
