using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Foodify_DoAn.Migrations
{
    /// <inheritdoc />
    public partial class dbUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CtDaShare",
                columns: table => new
                {
                    MaShare = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaND = table.Column<int>(type: "integer", nullable: false),
                    MaCT = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CtDaShare", x => x.MaShare);
                    table.ForeignKey(
                        name: "FK_CtDaShare_CongThuc_MaCT",
                        column: x => x.MaCT,
                        principalTable: "CongThuc",
                        principalColumn: "MaCT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CtDaShare_NguoiDung_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CtDaShare_MaCT",
                table: "CtDaShare",
                column: "MaCT");

            migrationBuilder.CreateIndex(
                name: "IX_CtDaShare_MaND",
                table: "CtDaShare",
                column: "MaND");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CtDaShare");
        }
    }
}
