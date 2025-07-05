namespace Foodify_DoAn.Model
{
    public class CommentPostDto
    {
        public Like_Share_GetOnePostDto like_share { get; set; } = null!;

        public string Comment { get; set; } = null!;
    }
}
