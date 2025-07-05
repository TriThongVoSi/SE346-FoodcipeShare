using AutoMapper;
using Foodify_DoAn.Model;
using System.Runtime;

namespace Foodify_DoAn.Data
{
    public class DbMapper : Profile
    {
        public DbMapper()
        {
            CreateMap<CongThuc, RecipeDto>();
            CreateMap<RecipeDto, CongThuc>();
        }
    }
}
