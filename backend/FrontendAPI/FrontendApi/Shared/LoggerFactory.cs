using Serilog;
using Serilog.Extensions.Logging;

namespace FrontendApi.Shared;

public static class LoggerFactory
{
    // Static constructor to configure Serilog once
    static LoggerFactory()
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()  // Log everything (Debug and above)
            .WriteTo.Console()
            .WriteTo.File("logs/app-log.txt")
            .CreateLogger();
    }

    // SerilogLoggerFactory wraps Serilog for Microsoft.Extensions.Logging
    public static readonly ILoggerFactory Logger = new SerilogLoggerFactory(Log.Logger);
}