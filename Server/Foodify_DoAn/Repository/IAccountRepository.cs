using Foodify_DoAn.Data;
using Foodify_DoAn.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Eventing.Reader;
using System.Security.Policy;

namespace Foodify_DoAn.Repository
{
    public interface IAccountRepository
    {
        public Task<bool> SignUpWithOtpAsync(ConfirmOtp confirmOtp);
        public Task<string> SignInAsync(SignInModel signInModel);
        public Task<TaiKhoan?> AuthenticationAsync(TokenModel model);
        public Task<bool> SendEmailConfirmationAsync(SignUpModel signUpModel);
        public Task<NguoiDung?> UpdateInformationUser( UpdateUserInfoModel model);

        public Task<bool> ForgotPassword(ForgotPasswordRequest forgotPasswordRequest);

        public Task<int> CheckUserRole(TokenModel token);
        public Task<bool> ResetPassword(ResetPasswordRequest resetPasswordRequest);

        public Task<UserReturn> GetUserInfoAsync(string token);
    }
}
