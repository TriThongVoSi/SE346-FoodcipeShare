using Foodify_DoAn.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.EntityFrameworkCore;

public class FoodifyContext : IdentityDbContext<
    TaiKhoan,
    VaiTro,
    int,
    TaiKhoanClaim,
    TaiKhoanVaiTro,
    TaiKhoanLogin,
    VaiTroClaim,
    TaiKhoanToken>
{
    public FoodifyContext(DbContextOptions<FoodifyContext> options) : base(options) { }

    public DbSet<NguoiDung> NguoiDungs { get; set; }
    public DbSet<CongThuc> CongThucs { get; set; }
    public DbSet<NguyenLieu> NguyenLieus { get; set; }
    public DbSet<CTCongThuc> CTCongThucs { get; set; }
    public DbSet<DanhGia> DanhGias { get; set; }
    public DbSet<CTDaLuu> CTDaLuus { get; set; }
    public DbSet<CTDaThich> CTDaThichs { get; set; }
    public DbSet<TheoDoi> TheoDois { get; set; }
    public DbSet<ThongBao> ThongBaos { get; set; }

    public DbSet<CtDaShare> CtDaShares { get; set; }
    public DbSet<Comment> Comments { get; set; }
  
     public DbSet<CtToCaos> CtToCaos { get; set; }

    public DbSet<OtpEntry> OtpEntries { get; set; } 


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<TaiKhoan>().ToTable("TaiKhoan");
        builder.Entity<VaiTro>().ToTable("VaiTro");
        builder.Entity<TaiKhoanClaim>().ToTable("TaiKhoan_Claim");
        builder.Entity<TaiKhoanLogin>().ToTable("TaiKhoan_Login");
        builder.Entity<TaiKhoanToken>().ToTable("TaiKhoan_Token");
        builder.Entity<VaiTroClaim>().ToTable("VaiTro_Claim");
        builder.Entity<TaiKhoanVaiTro>().ToTable("TaiKhoan_VaiTro");

        builder.Entity<NguoiDung>().ToTable("NguoiDung");
        builder.Entity<CongThuc>().ToTable("CongThuc");
        builder.Entity<NguyenLieu>().ToTable("NguyenLieu");
        builder.Entity<CTCongThuc>().ToTable("CTCongThuc");
        builder.Entity<DanhGia>().ToTable("DanhGia");
        builder.Entity<CTDaLuu>().ToTable("CTDaLuu");
        builder.Entity<CTDaThich>().ToTable("CTDaThich");
        builder.Entity<TheoDoi>().ToTable("TheoDoi");
        builder.Entity<ThongBao>().ToTable("ThongBao");
        builder.Entity<CtToCaos>().ToTable("CtToCaos");
        builder.Entity<Comment>().ToTable("Comment");
        builder.Entity<CtDaShare>().ToTable("CtDaShare");
        builder.Entity<CtDaShare>().HasKey(x => x.MaShare);
        builder.Entity<OtpEntry>().ToTable("OtpEntry");
        builder.Entity<OtpEntry>().HasKey(x => x.Id);

        builder.Entity<CtToCaos>().HasKey(x => new { x.MaCT, x.MaND });

        builder.Entity<CtToCaos>()
            .HasOne(a => a.NguoiDung)
            .WithMany(ad => ad.CtToCaos)
            .HasForeignKey(d => d.MaND)
            .OnDelete(DeleteBehavior.Cascade);


        builder.Entity<CtToCaos>()
            .HasOne(a => a.CongThuc)
            .WithMany(ad => ad.CtToCaos)
            .HasForeignKey(d => d.MaCT)
            .OnDelete(DeleteBehavior.Cascade); 

        builder.Entity<CtDaShare>()
          .HasOne(dl => dl.NguoiDung)
          .WithMany(nd => nd.CtDaShare)
          .HasForeignKey(dl => dl.MaND)
        .OnDelete(DeleteBehavior.Cascade);
        ;

        builder.Entity<CtDaShare>()
            .HasOne(dl => dl.CongThuc)
            .WithMany(ct => ct.CtDaShares)
            .HasForeignKey(dl => dl.MaCT)
            .OnDelete(DeleteBehavior.Cascade);

        ;


        builder.Entity<Comment>().HasKey(x => x.MaComment);


        builder.Entity<ThongBao>()
            .HasOne(x => x.NguoiDung)
            .WithMany(c => c.ThongBaos)
            .HasForeignKey(z => z.MaND)
            .OnDelete(DeleteBehavior.Cascade);
            ;
        builder.Entity<Comment>()
            .HasOne(x => x.NguoiDung)
            .WithMany(c => c.Comments)
            .HasForeignKey(c => c.MaND)
            .OnDelete(DeleteBehavior.Cascade)
            ;

        builder.Entity<Comment>()
            .HasOne(x => x.CongThuc)
            .WithMany(c => c.Comments)
            .HasForeignKey(x => x.MaBaiViet)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<NguoiDung>()
            .HasOne(nd => nd.TaiKhoan)
            .WithOne(tk => tk.NguoiDung)
            .HasForeignKey<NguoiDung>(nd => nd.MaTK)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CTCongThuc>()
            .HasKey(ct => new { ct.MaCT, ct.MaNL });

        builder.Entity<CTCongThuc>()
            .HasOne(ct => ct.CongThuc)
            .WithMany(c => c.CTCongThucs)
            .HasForeignKey(ct => ct.MaCT)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CTCongThuc>()
            .HasOne(ct => ct.NguyenLieu)
            .WithMany(nl => nl.CTCongThucs)
            .HasForeignKey(ct => ct.MaNL)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CTDaLuu>()
            .HasKey(dl => new { dl.MaND, dl.MaCT });

        builder.Entity<CTDaLuu>()
            .HasOne(dl => dl.NguoiDung)
            .WithMany(nd => nd.CTDaLuus)
            .HasForeignKey(dl => dl.MaND)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CTDaLuu>()
            .HasOne(dl => dl.CongThuc)
            .WithMany(ct => ct.CTDaLuus)
            .HasForeignKey(dl => dl.MaCT)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CTDaThich>()
            .HasKey(dt => new { dt.MaND, dt.MaCT });

        builder.Entity<CTDaThich>()
            .HasOne(dt => dt.NguoiDung)
            .WithMany(nd => nd.CTDaThichs)
            .HasForeignKey(dt => dt.MaND)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CTDaThich>()
            .HasOne(dt => dt.CongThuc)
            .WithMany(ct => ct.CTDaThichs)
            .HasForeignKey(dt => dt.MaCT);

        builder.Entity<TheoDoi>()
            .HasKey(td => new { td.Following_ID, td.Followed_ID });

        builder.Entity<TheoDoi>()
            .HasOne(td => td.Follower)
            .WithMany(nd => nd.Followers)
            .HasForeignKey(td => td.Following_ID)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<TheoDoi>()
            .HasOne(td => td.Followed)
            .WithMany(nd => nd.Followeds)
            .HasForeignKey(td => td.Followed_ID)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<TaiKhoanVaiTro>()
       .HasKey(tkvt => new { tkvt.UserId, tkvt.RoleId });

        builder.Entity<TaiKhoanVaiTro>()
            .HasOne(tkvt => tkvt.TaiKhoan)
            .WithMany(tk => tk.TaiKhoanVaiTros)
            .HasForeignKey(tkvt => tkvt.UserId);

        builder.Entity<TaiKhoanVaiTro>()
            .HasOne(tkvt => tkvt.VaiTro)
            .WithMany(vt => vt.TaiKhoanVaiTros)
            .HasForeignKey(tkvt => tkvt.RoleId);
            
            builder.Entity<CongThuc>()
        .HasOne(ct => ct.NguoiDung)
        .WithMany(nd => nd.CongThucs)
        .HasForeignKey(ct => ct.MaND)   
        .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ThongBao>()
    .HasOne(tb => tb.NguoiDung)
    .WithMany(nd => nd.ThongBaos)
    .HasForeignKey(tb => tb.MaND)
    .OnDelete(DeleteBehavior.Cascade); // hoặc Restrict tùy yêu cầu

    }

}
