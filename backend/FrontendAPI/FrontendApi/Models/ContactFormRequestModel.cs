namespace FrontendAPI.Models;

public class ContactFormRequestModel
{
    public string Email { get; set; }
    public InquiryType InquiryType { get; set; }
    public string Name { get; set; }
    public string CompanyName { get; set; }
    public string PhoneNumber { get; set; }
    public string Message { get; set; }
    
    
}

public enum InquiryType
{
    Support,
    Sales,
    Partnership
}

