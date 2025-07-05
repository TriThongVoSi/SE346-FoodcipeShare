using Foodify_DoAn.Data;
using Foodify_DoAn.Model;
using Foodify_DoAn.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Reflection.Metadata.Ecma335;

namespace Foodify_DoAn.Service
{
    public class NguyenLieuService : INguyenLieuRepository
    {

        private readonly FoodifyContext _context;
        private readonly IAccountRepository _account;
        public NguyenLieuService(FoodifyContext context, IAccountRepository account)
        {
            _context = context;
            _account = account;
        }

        public async Task<NguyenLieu> addNguyenLieu(NguyenLieuInputDto nguyenLieuDto)
        {
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = nguyenLieuDto.Token });
            var role = await _account.CheckUserRole(new TokenModel { AccessToken = nguyenLieuDto.Token });
            if (user == null || role == -1 || role == 1) return null!;
            if (nguyenLieuDto == null) return null!;
            var nguyenLieu =  new NguyenLieu()
            {
                TenNL = nguyenLieuDto.TenNL,
                Calories = nguyenLieuDto.Calories,
                AnhNL = nguyenLieuDto.AnhNL
            };
            await _context.NguyenLieus.AddAsync(nguyenLieu);
            await _context.SaveChangesAsync();
            return nguyenLieu;

        }

        public async Task<bool> deleteNguyenLieu(DeleteNguyenLieuDto dto)
        {
            var account = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });
            var role = await _account.CheckUserRole(new TokenModel { AccessToken = dto.token });
            if (account == null || role != 0) return false;
            var nguyenLieu = await _context.NguyenLieus.FirstOrDefaultAsync(x => x.MaNL == dto.MaNl);
            if (nguyenLieu == null) return false;

            var ctNguyenLieu = await _context.CTCongThucs.Where(x => x.MaNL == dto.MaNl).ToListAsync();

            _context.CTCongThucs.RemoveRange(ctNguyenLieu);
            _context.NguyenLieus.Remove(nguyenLieu);
            await _context.SaveChangesAsync();
            return true; 


        }

        public async Task<List<NguyenLieu>> getAllNguyenLieu(string token)
        {
            if (string.IsNullOrEmpty(token)) return null;
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = token});
            if (user == null) return null;

            var nguyenLieus = _context.NguyenLieus.ToList();
            return nguyenLieus;
        }
    }
}
