using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Foodify_DoAn.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace Foodify_DoAn.Service
{
    public class UploadImageService : IUploadImageRepository
    {

        private readonly Cloudinary _cloudinary;
        private FoodifyContext _context; 
        public UploadImageService(Cloudinary cloudinary, FoodifyContext context)   
        {
            this._cloudinary = cloudinary;
            this._context = context;
        }

        public async Task<string> UploadAvatarAsync(IFormFile image, string userEmail)
        {
            if (image == null || image.Length == 0) throw new Exception("Ảnh không hơp lệ");
            await using var stream = image.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.FileName, stream),
                Folder = "Uploads"
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK) throw new Exception(uploadResult.Error?.Message ?? "Lỗi upload ảnh");
            var avatarUrl = uploadResult.SecureUrl.ToString();
            var user = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.Email == userEmail);

            if (user == null) throw new Exception("Người dùng không tồn tại");

            user.AnhDaiDien = avatarUrl;
            await _context.SaveChangesAsync();
            return avatarUrl;
        }
    }
}
