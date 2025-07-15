import Tesseract from 'tesseract.js';

class OCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
  }

  // Khởi tạo worker với MathOCR model
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔧 Initializing Tesseract.js...');
      
      // Không cần tạo worker riêng, sử dụng Tesseract.recognize trực tiếp
      this.isInitialized = true;
      console.log('✅ Tesseract.js ready to use');
    } catch (error) {
      console.error('❌ Failed to initialize Tesseract.js:', error);
      throw error;
    }
  }

  // Xử lý OCR cho hình ảnh
  async processImage(imageFile, language = 'eng+vie') {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🖼️ Processing image with OCR...');
      const result = await Tesseract.recognize(imageFile, language, {
        logger: m => console.log('📝 Tesseract:', m)
      });
      console.log('📄 OCR Result:', result);
      return {
        success: true,
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words,
        lines: result.data.lines,
        blocks: result.data.blocks
      };
    } catch (error) {
      console.error('❌ OCR processing failed:', error);
      return {
        success: false,
        error: error.message,
        text: ''
      };
    }
  }

  // Xử lý OCR với pre-processing để cải thiện độ chính xác
  async processImageWithPreprocessing(imageFile, language = 'eng+vie') {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🖼️ Processing image with preprocessing...');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            // Grayscale + tăng contrast + binarization
            for (let i = 0; i < data.length; i += 4) {
              const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
              let contrast = Math.min(255, Math.max(0, (gray - 128) * 1.5 + 128));
              // Binarization (threshold)
              contrast = contrast > 160 ? 255 : 0;
              data[i] = data[i + 1] = data[i + 2] = contrast;
            }
            ctx.putImageData(imageData, 0, 0);
            canvas.toBlob(async (blob) => {
              try {
                const result = await Tesseract.recognize(blob, language, {
                  logger: m => console.log('📝 Tesseract:', m)
                });
                console.log('📄 Processed OCR Result:', result);
                resolve({
                  success: true,
                  text: result.data.text,
                  confidence: result.data.confidence,
                  words: result.data.words,
                  lines: result.data.lines,
                  blocks: result.data.blocks
                });
              } catch (error) {
                reject(error);
              }
            }, 'image/png');
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(imageFile);
      });
    } catch (error) {
      console.error('❌ OCR processing with preprocessing failed:', error);
      return {
        success: false,
        error: error.message,
        text: ''
      };
    }
  }

  // Xử lý OCR với nhiều phương pháp và chọn kết quả tốt nhất
  async processImageAdvanced(imageFile, language = 'eng+vie') {
    try {
      console.log('🖼️ Processing image with advanced OCR...');
      const [normalResult, processedResult] = await Promise.allSettled([
        this.processImage(imageFile, language),
        this.processImageWithPreprocessing(imageFile, language)
      ]);
      const results = [];
      if (normalResult.status === 'fulfilled' && normalResult.value.success) {
        results.push({
          method: 'normal',
          ...normalResult.value
        });
      }
      if (processedResult.status === 'fulfilled' && processedResult.value.success) {
        results.push({
          method: 'processed',
          ...processedResult.value
        });
      }
      if (results.length === 0) {
        throw new Error('All OCR methods failed');
      }
      const bestResult = results.reduce((best, current) =>
        current.confidence > best.confidence ? current : best
      );
      console.log('🏆 Best OCR result:', bestResult);
      return bestResult;
    } catch (error) {
      console.error('❌ Advanced OCR processing failed:', error);
      return {
        success: false,
        error: error.message,
        text: ''
      };
    }
  }

  // Terminate worker khi không cần thiết
  async terminate() {
    this.isInitialized = false;
    console.log('🔚 Tesseract service terminated');
  }

  // Kiểm tra xem có phải là công thức toán học không
  isMathFormula(text) {
    const mathPatterns = [
      /[+\-*/=<>≤≥≠±∞∫∑∏√∂]/g,  // Các ký hiệu toán học cơ bản
      /[α-ωΑ-Ω]/g,              // Chữ cái Hy Lạp
      /[ΔλθμΩπ∑√∫∞]/g,          // Các ký hiệu đặc biệt
      /\d+\s*[+\-*/]\s*\d+/g,   // Phép tính số học
      /[()\[\]{}]/g,            // Dấu ngoặc
      /\^[0-9]/g,               // Số mũ
      /_\{[^}]+\}/g,            // Chỉ số dưới
      /\^{[^}]+\}/g,            // Số mũ phức tạp
      /\\[a-zA-Z]+/g,           // LaTeX commands
    ];
    
    const mathScore = mathPatterns.reduce((score, pattern) => {
      const matches = text.match(pattern);
      return score + (matches ? matches.length : 0);
    }, 0);
    
    // Nếu có ít nhất 2 ký hiệu toán học, coi như là công thức
    return mathScore >= 2;
  }

  // Phân tích và phân loại nội dung
  analyzeContent(text) {
    const analysis = {
      isMath: this.isMathFormula(text),
      hasText: text.trim().length > 0,
      wordCount: text.split(/\s+/).length,
      mathSymbols: [],
      confidence: 'unknown'
    };
    
    // Tìm các ký hiệu toán học
    const mathSymbols = text.match(/[+\-*/=<>≤≥≠±∞∫∑∏√∂α-ωΑ-ΩΔλθμΩπ∑√∫∞]/g) || [];
    analysis.mathSymbols = [...new Set(mathSymbols)];
    
    return analysis;
  }
}

// Tạo instance singleton
const ocrService = new OCRService();

export default ocrService; 