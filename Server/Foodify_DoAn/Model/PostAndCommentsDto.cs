using System.Security.Policy;

namespace Foodify_DoAn.Model
{
    public class PostAndCommentsDto
    {
       
        public PostResultDto post { get; set; }

        public List<CommentResultDto> comments { get; set; } = new List<CommentResultDto>();
    }
}
