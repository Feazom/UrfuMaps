using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace UrfuMaps.Api.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Floors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BuildingName = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    FloorNumber = table.Column<int>(type: "integer", nullable: true),
                    ImageLink = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Floors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Types",
                columns: table => new
                {
                    Name = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Types", x => x.Name);
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
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Name = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    X = table.Column<double>(type: "double precision", nullable: true),
                    Y = table.Column<double>(type: "double precision", nullable: true),
                    FloorId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Positions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Positions_Floors_FloorId",
                        column: x => x.FloorId,
                        principalTable: "Floors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Positions_Types_Type",
                        column: x => x.Type,
                        principalTable: "Types",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Edges",
                columns: table => new
                {
                    FromId = table.Column<Guid>(type: "uuid", nullable: false),
                    ToId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Edges", x => new { x.FromId, x.ToId });
                    table.ForeignKey(
                        name: "FK_Edges_Positions_FromId",
                        column: x => x.FromId,
                        principalTable: "Positions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Edges_Positions_ToId",
                        column: x => x.ToId,
                        principalTable: "Positions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Edges_ToId",
                table: "Edges",
                column: "ToId");

            migrationBuilder.CreateIndex(
                name: "IX_Positions_FloorId",
                table: "Positions",
                column: "FloorId");

            migrationBuilder.CreateIndex(
                name: "IX_Positions_Name_X_Y",
                table: "Positions",
                columns: new[] { "Name", "X", "Y" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Positions_Type",
                table: "Positions",
                column: "Type");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Edges");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Positions");

            migrationBuilder.DropTable(
                name: "Floors");

            migrationBuilder.DropTable(
                name: "Types");
        }
    }
}
