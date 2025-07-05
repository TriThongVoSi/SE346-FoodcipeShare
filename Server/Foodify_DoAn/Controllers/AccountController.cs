using Foodify_DoAn.Data;
using Foodify_DoAn.Model;
using Foodify_DoAn.Repository;
using Foodify_DoAn.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using StackExchange.Redis;
using System.Security.Claims;

namespace Foodify_DoAn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository accountRepository;
        private readonly IEmailRepository emailSender;
        private readonly FoodifyContext _context;
        private readonly IUploadImageRepository uploadImageRepository;


        public AccountController(IAccountRepository accountRepository, IEmailRepository emailSender, FoodifyContext context , IUploadImageRepository uploadImageRepository)
        {
            this.accountRepository = accountRepository;
            this.emailSender = emailSender;
            this.uploadImageRepository = uploadImageRepository; 
            _context = context;
        }
     

        [HttpPost("signup/otp")]
        
        public async Task<IActionResult> SignUpWithOtpConfirmed(ConfirmOtp confirmOtp)
        {
            var result = await accountRepository.SignUpWithOtpAsync(confirmOtp);
           
            if (!result)
            {
                return NotFound("Không thể tạo tài khoàn");
            }
            return Ok("Tạo tài khoản thành công");
        }


        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(SignUpModel signUpModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await accountRepository.SendEmailConfirmationAsync(signUpModel);
            if (!result)
            {
                return NotFound("Không thể gửi mã Otp");
            }

            return Ok("Mã otp được gửi thành công");
        }
        [HttpPost("login")]
        public async Task<IActionResult> SignIn(SignInModel signInModel)
        {
            var result = await accountRepository.SignInAsync(signInModel);

            if (result == "Login Failed")
            {
                return Unauthorized("Vui lòng nhập đúng tài khoản và mật khẩu");
            }
            else if (result == "Invalid Account") return NotFound("Tài khoản đã bị vô hiệu hóa"); 
            return Ok(result); 
        }

        [HttpPost("login/auth")]
        public async Task<IActionResult> Authenticate(TokenModel token)
        {
            var user = await accountRepository.AuthenticationAsync(token);
            return (user == null) ? NotFound("Token không hợp lệ hoặc người dùng không tồn tại") : Ok(new
            {
                user.Email,
                user.UserName
            });
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateInformationUser([FromBody] UpdateUserInfoModel model)
        {
           
            var result = await accountRepository.UpdateInformationUser( model);
            if (result == null) return BadRequest("Không tìm thấy người dùng.");
            return Ok();
        }
       

        [HttpPost("forgotPass")]
        public async Task<IActionResult> ForgotUserPassword(ForgotPasswordRequest forgotPassword)
        {
            var sendEmail = await accountRepository.ForgotPassword(forgotPassword);
            if (sendEmail == false) return NotFound("Không tìm thấy thông tin người dùng");
            return Ok("Mail xác nhận được gửi thành công");
        }
        [HttpPost("forgotPass/otp")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest resetPasswordRequest)
        {
            var resetPassword = await accountRepository.ResetPassword(resetPasswordRequest);
            if (resetPassword == false) return NotFound("Không thể thay đổi password");
            return Ok("Thay đổi thành công");
        }

        [HttpPost("getuserinfo")] 
        public async Task<IActionResult> getUserInformation([FromBody]string token)
        {
            var result = await accountRepository.GetUserInfoAsync(token);
            if (result == null) return NotFound("Không tìm thấy thông tin người dùng");
            return Ok(result);
        }
    } 
}
