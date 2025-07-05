using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Formats.Asn1;

namespace Foodify_DoAn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly Cloudinary cloudinary;

        public ImageController(Cloudinary cloudinary)
        {
            this.cloudinary = cloudinary; 
        }
        [HttpPost("Upload")]
        public async Task<IActionResult> UploadImage( IFormFile image )
        {
            if (image == null || image.Length == 0) return BadRequest("Ảnh không hợp lệ");

            await using var stream = image.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.FileName, stream),
                Folder = "Uploads"
            };
            var uploadResult = await cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK) 
                return StatusCode((int)uploadResult.StatusCode, uploadResult.Error?.Message ?? "Lỗi không xác định");
            return Ok(new
            {
                public_id = uploadResult.PublicId,
                url = uploadResult.SecureUrl.ToString()
            });
        }
    }
}
