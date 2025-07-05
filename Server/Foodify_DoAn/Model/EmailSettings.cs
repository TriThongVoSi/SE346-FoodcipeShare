namespace Foodify_DoAn.Model
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SenderEmail { get; set; }
        public string SenderPassword { get; set; }
        public bool EnableSSL { get; set; }
    }

}
