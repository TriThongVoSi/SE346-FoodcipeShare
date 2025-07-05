using System.ComponentModel;

namespace Foodify_DoAn.Model
{
    public class CommentResultDto
    {

        public NguoiDungCommentDto tacgia { get; set; }
        public DateTime NgayBinhLuan { get; set; } 

        public int MaComment { get; set; }

        public string NoiDung { get;set; }

        public bool canDeleted { get; set; }
    }
}
