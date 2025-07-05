using Foodify_DoAn.Data;
using Foodify_DoAn.Model;
using Foodify_DoAn.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters.Xml;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using StackExchange.Redis;

namespace Foodify_DoAn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NguoiDungController : ControllerBase
    {
        public readonly FoodifyContext _context;

        private readonly INguoiDungRepository _nguoiDungRepo; 
        public NguoiDungController(FoodifyContext context, INguoiDungRepository repository )
        {
            _nguoiDungRepo = repository; 
            _context = context;
        }

        [HttpPost("getAll")]
        public async  Task<IActionResult> getAllNguoiDungs([FromBody]string token)
        {
            var result = await _nguoiDungRepo.getAllNguoiDung( token);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpPost("getAllThongBao")]
        public async Task<IActionResult> getAllThongBao([FromBody]string token)
        {
            var result = await _nguoiDungRepo.getAllThongBao(token);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpPost("getoneuserinfo")]

        public async Task<IActionResult> getOneUserInfo([FromBody] GetOneUserInfo getOneUserInfo)
        {
            var result = await _nguoiDungRepo.getUserInfor(getOneUserInfo);
            if (result == null) return NotFound();
            return Ok(result);
        }
        [HttpPost("followUser")]

        public async Task<IActionResult> followUser(FollowUserDto followUserDto)
        {
            var result = await _nguoiDungRepo.FollowOneUser(followUserDto);
            if (result == false) return NotFound("Có lỗi xảy ra");
            return Ok("Theo dõi thành công");
        }
        [HttpPost("seenOnePost")]
        public async Task<IActionResult> seenOnePost(SeenOnePost dto)
        {
            var result = await _nguoiDungRepo.SeenOneNotification(dto);
            if (result == -1) return NotFound();
            return Ok(result);
        }
    }
}
