using FrontendAPI.Models;
using MailKit.Net.Smtp;
using MimeKit;

namespace FrontendAPI.Services;

public interface IEmailService
{
    Task SendContactFormEmailAsync(ContactFormRequestModel contactForm);
}

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _emailSettings = configuration.GetSection("EmailSettings").Get<EmailSettings>()  //TOOD: Retrieve email setting password in another place than appsettings, locally it is stored in user secrets
            ?? throw new InvalidOperationException("EmailSettings configuration is missing");
        _logger = logger;
    }

    public async Task SendContactFormEmailAsync(ContactFormRequestModel contactForm)
    {
        try
        {
            var message = new MimeMessage();
            
            // From: Your website email
            message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromEmail));
            
            // To: Where you want to receive contact form submissions
            message.To.Add(new MailboxAddress("Paytomic Team", _emailSettings.ToEmail));
            
            // Reply-To: The customer's email so you can easily reply
            message.ReplyTo.Add(new MailboxAddress(contactForm.Name, contactForm.Email));
            
            // Subject
            message.Subject = $"New Contact Form Submission - {contactForm.InquiryType} from {contactForm.Name}";
            
            // Body - formatted HTML email
            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Inquiry Type:</strong> {contactForm.InquiryType}</p>
                    <p><strong>Name:</strong> {contactForm.Name}</p>
                    <p><strong>Email:</strong> <a href='mailto:{contactForm.Email}'>{contactForm.Email}</a></p>
                    <p><strong>Company:</strong> {contactForm.CompanyName}</p>
                    <p><strong>Phone:</strong> {contactForm.PhoneNumber}</p>
                    <hr>
                    <p><strong>Message:</strong></p>
                    <p>{contactForm.Message?.Replace("\n", "<br>")}</p>
                ",
                TextBody = $@"
New Contact Form Submission

Inquiry Type: {contactForm.InquiryType}
Name: {contactForm.Name}
Email: {contactForm.Email}
Company: {contactForm.CompanyName}
Phone: {contactForm.PhoneNumber}

Message:
{contactForm.Message}
                "
            };
            
            message.Body = bodyBuilder.ToMessageBody();
            
            // Send the email
            using var client = new SmtpClient();
            await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            
            // Authenticate if credentials are provided
            if (!string.IsNullOrEmpty(_emailSettings.Username) && !string.IsNullOrEmpty(_emailSettings.Password)) 
            {
                await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
            }
            
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
            
            _logger.LogInformation("Contact form email sent successfully from {Name} ({Email})", 
                contactForm.Name, contactForm.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send contact form email from {Name} ({Email})", 
                contactForm.Name, contactForm.Email);
            throw;
        }
    }
}

