using Foodify_DoAn.Data;
using Foodify_DoAn.Model;
using Microsoft.AspNetCore.Components.Web;

namespace Foodify_DoAn.Repository
{
    public interface INguoiDungRepository
    {

        public Task<List<NguoiDung>> getAllNguoiDung(string token);

        public Task<List<ThongBaoResultDto>> getAllThongBao(string token);

        public Task<NguoiDungDto> getUserInfor(GetOneUserInfo info);

        public Task<bool> FollowOneUser(FollowUserDto dto);
        public Task<int> SeenOneNotification(SeenOnePost dto);
    }
}
