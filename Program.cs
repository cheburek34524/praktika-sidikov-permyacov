var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();   // index.html как дефолтная страница
app.UseStaticFiles();    // отдаёт wwwroot

app.Run();