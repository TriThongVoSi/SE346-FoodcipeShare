namespace Foodify_DoAn.Repository
{
    public interface IUploadImageRepository
    {
        Task<string> UploadAvatarAsync(IFormFile image, string userEmail);
    }
}
