using Foodify_DoAn.Data;
using Foodify_DoAn.Repository;
using Microsoft.AspNetCore.Identity;
using System.Net.Mail;
using System.Net;
using Foodify_DoAn.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.WebUtilities;


namespace Foodify_DoAn.Service
{
    public class EmailService : IEmailRepository
    {
        private readonly UserManager<TaiKhoan> userManager;
        private readonly SignInManager<TaiKhoan> signInManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<VaiTro> roleManager;

        public EmailService(UserManager<TaiKhoan> userManager, SignInManager<TaiKhoan> signInManager, RoleManager<VaiTro> roleManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this._configuration = configuration;
            this.roleManager = roleManager;
        }
        public async Task<bool> SendEmailMessage(string toEmail, string confirmationCode)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"];
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]!);
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];
                var enableSSL = bool.Parse(_configuration["EmailSettings:EnableSSL"]!);
                using (var client = new SmtpClient(smtpServer, smtpPort))
                {
                    client.Credentials = new NetworkCredential(senderEmail, senderPassword);
                    client.EnableSsl = enableSSL;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(senderEmail),
                        Subject = "Account Confirmation",
                        Body = $"Your confirmation code is: {confirmationCode}",
                        IsBodyHtml = false
                    };
                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }
    }
}
