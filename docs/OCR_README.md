# OCR Service với Tesseract.js và MathOCR

## Tổng quan

OCR Service được tích hợp vào ứng dụng PhyGen để nhận diện text và công thức toán học từ hình ảnh. Service sử dụng Tesseract.js với MathOCR model để đạt độ chính xác cao trong việc nhận diện các ký hiệu toán học và vật lý.

## Tính năng

### 1. Nhận diện Text và Công thức Toán học
- Hỗ trợ nhận diện text thường
- Hỗ trợ nhận diện công thức toán học với các ký hiệu đặc biệt
- Hỗ trợ chữ cái Hy Lạp (α, β, γ, Δ, λ, θ, μ, Ω, π, ∑, √, ∫, ∞, ...)
- Hỗ trợ các ký hiệu toán học cơ bản (+, -, *, /, =, <, >, ≤, ≥, ≠, ±, ...)

### 2. Pre-processing Image
- Tăng độ tương phản
- Giảm nhiễu
- Chuyển đổi sang grayscale để cải thiện độ chính xác

### 3. Advanced Processing
- Thử nhiều phương pháp xử lý
- Tự động chọn kết quả có độ tin cậy cao nhất
- Phân tích nội dung để xác định loại text

## Cách sử dụng

### 1. Import Service
```javascript
import ocrService from '@/config/OCRService';
```

### 2. Khởi tạo (tự động)
```javascript
// Service sẽ tự động khởi tạo khi cần thiết
// Hoặc có thể khởi tạo thủ công
await ocrService.initialize();
```

### 3. Xử lý hình ảnh
```javascript
// Xử lý cơ bản
const result = await ocrService.processImage(imageFile);

// Xử lý với pre-processing
const result = await ocrService.processImageWithPreprocessing(imageFile);

// Xử lý nâng cao (khuyến nghị)
const result = await ocrService.processImageAdvanced(imageFile);
```

### 4. Kết quả trả về
```javascript
{
  success: true,
  text: "Extracted text content",
  confidence: 85.5, // Độ tin cậy (%)
  method: "normal" | "processed", // Phương pháp được sử dụng
  words: [...], // Chi tiết từng từ
  lines: [...], // Chi tiết từng dòng
  blocks: [...] // Chi tiết từng block
}
```

### 5. Phân tích nội dung
```javascript
const analysis = ocrService.analyzeContent(text);
// Kết quả:
{
  isMath: true, // Có phải công thức toán học không
  hasText: true, // Có text không
  wordCount: 10, // Số từ
  mathSymbols: ['+', '=', 'π'], // Các ký hiệu toán học tìm thấy
  confidence: 'unknown'
}
```

### 6. Cleanup
```javascript
// Khi không cần thiết nữa
await ocrService.terminate();
```

## Tích hợp vào Component

### 1. Trong MultiStepWizard
```javascript
const handleImage = async (file) => {
  try {
    setIsProcessingOCR(true);
    const result = await ocrService.processImageAdvanced(file);
    
    if (result.success) {
      setOcrResult(result);
      
      // Tự động điền vào form
      const analysis = ocrService.analyzeContent(result.text);
      if (analysis.isMath) {
        setManualSolution(result.text);
      } else {
        setManualQuestion(result.text);
      }
    }
  } catch (error) {
    setOcrError(error.message);
  } finally {
    setIsProcessingOCR(false);
  }
};
```

### 2. Sử dụng OCRResultDisplay Component
```javascript
import OCRResultDisplay from './OCRResultDisplay';

<OCRResultDisplay
  result={ocrResult}
  error={ocrError}
  isProcessing={isProcessingOCR}
  onApplyToField={handleApplyToField}
/>
```

## Cấu hình

### 1. Ký hiệu được hỗ trợ
Service được cấu hình để nhận diện các ký hiệu sau:
- Chữ số: 0-9
- Chữ cái: A-Z, a-z
- Ký hiệu toán học: +, -, *, /, =, <, >, ≤, ≥, ≠, ±, ∞, ∫, ∑, ∏, √, ∂
- Chữ cái Hy Lạp: α-ω, Α-Ω
- Ký hiệu đặc biệt: Δ, λ, θ, μ, Ω, π, ∑, √, ∫, ∞
- Dấu câu: .,;:!?@#$%^&*_|\/<>~`'"()
- Dấu ngoặc: [], {}

### 2. PSM (Page Segmentation Mode)
- Sử dụng `PSM.AUTO` để tự động phát hiện layout
- Có thể thay đổi theo nhu cầu cụ thể

### 3. Language Models
- `eng`: Tiếng Anh
- `equ`: MathOCR model cho công thức toán học

## Xử lý lỗi

### 1. Lỗi khởi tạo
```javascript
try {
  await ocrService.initialize();
} catch (error) {
  console.error('Failed to initialize OCR:', error);
  // Fallback to manual input
}
```

### 2. Lỗi xử lý hình ảnh
```javascript
const result = await ocrService.processImageAdvanced(file);
if (!result.success) {
  console.error('OCR failed:', result.error);
  // Hiển thị thông báo lỗi cho user
}
```

### 3. Lỗi network
- Tesseract.js sẽ tự động retry
- Có thể thêm timeout để tránh chờ quá lâu

## Performance

### 1. Kích thước file
- Khuyến nghị: < 8MB
- Format: PNG, JPG, JPEG, BMP, TIFF

### 2. Thời gian xử lý
- Hình ảnh đơn giản: 2-5 giây
- Hình ảnh phức tạp: 5-15 giây
- Có thể tăng lên với hình ảnh lớn

### 3. Memory usage
- Worker được tạo một lần và tái sử dụng
- Tự động cleanup khi component unmount

## Troubleshooting

### 1. OCR không nhận diện được text
- Kiểm tra chất lượng hình ảnh
- Thử tăng độ tương phản
- Đảm bảo text đủ lớn và rõ ràng

### 2. Kết quả không chính xác
- Thử phương pháp pre-processing
- Kiểm tra language model
- Xem xét sử dụng advanced processing

### 3. Performance chậm
- Giảm kích thước hình ảnh
- Sử dụng format PNG thay vì JPG
- Kiểm tra network connection

## Future Improvements

1. **Multi-language support**: Thêm hỗ trợ tiếng Việt
2. **Better math detection**: Cải thiện thuật toán phát hiện công thức
3. **Batch processing**: Xử lý nhiều hình ảnh cùng lúc
4. **Cloud OCR**: Tích hợp với Google Cloud Vision API
5. **Real-time processing**: Xử lý real-time với camera

## Dependencies

- `tesseract.js`: ^4.1.1
- MathOCR model (built-in với Tesseract.js)

## License

MIT License - Tương tự như Tesseract.js 