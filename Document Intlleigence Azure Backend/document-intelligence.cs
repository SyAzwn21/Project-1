using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Reflection.Metadata;
using System.Text.Json;

namespace Docu
{
    public class RequestData
    {
        public string DocumentUrl { get; set; }
    }
    public class FormRecognizerFunction
    {
        private static readonly string endpoint = Environment.GetEnvironmentVariable("FORM_RECOGNIZER_ENDPOINT");
        private static readonly string apiKey = Environment.GetEnvironmentVariable("FORM_RECOGNIZER_API_KEY");
        
        private readonly ILogger<FormRecognizerFunction> _logger;

        public FormRecognizerFunction(ILogger<FormRecognizerFunction> logger)
        {
            _logger = logger;
        }
  
        [Function("AnalyzeReceipt")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("AnalyzeReceipt Function triggered.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonSerializer.Deserialize<RequestData>(requestBody);

            if (string.IsNullOrEmpty(data.DocumentUrl))
            {
                return new BadRequestObjectResult("Please pass the document URL in the request body."); 
            }

            var client = new DocumentAnalysisClient(new Uri(endpoint), new AzureKeyCredential(apiKey));

            var operation = await client.AnalyzeDocumentFromUriAsync(
                WaitUntil.Completed, 
                "prebuilt-receipt", 
                new Uri(data.DocumentUrl)
            );
            var document = operation.Value;

            return new OkObjectResult(document);
        }
    }
}