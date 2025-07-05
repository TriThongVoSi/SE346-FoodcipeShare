using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var parameters = context.ApiDescription.ParameterDescriptions
            .Where(p => p.Type == typeof(IFormFile) || p.Type == typeof(IFormFileCollection))
            .ToList();

        if (parameters.Any())
        {
            operation.RequestBody = new OpenApiRequestBody
            {
                Content = {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = parameters.ToDictionary(
                                p => p.Name,
                                p => new OpenApiSchema
                                {
                                    Type = "string",
                                    Format = "binary"
                                })
                        }
                    }
                }
            };

            // Xóa các tham số cũ để tránh xung đột
            operation.Parameters?.Clear();
        }
    }
}