using System.Security.Policy;

namespace Foodify_DoAn.Model
{
    public class ApiResponse
    {
        public bool Success { get; set; }

        public string Message { get; set; } = null!;

        public Object Data { get; set; } = null!; 
    }
}
