using Foodify_DoAn.Data;
using Foodify_DoAn.Model;

namespace Foodify_DoAn.Repository
{
    public interface INguyenLieuRepository
    {
        Task<List<NguyenLieu>>getAllNguyenLieu(string token);

        Task<NguyenLieu> addNguyenLieu(NguyenLieuInputDto nguyenLieuDto);
        Task<bool> deleteNguyenLieu(DeleteNguyenLieuDto dto);
    };
}
