using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Foodify_DoAn.Migrations
{
    /// <inheritdoc />
    public partial class updatdbadd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaBaiViet",
                table: "ThongBao",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaBaiViet",
                table: "ThongBao");
        }
    }
}
