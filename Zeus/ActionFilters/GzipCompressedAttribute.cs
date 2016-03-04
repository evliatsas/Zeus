using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Zeus.ActionFilters
{
    internal class GzipCompressedAttribute : System.Web.Http.Filters.ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            bool supportGZip = actionExecutedContext.Request.Headers.AcceptEncoding.Any(x => x.Value == "gzip");
            if (!supportGZip || (actionExecutedContext.Response != null && actionExecutedContext.Response.Content == null))
            {
                base.OnActionExecuted(actionExecutedContext);
            }
            else
            {
                byte[] zippedContent;

                var contentBytes = actionExecutedContext.Response.Content.ReadAsByteArrayAsync().Result;
                using (var output = new MemoryStream())
                {
                    using (var compressor = new GZipStream(output, CompressionLevel.Optimal))
                    {
                        compressor.Write(contentBytes, 0, contentBytes.Length);
                    }

                    zippedContent = output.ToArray();
                }

                actionExecutedContext.Response.Content = new ByteArrayContent(zippedContent);
                actionExecutedContext.Response.Content.Headers.Remove("Content-Type");
                actionExecutedContext.Response.Content.Headers.Add("Content-encoding", "gzip");
                actionExecutedContext.Response.Content.Headers.Add("Content-Type", "application/json; charset=utf-8");

                base.OnActionExecuted(actionExecutedContext);
            }
        }
    }
}