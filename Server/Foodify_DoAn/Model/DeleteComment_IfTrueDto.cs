namespace Foodify_DoAn.Model
{
    public class DeleteComment_IfTrueDto
    {
        public string token { get; set; }
        public int MaComment { get; set; }
        public bool canDelete { get; set; }
    }
}
