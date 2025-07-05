using Castle.Components.DictionaryAdapter.Xml;
using CloudinaryDotNet;
using FluentEmail.Core;
using Foodify_DoAn.Data;
using Foodify_DoAn.Model;
using Foodify_DoAn.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using Npgsql.EntityFrameworkCore.PostgreSQL.Update.Internal;
using System.Diagnostics.Contracts;
using System.Diagnostics.Eventing.Reader;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using static System.Net.WebRequestMethods;

namespace Foodify_DoAn.Service
{
    public class AccountManager : IAccountRepository
    {
        private readonly UserManager<TaiKhoan> userManager;
        private readonly SignInManager<TaiKhoan> signInManager;
        private readonly IConfiguration configuration;
        private readonly RoleManager<VaiTro> roleManager;
        private readonly IFluentEmail fluentEmail;
        private readonly IMemoryCache TempOtp;
        private readonly FoodifyContext foodifyContext;
        private readonly Cloudinary cloudinary;
        private readonly FoodifyContext _context;
        public AccountManager(UserManager<TaiKhoan> userManager, SignInManager<TaiKhoan> signInManager,
            RoleManager<VaiTro> roleManager, IConfiguration configuration, IFluentEmail fluentEmail,
            IMemoryCache TempOtp, FoodifyContext foodifyContext, Cloudinary cloudinary
            , FoodifyContext context
            )
        {
            this.foodifyContext = foodifyContext;
            this.TempOtp = TempOtp;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.roleManager = roleManager;
            this.fluentEmail = fluentEmail;
            this.cloudinary = cloudinary;
            this._context = context;
        }

        public async Task<int> CheckUserRole(TokenModel token)
        {
            var user = await AuthenticationAsync(token);
            if (user == null) return -1;

            var user_Role = await _context.UserRoles.Where(x => x.UserId == user.Id).Select(x => x.RoleId).ToListAsync();

            if (user_Role.Contains(0)) return 0;
            if (user_Role.Contains(1) && !user_Role.Contains(0)) return 1;
            return -1; 
        }
        public async Task<TaiKhoan?> AuthenticationAsync(TokenModel token)
        {
            if (string.IsNullOrEmpty(token.AccessToken)) return null;

            var tokenHanler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]!);

            try
            {
                tokenHanler.ValidateToken(token.AccessToken, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = configuration["JWT:ValidIssuer"],
                    ValidAudience = configuration["JWT:ValidAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);
                var jwtToken = (JwtSecurityToken)validatedToken;
                var email = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(email)) return null;
                var user = await userManager.FindByEmailAsync(email);
                return user;
            }
            catch
            {
                return null;
            }

        }
        public async Task<string> SignInAsync(SignInModel signInModel)
        {
            var user = await userManager.FindByEmailAsync(signInModel.Email);

            var passwordValid = await userManager.CheckPasswordAsync(user, signInModel.Password);
            if (user == null || !passwordValid) return "Login Failed";

            var author = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == user.Id);
            if (author.IsValid == false) return "Invalid Account";


            var authClaims = new List<Claim>
                { new Claim(ClaimTypes.Email, signInModel.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, signInModel.Email)

            };
            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role.ToString()));
            }

            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:SecretKey"]));


            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3600),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha256Signature)
                );


            return new JwtSecurityTokenHandler().WriteToken(token);

        }
        public async Task<bool> SendEmailConfirmationAsync(SignUpModel signUpModel)
        {
            var userExist = await userManager.Users
                .AsNoTracking()
                .AnyAsync(x=>x.UserName == signUpModel.Email);
            if (userExist) return false;

            try
            {
                await _context.OtpEntries
                    .Where(x => x.Email == signUpModel.Email)
                    .ExecuteDeleteAsync(); 

                var otp = new Random().Next(100000, 999999).ToString();

                var otpEntry = new OtpEntry
                {
                    Email = signUpModel.Email,
                    Otp = otp,
                    Password = signUpModel.Password,
                    Expiration = DateTime.UtcNow.AddMinutes(3)
                };  
                await _context.OtpEntries.AddAsync(otpEntry);
                await _context.SaveChangesAsync();

                var emailTask = fluentEmail.To(signUpModel.Email)
                    .SetFrom("noreply@foodify.com")
                    .Subject("Mã OTP xác thực email")
                        .Body($"<p>Mã OTP của bạn là: <strong>{otp}</strong> (hiệu lực trong 5 phút).</p>", true)
                    .SendAsync();

                var saveTask = _context.SaveChangesAsync();
                await Task.WhenAll(emailTask, saveTask); 

                return true;
            }
            catch
            {
                return false;
            }
        }
        public async Task<bool> SignUpWithOtpAsync(ConfirmOtp confirmOtp)
        {
            var otp = await _context.OtpEntries.AsNoTracking().FirstOrDefaultAsync(x => x.Email == confirmOtp.email && x.Expiration >= DateTime.UtcNow);

            if (otp== null) return false;

            if (otp.Otp != confirmOtp.otp) return false;

            using var transaction = await _context.Database.BeginTransactionAsync();

            try { 
            var user = new TaiKhoan
            {
                Email = confirmOtp.email,
                UserName = confirmOtp.email,
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(user, otp.Password);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return false;
                }
                if (!await roleManager.RoleExistsAsync(RoleModel.User))
            {
                var role = new VaiTro { Name = RoleModel.User };
                await roleManager.CreateAsync(role);
            }

            await userManager.AddToRoleAsync(user, RoleModel.User);

            var nguoiDung = new NguoiDung
            {
                TenND = "user" + new Random().Next(1, maxValue: 99999),
                MaTK = user.Id,
                Email = user.Email,
                GioiTinh = true,
                NgaySinh = DateTime.UtcNow,
                TieuSu = "no",
                SDT = "no",
                DiaChi = "no",
                AnhDaiDien = "image",
                TaiKhoan = user
            };

            await foodifyContext.NguoiDungs.AddAsync(nguoiDung);
                await _context.OtpEntries
               .Where(x => x.Email == confirmOtp.email)
               .ExecuteDeleteAsync();
                user.NguoiDung = nguoiDung;
            await foodifyContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return true;

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // _logger.LogError(ex, "Failed to sign up user with OTP for {Email}", confirmOtp.email);
                return false;
            }
        }


        public async Task<NguoiDung?> UpdateInformationUser( UpdateUserInfoModel model)
        {
            if (string.IsNullOrEmpty(model.token)) return null;

            var taikhoan = await AuthenticationAsync(new TokenModel { AccessToken = model.token });
            if (taikhoan == null) return null;

            var nguoiDung = await foodifyContext.NguoiDungs
                .FirstOrDefaultAsync(x => x.MaTK == taikhoan.Id);

            if (nguoiDung == null) return null;

            // Cập nhật dữ liệu
            nguoiDung.TenND = model.TenND;
            nguoiDung.NgaySinh = model.NgaySinh;
            nguoiDung.GioiTinh = model.GioiTinh;
            nguoiDung.SDT = model.SDT;
            nguoiDung.DiaChi = model.DiaChi;
            nguoiDung.TieuSu = model.TieuSu;
            nguoiDung.AnhDaiDien = model.Avatar; 
            await foodifyContext.SaveChangesAsync();

            return nguoiDung;
        }
        public async Task<bool> ForgotPassword(ForgotPasswordRequest forgotPasswordRequest)
        {
            var user = await userManager.FindByEmailAsync(forgotPasswordRequest.Email);
            if (userManager == null) return false;

            var otp = new Random().Next(100000, 999999).ToString();
            TempOtp.Set($"ResetCode{forgotPasswordRequest.Email}", otp, TimeSpan.FromMinutes(1));
            await fluentEmail.To(forgotPasswordRequest.Email).Subject("Mã xác nhận đặt lại mật khẩu")
                .Body($"Mã OTP của bạn là: <strong>{otp}</strong>. Mã này sẽ hết hạn sau 1 phút.", true)
                .SendAsync();
            return true; 
        }

        public async Task<bool> ResetPassword(ResetPasswordRequest resetPasswordRequest)
        {
            if (!TempOtp.TryGetValue($"ResetCode{resetPasswordRequest.Email}", out string? cachedCode))
                return false;
            if (cachedCode != resetPasswordRequest.ResetCode)
                return false;
            var user = await userManager.FindByEmailAsync(resetPasswordRequest.Email);
            if (user == null)
                return false; 

            TempOtp.Remove($"ResetCode:{resetPasswordRequest.Email}");
            var resetPasswordToken = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await userManager.ResetPasswordAsync(user, resetPasswordToken, resetPasswordRequest.NewPassword);
            if (result.Succeeded) return true;
            return false; 

        }

        public async Task<UserReturn> GetUserInfoAsync(string token)
        {
            if (string.IsNullOrEmpty(token)) return null!;

            var user = await AuthenticationAsync(new TokenModel { AccessToken = token });
            if (user == null) return null;
            var nguoiDung = await foodifyContext.NguoiDungs.FirstOrDefaultAsync(x => x.MaTK == user.Id);
            if (nguoiDung == null) return null;
            var nguoiDungDto = new UserReturn
            {
                TenND = nguoiDung.TenND,
                Email = nguoiDung.Email,
                SDT = nguoiDung.SDT,
                DiaChi = nguoiDung.DiaChi,
                NgaySinh = nguoiDung.NgaySinh,
                GioiTinh = nguoiDung.GioiTinh,
                TieuSu = nguoiDung.TieuSu,
                AnhDaiDien = nguoiDung.AnhDaiDien,
                LuotTheoDoi = nguoiDung.LuotTheoDoi

            };
            return nguoiDungDto;
        }
    }
}
