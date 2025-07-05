using Foodify_DoAn.Data;
using Foodify_DoAn.Model;
using Foodify_DoAn.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
using System.Net.WebSockets;

namespace Foodify_DoAn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CongThucController : ControllerBase
    {
        private readonly IRecipeRepository _repository;

        public CongThucController(IRecipeRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("getAll")]
        public async Task<IActionResult> getAllCongthucs([FromBody] RecipeRequestDto recipe)
        {
            var congthucs = await _repository.getAllCongThucs(recipe);

            return Ok(congthucs);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> getCongThucByID(int id)
        {
            var congthuc = await _repository.getByID(id);
            if (congthuc == null) return NotFound("Công thức không tồn tại");
            return Ok(congthuc);
        }

        [HttpPost("addcongthuc")]
        public async Task<IActionResult> addCongThuc([FromBody] RecipeDto recipe)
        {
            var congthuc = await _repository.addCongThuc(recipe);
            if (congthuc == null) return NotFound("không thể thêm công thức, vui lòng đăng nhập");
            return Ok(congthuc);

        }

        [HttpPut("updatecongthuc")]
        public async Task<IActionResult> updateCongThuc(int id, RecipeDto recipe)
        {
            var congthuc = await _repository.updateCongThuc(id, recipe);
            if (congthuc == null) return NotFound("Không thể chỉnh sửa công thức");
            return Ok(congthuc);
        }
        [HttpDelete("deletecongthuc")]
        public async Task<IActionResult> deleteCongThuc(Like_Share_GetOnePostDto dto)
        {
            var congthuc = await _repository.deleteCongThuc(dto);
            if (congthuc == false) return Unauthorized("Không thể xóa công thức");
            return Ok("Xóa thành công");
        
        }
        [HttpDelete("deleteCommentForAdmin")]
        public async Task<IActionResult> deleteCommentForAdmin(DeleteCommentDto dto) {
            var result = await _repository.DeleteCommentForAdmin(dto);
            if (result == false) return Unauthorized();
            return Ok("Xóa thành công");
                
                }

        [HttpPost("LikePost")]
        public async Task<IActionResult> likePost(Like_Share_GetOnePostDto dto)
        {
            var result = await _repository.LikeCongThuc(dto);
            if (result == false) return NotFound("Các thông tin không tồn tại");
            return Ok("Like thành công");
        }

        [HttpPost("CommentPost")]
        public async Task<IActionResult> commmentPost(CommentPostDto commentPostDto)
        {
            var result = await _repository.CommentCongThuc(commentPostDto);
            if (result == false) return NotFound("Các thông tin không tồn tại");
            return Ok("Comment thành công");

        }
        [HttpPost("ShareCongthuc")]
        public async Task<IActionResult> sharePost(Like_Share_GetOnePostDto like_Share_GetOnePostDto)
        {
            var result = await _repository.ShareCongThuc(like_Share_GetOnePostDto);
            if (result == false) return NotFound("Thông tin không tồn tại");
            return Ok("Share thành công ");
        }
        [HttpPost("getDetailedPost")]

        public async Task<IActionResult> getDetailedPosts(Like_Share_GetOnePostDto like_Share_GetOnePostDto)
        {
            var result = await _repository.GetOnePostInDetail(like_Share_GetOnePostDto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("getallPostandSharedPost")]
        public async Task<IActionResult> getAllandSharedPosts([FromBody] string token)
        {
            var result = await _repository.GetAllUserAndSharedPost(token);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpPost("findPosts")]

        public async Task<IActionResult> findPost(FindPostInputDto dto)
        {
            var result = await _repository.FindPost(dto);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpPost("getComment")]
        public async Task<IActionResult> getComments(Like_Share_GetOnePostDto dto)
        {
            var result = await _repository.GetComment(dto);
            if (result == null) return NotFound();
            return Ok(result);  
        }

        [HttpPost("deleteComment")]
        public async  Task<IActionResult> deleteComment_If_True(DeleteComment_IfTrueDto dto)
        {
            var result = await _repository.DeleteComment(dto);
            if (result == false) return BadRequest();
            return Ok();
        }
        [HttpPost("getOneUserAndSharedPost")]
        public async Task<IActionResult> getOneUserAndSharedPosts (OneUserPostDto dto )
        {
            var result = await _repository.getOneUserAndSharedPost(dto);
            if (result == null) return NotFound();
            return Ok(result);  
        }
        [HttpPost("reportCongthuc")]
        public async Task<IActionResult> reportOnePost(Like_Share_GetOnePostDto dto)
        {
            var result = await _repository.ReportCongThuc(dto);
            if (result == false) return BadRequest(result);
            return Ok("Báo cáo thành công");
        }
    }
}
 
