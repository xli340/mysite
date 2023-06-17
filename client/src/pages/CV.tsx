import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Container, Grid } from "@mui/material";
import { GetApp } from "@mui/icons-material";
import { Layout } from "../components/Layout";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Set the pdfjs.GlobalWorkerOptions.workerSrc property to specify the PDF.js worker script path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CV: React.FC<{ url: string }> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  // Handle the callback function when the PDF file is loaded successfully, and update the total number of pages
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // When the URL property changes, reset the total pages to null to reload the PDF file
  useEffect(() => {
    setNumPages(null);
  }, [url]);

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ marginTop: "16px" }}>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<GetApp />}
              onClick={() => {
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.download = "Xinya LI.pdf";
                link.click();
              }}
            >
              Download
            </Button>
          </Grid>
          <Grid item xs={12}>
            <style>
              {`.react-pdf__Page__annotations.annotationLayer { display: none !important; }`}
            </style>
            {/* PDF file display */}
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
              {/* loop through each page and display */}
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default CV;
