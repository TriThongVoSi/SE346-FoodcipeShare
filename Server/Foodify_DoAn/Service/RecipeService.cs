using AutoMapper;
using AutoMapper.Features;
using Castle.Components.DictionaryAdapter.Xml;
using Castle.Core.Logging;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet.Core;
using DotNetEnv;
using Foodify_DoAn.Data;
using Foodify_DoAn.Migrations;
using Foodify_DoAn.Model;
using Foodify_DoAn.Repository;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Validations;
using Microsoft.VisualBasic;
using Newtonsoft.Json.Linq;
using Npgsql.EntityFrameworkCore.PostgreSQL.Storage.Internal;
using Npgsql.PostgresTypes;
using Npgsql.Replication;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Mail;
using System.Net.NetworkInformation;
using System.Reflection.PortableExecutable;
using System.Security.Cryptography;

namespace Foodify_DoAn.Service
{
    public class RecipeService : IRecipeRepository
    {
        private readonly FoodifyContext _context;
        private readonly IMapper _dbMapper;
        private readonly IAccountRepository _account;


        public RecipeService(FoodifyContext context, IMapper dbMapper, IAccountRepository accountRepository)
        {
            _context = context;
            _dbMapper = dbMapper;
            _account = accountRepository;
        }

        public async Task<RecipeResultDto> addCongThuc( RecipeDto congthuc)
        {
            if (string.IsNullOrEmpty(congthuc.token)) return null;
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = congthuc.token });
            if (user == null) return null;

            var nguoiDung = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == user.Id);
            if (nguoiDung == null) return null; 


            CongThuc recipe = new CongThuc();
             _dbMapper.Map(congthuc, recipe);
            recipe.MaND = nguoiDung.MaND;
            recipe.NguoiDung = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaND == nguoiDung.MaND);
            await _context.CongThucs.AddAsync(recipe);
            await _context.SaveChangesAsync();

            List<NguyenLieuDto> nguyenLieuList = new List<NguyenLieuDto>();

            foreach (var nl in congthuc.NguyenLieus)
            {
                var CtCongThuc = new CTCongThuc
                {
                    MaCT = recipe.MaCT,
                    MaNL = nl.MaNL,
                    DinhLuong = nl.DinhLuong,
                    DonViTinh = nl.DonViTinh
                };
                await _context.CTCongThucs.AddAsync(CtCongThuc);

                nguyenLieuList.Add(new NguyenLieuDto
                {
                    MaNL = nl.MaNL,
                    DinhLuong = nl.DinhLuong,
                    DonViTinh = nl.DonViTinh
                });
            }

            await _context.SaveChangesAsync();

            var result = new RecipeResultDto
            {
                MaCT = recipe.MaCT,
                TenCT = recipe.TenCT,
                NguyenLieus = nguyenLieuList
            };

            return result;
        }

   

        public async Task<bool> deleteCongThuc(Like_Share_GetOnePostDto dto)
        {
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });
            var role = await _account.CheckUserRole(new TokenModel { AccessToken = dto.token });
            if (user == null || role != 0) return false; 
            

            var congthuc = await _context.CongThucs.FindAsync(dto.IdCongThuc);
            if (congthuc == null) return false;
            _context.Remove(congthuc);

            var author = await _context.NguoiDungs.FirstOrDefaultAsync(x=> x.MaND == congthuc.MaND);
            if (author == null) return false;

            author.DeletedPost++;
            if (author.DeletedPost >= 5) author.IsValid = false;
            
            await _context.SaveChangesAsync();
            return true; 
        }

        public async Task<List<PostResultDto>> getAllCongThucs(RecipeRequestDto recipe)
        {
            if (recipe == null)
                throw new ArgumentNullException(nameof(recipe));

            int skip = (recipe.PageNumber - 1) * recipe.PageSize;
            int take = recipe.PageSize;

            // Authenticate user once
            var user = string.IsNullOrEmpty(recipe.Token)
                ? null
                : await _account.AuthenticationAsync(new TokenModel { AccessToken = recipe.Token });
            if (user == null) return null;
            var nguoidung = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == user.Id);
            if (nguoidung == null) return null!;
            List<int> followingUserIds = new();

            if (user != null)
            {
                followingUserIds = await _context.TheoDois
                    .Where(x => x.Following_ID == user.Id)
                    .Select(a => a.Followed_ID)
                    .ToListAsync();
            }

            // Query recipes along with their authors
            var recipeDtos = await _context.CongThucs
                .Include(ct => ct.CTCongThucs)
                .Join(_context.NguoiDungs,
                    ct => ct.MaND,
                    nd => nd.MaND,
                    (ct, nd) => new { CongThuc = ct, TacGia = nd })

                .OrderByDescending(x => followingUserIds.Contains(x.CongThuc.MaND))
                .ThenByDescending(x => x.CongThuc.NgayCapNhat)
                .Skip(skip)
                .Take(take)
                .Select(x => new PostResultDto
                {
                    MaCT = x.CongThuc.MaCT,
                    TenCT = x.CongThuc.TenCT,
                    MoTaCT = x.CongThuc.MoTaCT,
                    TongCalories = x.CongThuc.TongCalories,
                    AnhCT = x.CongThuc.AnhCT,
                    LuotXem = x.CongThuc.LuotXem,
                    LuotLuu = x.CongThuc.LuotLuu,
                    LuotComment = _context.Comments.Where(a => a.MaBaiViet == x.CongThuc.MaCT).Count(),
                    LuotShare = _context.CtDaShares.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                    LuotToCao = _context.CtToCaos.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                    LuotThich = _context.CTDaThichs.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                    isLiked = _context.CTDaThichs.Any(c => c.MaCT == x.CongThuc.MaCT && c.MaND == nguoidung.MaND),
                    isReported = _context.CtToCaos.Any(c => c.MaCT == x.CongThuc.MaCT && c.MaND == nguoidung.MaND),

                    TacGia = new NguoiDungDto
                    {

                        MaTK = x.TacGia.MaTK,
                        TenND = x.TacGia.TenND,
                        GioiTinh = x.TacGia.GioiTinh,
                        NgaySinh = x.TacGia.NgaySinh,
                        TieuSu = x.TacGia.TieuSu,
                        SDT = x.TacGia.SDT,
                        Email = x.TacGia.Email,
                        DiaChi = x.TacGia.DiaChi,
                        LuotTheoDoi = x.TacGia.LuotTheoDoi,
                        AnhDaiDien = x.TacGia.AnhDaiDien,
                        isFollowed = _context.TheoDois.Any(a => a.Following_ID == nguoidung.MaND && a.Followed_ID == x.TacGia.MaND)
                    },
                    NguyenLieus = x.CongThuc.CTCongThucs
                    .Join(_context.NguyenLieus,
                        ad => ad.MaNL,
                        af => af.MaNL,
                        (ad, af) => new { CTCongThuc = ad, NguyenLieu = af }
                    )
                    .Select(a => new NguyenLieuOutputDto
                    {

                        MaNL = a.NguyenLieu.MaNL,
                        TenNL = a.NguyenLieu.TenNL,
                        DinhLuong = a.CTCongThuc.DinhLuong,
                        DonViTinh = a.CTCongThuc.DonViTinh

                    }).ToList()
                })
                .ToListAsync();

            return recipeDtos;
        }


        public async Task<CongThuc> getByID(int id)
        {
            var recipe = await _context.CongThucs.FindAsync(id);
            if (recipe == null) return null!;
            return recipe;
        }

        public async Task<PostAndCommentsDto> GetOnePostInDetail(Like_Share_GetOnePostDto request)
        {
            var account = await _account.AuthenticationAsync(new TokenModel { AccessToken = request.token });

            if (account == null) return null!;

            var nguoidung = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == account.Id);
            if (nguoidung == null) return null;

            var post = await _context.CongThucs.FirstOrDefaultAsync(x => x.MaCT == request.IdCongThuc);

            if (post == null) return null!;



            var user = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == account.Id);
            if (user == null) return null!;
            var recipeDtos = await _context.CongThucs
               .Include(ct => ct.CTCongThucs)
               .Where(x => x.MaCT == request.IdCongThuc )
               .Join(_context.NguoiDungs,
                   ct => ct.MaND,
                   nd => nd.MaND,
                   (ct, nd) => new { CongThuc = ct, TacGia = nd })

               .Select(x => new PostResultDto
               {
                   MaCT = x.CongThuc.MaCT,
                   TenCT = x.CongThuc.TenCT,
                   MoTaCT = x.CongThuc.MoTaCT,
                   TongCalories = x.CongThuc.TongCalories,
                   AnhCT = x.CongThuc.AnhCT,
                   LuotXem = x.CongThuc.LuotXem,
                   LuotLuu = x.CongThuc.LuotLuu,
                   LuotComment = _context.Comments.Where(a => a.MaBaiViet == x.CongThuc.MaCT).Count(),
                   LuotShare = _context.CtDaShares.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                   LuotToCao = _context.CtToCaos.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),

                   LuotThich = _context.CTDaThichs.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                   isLiked = _context.CTDaThichs.Any(c => c.MaCT == x.CongThuc.MaCT && c.MaND == user.MaND),
                   isReported = _context.CtToCaos.Any(c => c.MaCT == x.CongThuc.MaCT && c.MaND == user.MaND),

                   TacGia = new NguoiDungDto
                   {

                       MaTK = x.TacGia.MaTK,
                       TenND = x.TacGia.TenND,
                       GioiTinh = x.TacGia.GioiTinh,
                       NgaySinh = x.TacGia.NgaySinh,
                       TieuSu = x.TacGia.TieuSu,
                       SDT = x.TacGia.SDT,
                       Email = x.TacGia.Email,
                       DiaChi = x.TacGia.DiaChi,
                       LuotTheoDoi = x.TacGia.LuotTheoDoi,
                       AnhDaiDien = x.TacGia.AnhDaiDien,
                       isFollowed = _context.TheoDois.Any(a => a.Following_ID == user.MaND && a.Followed_ID == x.TacGia.MaND)

                   },
                   NguyenLieus = x.CongThuc.CTCongThucs
                   .Join(_context.NguyenLieus,
                       ad => ad.MaNL,
                       af => af.MaNL,
                       (ad, af) => new { CTCongThuc = ad, NguyenLieu = af }
                   )
                   .Select(a => new NguyenLieuOutputDto
                   {

                       MaNL = a.NguyenLieu.MaNL,
                       TenNL = a.NguyenLieu.TenNL,
                       DinhLuong = a.CTCongThuc.DinhLuong,
                       DonViTinh = a.CTCongThuc.DonViTinh

                   }).ToList()
               })
               .FirstOrDefaultAsync();

            var listUserComment = await _context.Comments
                .Where(x => x.MaBaiViet == post.MaCT)
                .Select(x => new { x.MaND, x.ThoiGian, x.NoiDung , x.MaComment}) // Use 'new' keyword to create an anonymous object
                .ToListAsync();

            List<CommentResultDto> commentResultDtos = new List<CommentResultDto>();

            foreach (var info in listUserComment)
            {
                var userInfo = await _context.NguoiDungs.Where(x => x.MaND == info.MaND).Select(x => new NguoiDungCommentDto
                {
                    AnhDaiDien = x.AnhDaiDien,
                    TenND = x.TenND
                }).FirstOrDefaultAsync();
                commentResultDtos.Add(new CommentResultDto
                {
                    MaComment = info.MaComment,
                    tacgia = userInfo,
                    NgayBinhLuan = info.ThoiGian,
                    canDeleted = info.MaND == nguoidung.MaND,
                    NoiDung = info.NoiDung
                });
            }

          
            return new PostAndCommentsDto
            {
                post = recipeDtos!,
                
                comments = commentResultDtos


            };
        }

        public async Task<bool> LikeCongThuc(Like_Share_GetOnePostDto dto)
        {
            var account = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });

            if (account == null) return false;

            var post = await _context.CongThucs.FirstOrDefaultAsync(x => x.MaCT == dto.IdCongThuc);

            if (post == null) return false;

            var user = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == account.Id);
            if (user == null) return false;

            var liked = await _context.CTDaThichs.FirstOrDefaultAsync(x => (x.MaCT == post.MaCT) && (x.MaND == user.MaND));
            if (liked != null)
            {
                _context.CTDaThichs.Remove(liked);
                post.LuotThich--;
                await _context.SaveChangesAsync();
                return true; 
            }
            else
            {
                var likedPost = new CTDaThich
                {
                    MaCT = dto.IdCongThuc,
                    MaND = user.MaND
                };

                await _context.CTDaThichs.AddAsync(likedPost);
                post.LuotThich++;
                post.LuotXem++;

                var thongBao = new ThongBao()
                {
                    MaND = post.MaND,
                    MaBaiViet = post.MaCT,
                    NoiDung = $"{user.TenND} vừa thích bài viết của bạn",
                    DaXem = false,
                    NgayTao = DateTime.UtcNow,
                };
                await _context.ThongBaos.AddAsync(thongBao);

                await _context.SaveChangesAsync();
                return true;

            }
        }
        public async Task<bool> CommentCongThuc(CommentPostDto comments)
        {
            var account = await _account.AuthenticationAsync(new TokenModel { AccessToken = comments.like_share.token });

            if (account == null) return false;

            var post = await _context.CongThucs.FirstOrDefaultAsync(x => x.MaCT == comments.like_share.IdCongThuc);

            if (post == null) return false;

            var user = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == account.Id);
            if (user == null) return false;

            var comment = new Comment
            {
                MaND = user.MaND,
                MaBaiViet = post.MaCT,
                NoiDung = comments.Comment,
                ThoiGian = DateTime.UtcNow
            };
            await _context.Comments.AddAsync(comment);
            post.LuotComment = _context.Comments.Where(x => x.MaBaiViet == post.MaCT).Count()  ;
             _context.CongThucs.Update(post);
            await _context.SaveChangesAsync(); 

            var thongBao = new ThongBao
            {
                MaND = post.MaND,
                MaBaiViet = post.MaCT,
                NoiDung = $"{user.TenND} đã bình luận về bài viết của bạn",
                NgayTao = DateTime.UtcNow,
                DaXem = false
            };

            await _context.ThongBaos.AddAsync(thongBao);
            await _context.SaveChangesAsync(); 


            return true;
        }

        public async Task<bool> DeleteComment(DeleteComment_IfTrueDto dto) {
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });
            if (user == null) return false;
            var nguoidung = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == user.Id);
            if (nguoidung == null) return false;

            if (dto.canDelete == false) return false;
            var comment = await _context.Comments.FirstOrDefaultAsync(x => x.MaComment == dto.MaComment);
            if (comment == null) return false;
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;     
        }
        public async Task<bool> ShareCongThuc(Like_Share_GetOnePostDto dto)
        {
            var account = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });

            if (account == null) return false;

            var post = await _context.CongThucs.FirstOrDefaultAsync(x => x.MaCT == dto.IdCongThuc);

            if (post == null) return false;

            var user = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == account.Id);
            if (user == null) return false;

           
            await _context.SaveChangesAsync();
            var sharedRecipe = new CtDaShare
            {
                MaCT = post.MaCT,
                MaND = user.MaND,
                ThoiGian = DateTime.UtcNow
            };
            await _context.CtDaShares.AddAsync(sharedRecipe);
             post.LuotXem++;
            post.LuotShare++;
            

            var thongBao = new ThongBao()
            {
                MaND = post.MaND,
                MaBaiViet = post.MaCT,
                NoiDung = $"{user.TenND} vừa chia sẻ bài viết của bạn",
                DaXem = false,
                NgayTao = DateTime.UtcNow,
            };
            await _context.ThongBaos.AddAsync(thongBao);

            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<CongThuc> updateCongThuc(int id, RecipeDto congthuc)
        {
            var recipe = await _context.CongThucs.FindAsync(id);
            if (recipe == null) return null!;
            _dbMapper.Map(congthuc, recipe);
            _context.Update(recipe); 
            await _context.SaveChangesAsync(); 

            return recipe;
        }

        public async Task<List<PostResultDto>> GetAllUserAndSharedPost(string token)
        {

            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken= token});
            if (user == null) return null!;

            var allUserPost = await _context.CongThucs
                 .Include(ct => ct.CTCongThucs)
                 .Where(a => a.MaND == user.Id)
                 .Join(_context.NguoiDungs,
                     ct => ct.MaND,
                     nd => nd.MaND,
                     (ct, nd) => new { CongThuc = ct, TacGia = nd })


                 .Select(x => new PostResultDto
                 {
                     MaCT = x.CongThuc.MaCT,
                     TenCT = x.CongThuc.TenCT,
                     MoTaCT = x.CongThuc.MoTaCT,
                     TongCalories = x.CongThuc.TongCalories,
                     AnhCT = x.CongThuc.AnhCT,
                     LuotXem = x.CongThuc.LuotXem,
                     LuotLuu = x.CongThuc.LuotLuu,
                     LuotShare = _context.CtDaShares.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                     NgayCapNhat = x.CongThuc.NgayCapNhat,
                     LuotComment = _context.Comments.Where(a => a.MaBaiViet == x.CongThuc.MaCT).Count(),
                     LuotToCao = _context.CtToCaos.Where( a=> a.MaCT == x.CongThuc.MaCT).Count(),
                     LuotThich = x.CongThuc.LuotThich,
                     TacGia = new NguoiDungDto
                     {

                         MaTK = x.TacGia.MaTK,
                         TenND = x.TacGia.TenND,
                         GioiTinh = x.TacGia.GioiTinh,
                         NgaySinh = x.TacGia.NgaySinh,
                         TieuSu = x.TacGia.TieuSu,
                         SDT = x.TacGia.SDT,
                         Email = x.TacGia.Email,
                         DiaChi = x.TacGia.DiaChi,
                         LuotTheoDoi = x.TacGia.LuotTheoDoi,
                         AnhDaiDien = x.TacGia.AnhDaiDien
                     },
                     NguyenLieus = x.CongThuc.CTCongThucs
                     .Join(_context.NguyenLieus,
                         ad => ad.MaNL,
                         af => af.MaNL,
                         (ad, af) => new { CTCongThuc = ad, NguyenLieu = af }
                     )
                     .Select(a => new NguyenLieuOutputDto
                     {

                         MaNL = a.NguyenLieu.MaNL,
                         TenNL = a.NguyenLieu.TenNL,
                         DinhLuong = a.CTCongThuc.DinhLuong,
                         DonViTinh = a.CTCongThuc.DonViTinh

                     }).ToList()
                 })
                 .ToListAsync();

            var sharedPostIds = await _context.CtDaShares
                .Where(c => c.MaND == user.Id)
                .Select(a => a.MaCT)
                .ToListAsync();


            var allSharedPost = await _context.CongThucs
                 .Include(ct => ct.CTCongThucs)
                 .Where(ct => sharedPostIds.Contains(ct.MaCT))
                 .Join(_context.NguoiDungs,
                     ct => ct.MaND,
                     nd => nd.MaND,
                     (ct, nd) => new { CongThuc = ct, TacGia = nd })
                 .Select(x => new PostResultDto
                 {
                     MaCT = x.CongThuc.MaCT,
                     TenCT = x.CongThuc.TenCT,
                     MoTaCT = x.CongThuc.MoTaCT,
                     TongCalories = x.CongThuc.TongCalories,
                     AnhCT = x.CongThuc.AnhCT,
                     LuotXem = x.CongThuc.LuotXem,
                     LuotLuu = x.CongThuc.LuotLuu,


                     NgayCapNhat = x.CongThuc.NgayCapNhat,
                     LuotComment = _context.Comments.Where(a => a.MaBaiViet == x.CongThuc.MaCT).Count(),
                     LuotShare = _context.CtDaShares.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                     LuotToCao = _context.CtToCaos.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                     LuotThich = _context.CTDaThichs.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                     TacGia = new NguoiDungDto
                     {
                         MaTK = x.TacGia.MaTK,
                         TenND = x.TacGia.TenND,
                         GioiTinh = x.TacGia.GioiTinh,
                         NgaySinh = x.TacGia.NgaySinh,
                         TieuSu = x.TacGia.TieuSu,
                         SDT = x.TacGia.SDT,
                         Email = x.TacGia.Email,
                         DiaChi = x.TacGia.DiaChi,
                         LuotTheoDoi = x.TacGia.LuotTheoDoi,
                         AnhDaiDien = x.TacGia.AnhDaiDien
                     },
                     NguyenLieus = x.CongThuc.CTCongThucs
                         .Join(_context.NguyenLieus,
                             ctct => ctct.MaNL,
                             nl => nl.MaNL,
                             (ctct, nl) => new NguyenLieuOutputDto
                             {
                                 MaNL = nl.MaNL,
                                 TenNL = nl.TenNL,
                                 DinhLuong = ctct.DinhLuong,
                                 DonViTinh = ctct.DonViTinh
                             })
                         .ToList()
                 })
                 .ToListAsync();

            var allPosts = allUserPost
                    .Concat(allSharedPost)
                
                    .OrderByDescending(p => p.NgayCapNhat) // sắp xếp theo ngày cập nhật
                    .ToList();


            return allPosts; 
        }

        public async Task<List<PostResultDto>> getOneUserAndSharedPost(OneUserPostDto oneUserPostDto)
        {
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = oneUserPostDto.token });
            if (user == null) return null;

            var allUserPost = await _context.CongThucs
                 .Include(ct => ct.CTCongThucs)
                 .Where(a => a.MaND == oneUserPostDto.IdUser)
                 .Join(_context.NguoiDungs,
                     ct => ct.MaND,
                     nd => nd.MaND,
                     (ct, nd) => new { CongThuc = ct, TacGia = nd })

                 .OrderByDescending(a => a.CongThuc.NgayCapNhat)
                 .Select(x => new PostResultDto
                 {
                     MaCT = x.CongThuc.MaCT,
                     TenCT = x.CongThuc.TenCT,
                     MoTaCT = x.CongThuc.MoTaCT,
                     TongCalories = x.CongThuc.TongCalories,
                     AnhCT = x.CongThuc.AnhCT,
                     LuotXem = x.CongThuc.LuotXem,
                     LuotLuu = x.CongThuc.LuotLuu,
                    
                     NgayCapNhat = x.CongThuc.NgayCapNhat,

                     LuotComment = _context.Comments.Where(a => a.MaBaiViet == x.CongThuc.MaCT).Count(),
                     LuotShare = _context.CtDaShares.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                     LuotToCao = _context.CtToCaos.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                     LuotThich = _context.CTDaThichs.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                     TacGia = new NguoiDungDto
                     {

                         MaTK = x.TacGia.MaTK,
                         TenND = x.TacGia.TenND,
                         GioiTinh = x.TacGia.GioiTinh,
                         NgaySinh = x.TacGia.NgaySinh,
                         TieuSu = x.TacGia.TieuSu,
                         SDT = x.TacGia.SDT,
                         Email = x.TacGia.Email,
                         DiaChi = x.TacGia.DiaChi,
                         LuotTheoDoi = x.TacGia.LuotTheoDoi,
                         AnhDaiDien = x.TacGia.AnhDaiDien
                     },
                     NguyenLieus = x.CongThuc.CTCongThucs
                     .Join(_context.NguyenLieus,
                         ad => ad.MaNL,
                         af => af.MaNL,
                         (ad, af) => new { CTCongThuc = ad, NguyenLieu = af }
                     )
                     .Select(a => new NguyenLieuOutputDto
                     {

                         MaNL = a.NguyenLieu.MaNL,
                         TenNL = a.NguyenLieu.TenNL,
                         DinhLuong = a.CTCongThuc.DinhLuong,
                         DonViTinh = a.CTCongThuc.DonViTinh

                     }).ToList()
                 })
                 .ToListAsync();

            var sharedPostIds = await _context.CtDaShares
                .Where(c => c.MaND == oneUserPostDto.IdUser)
                .Select(a => a.MaCT)
                .ToListAsync();


            var allSharedPost = await _context.CongThucs
                 .Include(ct => ct.CTCongThucs)
                 .Where(ct => sharedPostIds.Contains(ct.MaCT))
                 .Join(_context.NguoiDungs,
                     ct => ct.MaND,
                     nd => nd.MaND,
                     (ct, nd) => new { CongThuc = ct, TacGia = nd })
                 .OrderByDescending( x=> x.CongThuc.NgayCapNhat)
                 .Select(x => new PostResultDto
                 {
                     MaCT = x.CongThuc.MaCT,
                     TenCT = x.CongThuc.TenCT,
                     MoTaCT = x.CongThuc.MoTaCT,
                     TongCalories = x.CongThuc.TongCalories,
                     AnhCT = x.CongThuc.AnhCT,
                     LuotXem = x.CongThuc.LuotXem,
                     LuotLuu = x.CongThuc.LuotLuu,
                     NgayCapNhat = x.CongThuc.NgayCapNhat,
                     LuotComment = _context.Comments.Where(a => a.MaBaiViet == x.CongThuc.MaCT).Count(),
                     LuotShare = _context.CtDaShares.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                     LuotToCao = _context.CtToCaos.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),

                     LuotThich = _context.CTDaThichs.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),

                     TacGia = new NguoiDungDto
                     {
                         MaTK = x.TacGia.MaTK,
                         TenND = x.TacGia.TenND,
                         GioiTinh = x.TacGia.GioiTinh,
                         NgaySinh = x.TacGia.NgaySinh,
                         TieuSu = x.TacGia.TieuSu,
                         SDT = x.TacGia.SDT,
                         Email = x.TacGia.Email,
                         DiaChi = x.TacGia.DiaChi,
                         LuotTheoDoi = x.TacGia.LuotTheoDoi,
                         AnhDaiDien = x.TacGia.AnhDaiDien
                     },
                     NguyenLieus = x.CongThuc.CTCongThucs
                         .Join(_context.NguyenLieus,
                             ctct => ctct.MaNL,
                             nl => nl.MaNL,
                             (ctct, nl) => new NguyenLieuOutputDto
                             {
                                 MaNL = nl.MaNL,
                                 TenNL = nl.TenNL,
                                 DinhLuong = ctct.DinhLuong,
                                 DonViTinh = ctct.DonViTinh
                             })
                         .ToList()
                 })
                 .ToListAsync();
            var allPosts = allUserPost
                    .Concat(allSharedPost)
                    .OrderByDescending(p => p.NgayCapNhat) // sắp xếp theo ngày cập nhật
                    .ToList();


            return allPosts;

        }
        public async Task<List<PostResultDto>> FindPost(FindPostInputDto dto)
        {
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });
            if (user == null) return null!;

            var nguoidung = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == user.Id);
            if (nguoidung == null) return null!; 
           
            var caloMin = dto.caloMin;
            var caloMax = dto.caloMax;
            var requiredMaNLs = dto.danhsachNguyenlieu;

            var filteredMaCTs = await _context.CTCongThucs
               .Where(ct => requiredMaNLs.Contains(ct.MaNL))
               .GroupBy(ct => ct.MaCT)
               .Where(g => requiredMaNLs.All(id => g.Select(x => x.MaNL).Contains(id)))
               .Select(g => g.Key)
               .ToListAsync();

            // Truy vấn các công thức có đủ nguyên liệu và lọc theo calories
            var listPosts = await _context.CongThucs
                .Where(ct => filteredMaCTs.Contains(ct.MaCT) &&
                             ct.TongCalories >= caloMin &&
                             ct.TongCalories <= caloMax)
                 .Include(ct => ct.CTCongThucs)
                .Join(_context.NguoiDungs,
                    ct => ct.MaND,
                    nd => nd.MaND,
                    (ct, nd) => new { CongThuc = ct, TacGia = nd })

                .OrderByDescending(x => x.CongThuc.NgayCapNhat)
            
                .Select(x => new PostResultDto
                {
                    MaCT = x.CongThuc.MaCT,
                    TenCT = x.CongThuc.TenCT,
                    MoTaCT = x.CongThuc.MoTaCT,
                    TongCalories = x.CongThuc.TongCalories,
                    AnhCT = x.CongThuc.AnhCT,
                    LuotXem = x.CongThuc.LuotXem,
                    LuotLuu = x.CongThuc.LuotLuu,
                    LuotComment = _context.Comments.Where(a => a.MaBaiViet == x.CongThuc.MaCT).Count(),
                    LuotShare = _context.CtDaShares.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                    LuotToCao = _context.CtToCaos.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),

                    LuotThich = _context.CTDaThichs.Where(a => a.MaCT == x.CongThuc.MaCT).Count(),
                    isLiked = _context.CTDaThichs.Any(c => c.MaCT == x.CongThuc.MaCT && c.MaND == nguoidung.MaND),
                    isReported = _context.CtToCaos.Any(c => c.MaCT == x.CongThuc.MaCT && c.MaND == nguoidung.MaND),

                    TacGia = new NguoiDungDto
                    {

                        MaTK = x.TacGia.MaTK,
                        TenND = x.TacGia.TenND,
                        GioiTinh = x.TacGia.GioiTinh,
                        NgaySinh = x.TacGia.NgaySinh,
                        TieuSu = x.TacGia.TieuSu,
                        SDT = x.TacGia.SDT,
                        Email = x.TacGia.Email,
                        DiaChi = x.TacGia.DiaChi,
                        LuotTheoDoi = x.TacGia.LuotTheoDoi,
                        AnhDaiDien = x.TacGia.AnhDaiDien,
                        isFollowed = _context.TheoDois.Any(a => a.Following_ID == nguoidung.MaND && a.Followed_ID == x.TacGia.MaND)
                    },
                    NguyenLieus = x.CongThuc.CTCongThucs
                    .Join(_context.NguyenLieus,
                        ad => ad.MaNL,
                        af => af.MaNL,
                        (ad, af) => new { CTCongThuc = ad, NguyenLieu = af }
                    )
                    .Select(a => new NguyenLieuOutputDto
                    {

                        MaNL = a.NguyenLieu.MaNL,
                        TenNL = a.NguyenLieu.TenNL,
                        DinhLuong = a.CTCongThuc.DinhLuong,
                        DonViTinh = a.CTCongThuc.DonViTinh

                    }).ToList()
                })
                .ToListAsync();

            return listPosts;

        }

        public async Task<List<CommentResultDto>> GetComment(Like_Share_GetOnePostDto dto)
        {
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });
            if (user == null) return null!;

            var nguoidung = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == user.Id);
            if (nguoidung == null) return null!;

            var post = await _context.CongThucs.FirstOrDefaultAsync(x => x.MaCT == dto.IdCongThuc);
            if (post == null) return null!;

            var listPost = await _context.Comments
                .Where(x => x.MaBaiViet == post.MaCT)
                            
                            .Join(_context.NguoiDungs,
                             ct => ct.MaND,
                             af => af.MaND,
                             (ct, af) => new { Comment = ct, NguoiDung = af }
                            )
                            .Select( a => 
                            new CommentResultDto
                            {
                                MaComment = a.Comment.MaComment,
                                tacgia = new NguoiDungCommentDto
                                {
                                    AnhDaiDien = a.NguoiDung.AnhDaiDien,
                                    TenND = a.NguoiDung.TenND
                                },
                                NgayBinhLuan =  a.Comment.ThoiGian,
                                canDeleted = a.Comment.MaND == nguoidung.MaND,
                                NoiDung = a.Comment.NoiDung
                                
                            })
                            .ToListAsync();
            return listPost;
        }

        public async Task<bool> ReportCongThuc(Like_Share_GetOnePostDto dto)
        {
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });

            var post = await _context.CongThucs.FirstOrDefaultAsync(x => x.MaCT == dto.IdCongThuc);
            

            var nguoidung = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == user.Id);
            if (user == null || nguoidung == null || post == null) return false;

            var reported = await _context.CtToCaos.FirstOrDefaultAsync(x => (x.MaCT == post.MaCT) && (x.MaND == nguoidung.MaND));
            if (reported != null)
            {
                _context.CtToCaos.Remove(reported);
                post.LuotToCao--;
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                var ctToCao = new CtToCaos
                {
                    MaND = nguoidung.MaND,
                    MaCT = dto.IdCongThuc,

                };
                await _context.CtToCaos.AddAsync(ctToCao);
                post.LuotToCao++;
                _context.CongThucs.Update(post);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> DeleteCommentForAdmin(DeleteCommentDto dto)
        {
            var user = await _account.AuthenticationAsync(new TokenModel { AccessToken = dto.token });

            var role = await _account.CheckUserRole(new TokenModel { AccessToken = dto.token });
            if (user == null || role != 0) return false;
            var commentDelete = await _context.Comments.FirstOrDefaultAsync(x => x.MaComment == dto.MaComment);
            if (commentDelete == null) return false;
            _context.Comments.Remove(commentDelete);
            await _context.SaveChangesAsync();
            return true; 
        }
    }
}
