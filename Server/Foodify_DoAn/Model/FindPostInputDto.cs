namespace Foodify_DoAn.Model
{
    public class FindPostInputDto
    {
        public string token { get; set; } = null!;
        public List<int> danhsachNguyenlieu { get; set; }

        public decimal caloMin { get; set; } 

        public decimal caloMax { get; set; }


    }
}
