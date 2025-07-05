# Bước 1: Dùng image .NET SDK để build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy file csproj và restore packages
COPY *.csproj ./
RUN dotnet restore

# Copy toàn bộ source code và build ra thư mục out
COPY . ./
RUN dotnet publish -c Release -o out

# Bước 2: Dùng image ASP.NET để chạy
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Cấu hình cổng cho Render
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# File khởi chạy
ENTRYPOINT ["dotnet", "Foodify_DoAn.dll"]
