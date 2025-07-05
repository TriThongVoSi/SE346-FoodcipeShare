using Foodify_DoAn.Data;
using Foodify_DoAn.Model;
using Microsoft.AspNetCore.Components.Web;
using StackExchange.Redis;
using System.Diagnostics.Eventing.Reader;
using System.Security.Policy;

namespace Foodify_DoAn.Repository
{
    public interface IRecipeRepository
    {
        public Task<List<PostResultDto>> getAllCongThucs(RecipeRequestDto recipe);

        public Task<CongThuc> getByID(int id);

        public Task<RecipeResultDto> addCongThuc(RecipeDto congthuc);

        public Task<CongThuc> updateCongThuc(int id, RecipeDto congthuc);

        public Task<bool> deleteCongThuc(Like_Share_GetOnePostDto dto);

        public Task<bool> ReportCongThuc(Like_Share_GetOnePostDto dto);
        public Task<bool> LikeCongThuc(Like_Share_GetOnePostDto dto);

        public Task<bool> CommentCongThuc(CommentPostDto dto);
        public Task<bool> ShareCongThuc(Like_Share_GetOnePostDto dto);

        public Task<PostAndCommentsDto> GetOnePostInDetail(Like_Share_GetOnePostDto dto);

        public Task<List<PostResultDto>> GetAllUserAndSharedPost(string token);

        public  Task<bool> DeleteComment(DeleteComment_IfTrueDto dto);

        public Task<bool> DeleteCommentForAdmin(DeleteCommentDto dto);
        public Task<List<PostResultDto>> getOneUserAndSharedPost(OneUserPostDto oneUserPostDto);
        public Task<List<PostResultDto>> FindPost(FindPostInputDto dto);

        public Task<List<CommentResultDto>> GetComment(Like_Share_GetOnePostDto dto);

     
     

    }
}
