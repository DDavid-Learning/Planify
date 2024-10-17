import { useEffect, useState } from "react";
import { Api } from "../../../core/services/api/api";
import { DOWNLOAD_PDF } from "../../../core/constants/constants";

function ShowPDFInIframe() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Explicitly define the type

  useEffect(() => {
    Api.get(DOWNLOAD_PDF, {
      responseType: "blob",
    })
      .then((response) => {
        // Create a blob URL for the PDF
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Set the URL for the iframe to display the PDF
        setPdfUrl(pdfUrl);
      })
      .catch((error) => {
        console.error("Error displaying the PDF:", error);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="PDF"
          style={{ flex: 1, width: '100%', border: 'none' }} // Flex to fill available space
        />
      )}
    </div>
  );
}

export default ShowPDFInIframe;