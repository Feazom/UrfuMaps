using Microsoft.EntityFrameworkCore.Migrations;

namespace UrfuMaps.Api.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Floors",
                columns: table => new
                {
                    BuildingName = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    FloorNumber = table.Column<int>(type: "integer", nullable: false),
                    ImageLink = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Floors", x => new { x.FloorNumber, x.BuildingName });
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Login = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Login);
                });

            migrationBuilder.CreateTable(
                name: "Positions",
                columns: table => new
                {
                    Cabinet = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    BuildingName = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    FloorNumber = table.Column<int>(type: "integer", nullable: true),
                    X = table.Column<double>(type: "double precision", nullable: true),
                    Y = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Positions", x => x.Cabinet);
                    table.ForeignKey(
                        name: "FK_Positions_Floors_FloorNumber_BuildingName",
                        columns: x => new { x.FloorNumber, x.BuildingName },
                        principalTable: "Floors",
                        principalColumns: new[] { "FloorNumber", "BuildingName" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Positions_FloorNumber_BuildingName",
                table: "Positions",
                columns: new[] { "FloorNumber", "BuildingName" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Positions");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Floors");
        }
    }
}
