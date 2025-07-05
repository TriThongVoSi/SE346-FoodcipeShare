namespace Foodify_DoAn.Model
{
    public class RecipeRequestDto
    {
        public int PageNumber { get; set; } = 1;  // Mặc định trang là 1 nếu không truyền
        public int PageSize { get; set; } = 10;  // Mặc định số lượng công thức mỗi trang là 10
        public string Token { get; set; }  // Token của người dùng
    }
}
