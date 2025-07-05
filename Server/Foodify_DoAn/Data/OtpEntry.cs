using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace Foodify_DoAn.Data
{
    [Table("OtpEntry")]
    public class OtpEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Otp { get; set; } = null!;
        public string? Password { get; set; }  
        public DateTime Expiration { get; set; }
    }
}
