using FrontendAPI.Models;
using FrontendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace FrontendAPI.Controllers;

[ApiController]
[Route("api")]
public class BaseController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<BaseController> _logger;

    public BaseController(IEmailService emailService, ILogger<BaseController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

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

