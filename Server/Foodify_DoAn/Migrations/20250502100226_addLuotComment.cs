using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Foodify_DoAn.Migrations
{
    /// <inheritdoc />
    public partial class addLuotComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LuotComment",
                table: "CongThuc",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LuotComment",
                table: "CongThuc");
        }
    }
}
