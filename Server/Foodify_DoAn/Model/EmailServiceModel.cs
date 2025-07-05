using System.ComponentModel.DataAnnotations;

namespace Foodify_DoAn.Model
{
    public class EmailServiceModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string? ClientUrl { get; set; }   
    }
}
