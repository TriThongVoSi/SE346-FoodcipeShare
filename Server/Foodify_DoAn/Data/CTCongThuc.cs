namespace Foodify_DoAn.Data
{
    public class CTCongThuc
    {
        public int MaCT { get; set; }
        public int MaNL { get; set; }
        public decimal DinhLuong { get; set; }
        public string DonViTinh { get; set; }

        public CongThuc CongThuc { get; set; }
        public NguyenLieu NguyenLieu { get; set; }
    }
}
