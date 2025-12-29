using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FrontendAPI.Models;

public class ContactFormRequestModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public InquiryType InquiryType { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string? CompanyName { get; set; }
    
    public string? PhoneNumber { get; set; }
    
    [Required]
    public string Message { get; set; } = string.Empty;
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum InquiryType
{
    Support,
    Sales,
    Partnership
}

