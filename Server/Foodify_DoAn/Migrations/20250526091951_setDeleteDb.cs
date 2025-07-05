using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Foodify_DoAn.Migrations
{
    /// <inheritdoc />
    public partial class setDeleteDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TheoDoi_NguoiDung_Followed_ID",
                table: "TheoDoi");

            migrationBuilder.DropForeignKey(
                name: "FK_TheoDoi_NguoiDung_Following_ID",
                table: "TheoDoi");

            migrationBuilder.AddForeignKey(
                name: "FK_TheoDoi_NguoiDung_Followed_ID",
                table: "TheoDoi",
                column: "Followed_ID",
                principalTable: "NguoiDung",
                principalColumn: "MaND",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TheoDoi_NguoiDung_Following_ID",
                table: "TheoDoi",
                column: "Following_ID",
                principalTable: "NguoiDung",
                principalColumn: "MaND",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TheoDoi_NguoiDung_Followed_ID",
                table: "TheoDoi");

            migrationBuilder.DropForeignKey(
                name: "FK_TheoDoi_NguoiDung_Following_ID",
                table: "TheoDoi");

            migrationBuilder.AddForeignKey(
                name: "FK_TheoDoi_NguoiDung_Followed_ID",
                table: "TheoDoi",
                column: "Followed_ID",
                principalTable: "NguoiDung",
                principalColumn: "MaND",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TheoDoi_NguoiDung_Following_ID",
                table: "TheoDoi",
                column: "Following_ID",
                principalTable: "NguoiDung",
                principalColumn: "MaND",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
