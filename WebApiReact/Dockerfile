# ===== BUILD =====
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY WebApiReact/WebApiReact.csproj WebApiReact/
RUN dotnet restore WebApiReact/WebApiReact.csproj

COPY . .
WORKDIR /src/WebApiReact
RUN dotnet publish -c Release -o /app/publish

# ===== RUNTIME =====
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

EXPOSE 8080

COPY --from=build /app/publish .


ENTRYPOINT ["dotnet", "WebApiReact.dll"]
