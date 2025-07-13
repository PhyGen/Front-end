import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, Camera, FileText } from 'lucide-react';
import OCRResultDisplay from '@/components/OCRResultDisplay';
import ocrService from '@/config/OCRService';
import { createTestImage } from '@/utils/ocrTest';

const OCRDemo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrError, setOcrError] = useState(null);
  const [testText, setTestText] = useState('2 + 2 = 4\n∫ f(x) dx = F(x) + C');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setOcrResult(null);
      setOcrError(null);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      setOcrError(null);
      setOcrResult(null);

      console.log('🖼️ Processing image:', selectedFile.name);
      const result = await ocrService.processImageAdvanced(selectedFile);

      if (result.success) {
        setOcrResult(result);
        console.log('✅ OCR completed:', result);
      } else {
        setOcrError(result.error);
        console.error('❌ OCR failed:', result.error);
      }
    } catch (error) {
      setOcrError(error.message);
      console.error('❌ Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTestImage = async () => {
    try {
      const testImageBlob = await createTestImage(testText);
      const testImageFile = new File([testImageBlob], 'test.png', { type: 'image/png' });
      setSelectedFile(testImageFile);
      setOcrResult(null);
      setOcrError(null);
    } catch (error) {
      console.error('❌ Failed to create test image:', error);
    }
  };

  const handleDownloadTestImage = async () => {
    try {
      const testImageBlob = await createTestImage(testText);
      const url = URL.createObjectURL(testImageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Failed to download test image:', error);
    }
  };

  const handleApplyToField = (fieldType, text) => {
    console.log(`Applying ${fieldType}:`, text);
    // Có thể mở rộng để điền vào form khác
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">OCR Demo - Tesseract.js + MathOCR</h1>
        <p className="text-gray-600">
          Test OCR service với Tesseract.js và MathOCR model để nhận diện text và công thức toán học
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div>
              <Label htmlFor="image-upload">Select Image File</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>

            {/* Test Image Creator */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Create Test Image</h3>
              <div className="space-y-2">
                <Label htmlFor="test-text">Test Text:</Label>
                <textarea
                  id="test-text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter text to create test image..."
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateTestImage}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Create Test Image
                  </Button>
                  <Button
                    onClick={handleDownloadTestImage}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Selected File</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">
                    <strong>Name:</strong> {selectedFile.name}
                  </p>
                  <p className="text-sm">
                    <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-sm">
                    <strong>Type:</strong> {selectedFile.type}
                  </p>
                </div>
                
                {/* Preview */}
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 rounded border"
                  />
                </div>
              </div>
            )}

            {/* Process Button */}
            <Button
              onClick={handleProcessImage}
              disabled={!selectedFile || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Process with OCR
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div>
          <OCRResultDisplay
            result={ocrResult}
            error={ocrError}
            isProcessing={isProcessing}
            onApplyToField={handleApplyToField}
          />
        </div>
      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. Upload Image:</strong> Chọn file hình ảnh chứa text hoặc công thức toán học</p>
            <p><strong>2. Create Test Image:</strong> Tạo hình ảnh test với text tùy chỉnh</p>
            <p><strong>3. Process:</strong> Nhấn nút "Process with OCR" để bắt đầu nhận diện</p>
            <p><strong>4. View Results:</strong> Xem kết quả OCR và phân tích nội dung</p>
            <p><strong>5. Apply:</strong> Sử dụng nút "Apply as Question/Solution" để áp dụng kết quả</p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-blue-800 mb-2">Supported Features:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Text recognition (English)</li>
              <li>• Mathematical formulas and symbols</li>
              <li>• Greek letters (α, β, γ, Δ, λ, θ, μ, Ω, π, ∑, √, ∫, ∞)</li>
                             <li>• Basic math operators (+, -, *, /, =, &lt;, &gt;, ≤, ≥, ≠, ±)</li>
              <li>• Pre-processing for better accuracy</li>
              <li>• Content analysis and classification</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OCRDemo; 