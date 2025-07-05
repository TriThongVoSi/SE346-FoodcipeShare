using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Foodify_DoAn.Migrations
{
    /// <inheritdoc />
    public partial class addCtTocaos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LuotToCao",
                table: "CongThuc",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "CtToCaos",
                columns: table => new
                {
                    MaND = table.Column<int>(type: "integer", nullable: false),
                    MaCT = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CtToCaos", x => new { x.MaCT, x.MaND });
                    table.ForeignKey(
                        name: "FK_CtToCaos_CongThuc_MaCT",
                        column: x => x.MaCT,
                        principalTable: "CongThuc",
                        principalColumn: "MaCT",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CtToCaos_NguoiDung_MaND",
                        column: x => x.MaND,
                        principalTable: "NguoiDung",
                        principalColumn: "MaND",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CtToCaos_MaND",
                table: "CtToCaos",
                column: "MaND");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CtToCaos");

            migrationBuilder.DropColumn(
                name: "LuotToCao",
                table: "CongThuc");
        }
    }
}
