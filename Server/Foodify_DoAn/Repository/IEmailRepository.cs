using Foodify_DoAn.Model;

namespace Foodify_DoAn.Repository
{
    public interface IEmailRepository
    {
        public Task<bool> SendEmailMessage(string email, string ClientUrl);
    }
}
