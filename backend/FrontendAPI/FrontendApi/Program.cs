using Serilog;
using FrontendAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Integrate Serilog with ASP.NET Core logging
builder.Host.UseSerilog();

IConfiguration configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: false)
    .Build();


// Add CORS services
if (string.IsNullOrEmpty(builder.Configuration["CorsOrigins"]))
{
    throw new Exception("CorsOrigins is not set in appsettings.json");
}
var corsOrigins = builder.Configuration["CorsOrigins"]!.Split(",");
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "_myAllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetPreflightMaxAge(TimeSpan.FromHours(24));
    });
});

// Register services
builder.Services.AddScoped<IEmailService, EmailService>();

// Add controllers
builder.Services.AddControllers();

var app = builder.Build();

var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
var logger = FrontendApi.Shared.LoggerFactory.Logger.CreateLogger<Program>();
lifetime.ApplicationStarted.Register(() =>
{
    logger.LogInformation("Application started at: {time}", DateTimeOffset.UtcNow);
});
lifetime.ApplicationStopping.Register(() =>
{
    logger.LogWarning("Application is shutting down at: {time}", DateTimeOffset.UtcNow);
});
lifetime.ApplicationStopped.Register(() =>
{
    logger.LogWarning("Application has stopped at: {time}", DateTimeOffset.UtcNow);
});

// Enable CORS
app.UseCors("_myAllowSpecificOrigins");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();