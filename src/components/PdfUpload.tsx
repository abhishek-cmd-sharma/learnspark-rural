import { useState, useRef, useCallback, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PdfUploadProps {
 onContentExtracted: (content: string) => void;
  isProcessing: boolean;
}

export function PdfUpload({ onContentExtracted, isProcessing }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["application/pdf"];

  const processPdf = async (file: File) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Please upload a PDF file");
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Show processing state
    setError(null);

    try {
      // Dynamically import pdf-parse to avoid issues with SSR
      const pdfParse = (await import("pdf-parse")).default;
      
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Parse PDF
      const pdfData = await pdfParse(uint8Array);
      
      // Extract text content
      const content = pdfData.text.trim();
      
      if (!content) {
        throw new Error("No text content found in the PDF");
      }
      
      if (content.length < 50) {
        throw new Error("PDF content is too short for quiz generation (minimum 50 characters required)");
      }
      
      return content;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to process PDF: ${err.message}`);
      }
      throw new Error("Failed to process PDF file");
    }
  };

  const handleFile = async (file: File) => {
    try {
      const content = await processPdf(file);
      onContentExtracted(content);
      toast.success("PDF content extracted successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process PDF";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
 }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isProcessing) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [isProcessing]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClickUpload = () => {
    if (isProcessing) return;
    fileInputRef.current?.click();
  };

  return (
    <Card className="cosmic-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Upload PDF for Quiz Generation
        </CardTitle>
        <CardDescription>
          Upload a PDF document to automatically extract content and generate a quiz from it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging 
              ? "border-primary bg-primary/10" 
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUpload}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            disabled={isProcessing}
          />
          <div className="flex flex-col items-center justify-center gap-4">
            {isProcessing ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Processing PDF...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    <span className="text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF files only (max 10MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-secondary p-4 rounded-lg">
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Upload a PDF document containing educational content</li>
            <li>• The system will extract text and generate a quiz</li>
            <li>• Make sure your PDF contains sufficient text content (at least 50 characters)</li>
            <li>• File size limit: 10MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}