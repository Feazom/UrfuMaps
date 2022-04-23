FROM mcr.microsoft.com/dotnet/aspnet:5.0-focal AS base
WORKDIR /app
EXPOSE 80



ENV ASPNETCORE_URLS=http://+:80

#RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
#USER appuser

FROM mcr.microsoft.com/dotnet/sdk:5.0-focal AS build
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
WORKDIR /src
COPY ["UrfuMaps.Api/UrfuMaps.Api.csproj", "UrfuMaps.Api/"]
COPY ["UrfuMaps.Client/package.json", "UrfuMaps.Client/"]
RUN dotnet restore "UrfuMaps.Api/UrfuMaps.Api.csproj"
COPY . .
RUN npm install --only=prod --prefix UrfuMaps.Client/
RUN npm run build --prefix UrfuMaps.Client/
WORKDIR "/src/UrfuMaps.Api"
RUN dotnet build "UrfuMaps.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "UrfuMaps.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=publish /src/UrfuMaps.Client/build/ ./UrfuMaps.Client/build/
ENTRYPOINT ["dotnet", "UrfuMaps.Api.dll"]
