using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Foodify_DoAn.Migrations
{
    /// <inheritdoc />
    public partial class dbContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NguyenLieu",
                columns: table => new
                {
                    MaNL = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenNL = table.Column<string>(type: "text", nullable: false),
                    Calories = table.Column<decimal>(type: "numeric", nullable: true),
                    AnhNL = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguyenLieu", x => x.MaNL);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VaiTro",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaiTro", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    MaND = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaTK = table.Column<int>(type: "integer", nullable: false),
                    TenND = table.Column<string>(type: "text", nullable: false),
                    GioiTinh = table.Column<bool>(type: "boolean", nullable: true),
                    NgaySinh = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TieuSu = table.Column<string>(type: "text", nullable: false),
                    SDT = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    DiaChi = table.Column<string>(type: "text", nullable: false),
                    LuotTheoDoi = table.Column<int>(type: "integer", nullable: false),
                    AnhDaiDien = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDung", x => x.MaND);
                    table.ForeignKey(
                        name: "FK_NguoiDung_TaiKhoan_MaTK",
                        column: x => x.MaTK,
                        principalTable: "TaiKhoan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan_Claim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan_Claim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaiKhoan_Claim_TaiKhoan_UserId",
                        column: x => x.UserId,
                        principalTable: "TaiKhoan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan_Login",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan_Login", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_TaiKhoan_Login_TaiKhoan_UserId",
                        column: x => x.UserId,
                        principalTable: "TaiKhoan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan_Token",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan_Token", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_TaiKhoan_Token_TaiKhoan_UserId",
                        column: x => x.UserId,
                        principalTable: "TaiKhoan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan_VaiTro",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan_VaiTro", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_TaiKhoan_VaiTro_TaiKhoan_UserId",
                        column: x => x.UserId,
                        principalTable: "TaiKhoan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaiKhoan_VaiTro_VaiTro_RoleId",
                        column: x => x.RoleId,
                        principalTable: "VaiTro",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VaiTro_Claim",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaiTro_Claim", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaiTro_Claim_VaiTro_RoleId",
                        column: x => x.RoleId,
                        principalTable: "VaiTro",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CongThuc",
                columns: table => new
                {
                    MaCT = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenCT = table.Column<string>(type: "text", nullable: false),
                    MoTaCT = table.Column<string>(type: "text", nullable: false),
                    TongCalories = table.Column<decimal>(type: "numeric", nullable: false),
                    AnhCT = table.Column<string>(type: "text", nullable: false),
                    LuotXem = table.Column<int>(type: "integer", nullable: false),
                    LuotLuu = table.Column<int>(type: "integer", nullable: false),
                    LuotThich = table.Column<int>(type: "integer", nullable: false),
                    LuotShare = table.Column<int>(type: "integer", nullable: false),
                    MaND = table.Column<int>(type: "integer", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CongThuc", x => x.MaCT);
                    table.ForeignKey(
                        name: "FK_CongThuc_NguoiDung_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TheoDoi",
                columns: table => new
                {
                    Following_ID = table.Column<int>(type: "integer", nullable: false),
                    Followed_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TheoDoi", x => new { x.Following_ID, x.Followed_ID });
                    table.ForeignKey(
                        name: "FK_TheoDoi_NguoiDung_Followed_ID",
                        column: x => x.Followed_ID,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TheoDoi_NguoiDung_Following_ID",
                        column: x => x.Following_ID,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ThongBao",
                columns: table => new
                {
                    MaTB = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaND = table.Column<int>(type: "integer", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    DaXem = table.Column<bool>(type: "boolean", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBao", x => x.MaTB);
                    table.ForeignKey(
                        name: "FK_ThongBao_NguoiDung_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comment",
                columns: table => new
                {
                    MaComment = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaND = table.Column<int>(type: "integer", nullable: false),
                    MaBaiViet = table.Column<int>(type: "integer", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    ThoiGian = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comment", x => x.MaComment);
                    table.ForeignKey(
                        name: "FK_Comment_CongThuc_MaBaiViet",
                        column: x => x.MaBaiViet,
                        principalTable: "CongThuc",
                        principalColumn: "MaCT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comment_NguoiDung_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CTCongThuc",
                columns: table => new
                {
                    MaCT = table.Column<int>(type: "integer", nullable: false),
                    MaNL = table.Column<int>(type: "integer", nullable: false),
                    DinhLuong = table.Column<decimal>(type: "numeric", nullable: false),
                    DonViTinh = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CTCongThuc", x => new { x.MaCT, x.MaNL });
                    table.ForeignKey(
                        name: "FK_CTCongThuc_CongThuc_MaCT",
                        column: x => x.MaCT,
                        principalTable: "CongThuc",
                        principalColumn: "MaCT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CTCongThuc_NguyenLieu_MaNL",
                        column: x => x.MaNL,
                        principalTable: "NguyenLieu",
                        principalColumn: "MaNL",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CTDaLuu",
                columns: table => new
                {
                    MaND = table.Column<int>(type: "integer", nullable: false),
                    MaCT = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CTDaLuu", x => new { x.MaND, x.MaCT });
                    table.ForeignKey(
                        name: "FK_CTDaLuu_CongThuc_MaCT",
                        column: x => x.MaCT,
                        principalTable: "CongThuc",
                        principalColumn: "MaCT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CTDaLuu_NguoiDung_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CTDaThich",
                columns: table => new
                {
                    MaND = table.Column<int>(type: "integer", nullable: false),
                    MaCT = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CTDaThich", x => new { x.MaND, x.MaCT });
                    table.ForeignKey(
                        name: "FK_CTDaThich_CongThuc_MaCT",
                        column: x => x.MaCT,
                        principalTable: "CongThuc",
                        principalColumn: "MaCT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CTDaThich_NguoiDung_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DanhGia",
                columns: table => new
                {
                    MaBL = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaND = table.Column<int>(type: "integer", nullable: true),
                    MaCT = table.Column<int>(type: "integer", nullable: false),
                    Diem = table.Column<int>(type: "integer", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    NguoiDungMaND = table.Column<int>(type: "integer", nullable: false),
                    CongThucMaCT = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhGia", x => x.MaBL);
                    table.ForeignKey(
                        name: "FK_DanhGia_CongThuc_CongThucMaCT",
                        column: x => x.CongThucMaCT,
                        principalTable: "CongThuc",
                        principalColumn: "MaCT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DanhGia_NguoiDung_NguoiDungMaND",
                        column: x => x.NguoiDungMaND,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comment_MaBaiViet",
                table: "Comment",
                column: "MaBaiViet");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_MaND",
                table: "Comment",
                column: "MaND");

            migrationBuilder.CreateIndex(
                name: "IX_CongThuc_MaND",
                table: "CongThuc",
                column: "MaND");

            migrationBuilder.CreateIndex(
                name: "IX_CTCongThuc_MaNL",
                table: "CTCongThuc",
                column: "MaNL");

            migrationBuilder.CreateIndex(
                name: "IX_CTDaLuu_MaCT",
                table: "CTDaLuu",
                column: "MaCT");

            migrationBuilder.CreateIndex(
                name: "IX_CTDaThich_MaCT",
                table: "CTDaThich",
                column: "MaCT");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGia_CongThucMaCT",
                table: "DanhGia",
                column: "CongThucMaCT");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGia_NguoiDungMaND",
                table: "DanhGia",
                column: "NguoiDungMaND");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_MaTK",
                table: "NguoiDung",
                column: "MaTK",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "TaiKhoan",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "TaiKhoan",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_Claim_UserId",
                table: "TaiKhoan_Claim",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_Login_UserId",
                table: "TaiKhoan_Login",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_VaiTro_RoleId",
                table: "TaiKhoan_VaiTro",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_TheoDoi_Followed_ID",
                table: "TheoDoi",
                column: "Followed_ID");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBao_MaND",
                table: "ThongBao",
                column: "MaND");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "VaiTro",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VaiTro_Claim_RoleId",
                table: "VaiTro_Claim",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comment");

            migrationBuilder.DropTable(
                name: "CTCongThuc");

            migrationBuilder.DropTable(
                name: "CTDaLuu");

            migrationBuilder.DropTable(
                name: "CTDaThich");

            migrationBuilder.DropTable(
                name: "DanhGia");

            migrationBuilder.DropTable(
                name: "TaiKhoan_Claim");

            migrationBuilder.DropTable(
                name: "TaiKhoan_Login");

            migrationBuilder.DropTable(
                name: "TaiKhoan_Token");

            migrationBuilder.DropTable(
                name: "TaiKhoan_VaiTro");

            migrationBuilder.DropTable(
                name: "TheoDoi");

            migrationBuilder.DropTable(
                name: "ThongBao");

            migrationBuilder.DropTable(
                name: "VaiTro_Claim");

            migrationBuilder.DropTable(
                name: "NguyenLieu");

            migrationBuilder.DropTable(
                name: "CongThuc");

            migrationBuilder.DropTable(
                name: "VaiTro");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "TaiKhoan");
        }
    }
}
