namespace Foodify_DoAn.Data
{
    public class TheoDoi
    {
        public int Following_ID { get; set; }
        public int Followed_ID { get; set; }

        public NguoiDung Follower { get; set; }
        public NguoiDung Followed { get; set; }
    }
}
