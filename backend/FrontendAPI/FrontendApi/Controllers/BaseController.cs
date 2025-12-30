using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FrontendAPI.Models;
using FrontendAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace FrontendAPI.Controllers;

[ApiController]
[Route("api")]
public class BaseController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<BaseController> _logger;
    private readonly IConfiguration _configuration;

    public BaseController(IEmailService emailService,  ILogger<BaseController> logger, IConfiguration configuration)
    {
        _emailService = emailService;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("get-token")]
    [AllowAnonymous]
    public IActionResult GetToken()
    {
        try
        {
            var jwtKey = _configuration["JwtKey"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                _logger.LogError("JwtKey is not configured");
                return StatusCode(500, new { error = "Server configuration error" });
            }

            var claims = new[]
            {
                new Claim("scope", "anonymous.website")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey));

            var token = new JwtSecurityToken(
                issuer: "paytomic.dk",
                audience: "paytomic.dk",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(3),
                signingCredentials: new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating JWT token");
            return StatusCode(500, new { error = "Failed to generate token" });
        }
    }
    
    [Authorize]
    [HttpPost("contact")]
    public async Task<ActionResult> ContactFormSubmitted([FromBody] ContactFormRequestModel contactFormRequestModel)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _emailService.SendContactFormEmailAsync(contactFormRequestModel);
            
            _logger.LogInformation("Contact form submitted successfully by {Email}", contactFormRequestModel.Email);
            
            return Ok(new { message = "Your message has been sent successfully. We'll get back to you soon!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing contact form submission");
            return StatusCode(500, new { message = "An error occurred while sending your message. Please try again later." });
        }
    }
}

