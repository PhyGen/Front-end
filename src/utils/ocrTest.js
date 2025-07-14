// Test file cho OCR Service
// Có thể chạy trong browser console để test

import ocrService from '@/config/OCRService';

export const testOCRService = async () => {
  console.log('🧪 Testing OCR Service...');
  
  try {
    // Test 1: Khởi tạo service
    console.log('📋 Test 1: Initializing service...');
    await ocrService.initialize();
    console.log('✅ Service initialized successfully');
    
    // Test 2: Phân tích nội dung
    console.log('📋 Test 2: Content analysis...');
    const testTexts = [
      'Hello world',
      '2 + 2 = 4',
      '∫ f(x) dx = F(x) + C',
      'E = mc²',
      'α + β = γ',
      'Δx = x₂ - x₁'
    ];
    
    testTexts.forEach(text => {
      const analysis = ocrService.analyzeContent(text);
      console.log(`Text: "${text}"`);
      console.log(`  - Is Math: ${analysis.isMath}`);
      console.log(`  - Word Count: ${analysis.wordCount}`);
      console.log(`  - Math Symbols: [${analysis.mathSymbols.join(', ')}]`);
    });
    
    // Test 3: Math detection patterns
    console.log('📋 Test 3: Math detection patterns...');
    const mathPatterns = [
      /[+\-*/=<>≤≥≠±∞∫∑∏√∂]/g,
      /[α-ωΑ-Ω]/g,
      /[ΔλθμΩπ∑√∫∞]/g,
      /\d+\s*[+\-*/]\s*\d+/g,
      /[()\[\]{}]/g,
      /\^[0-9]/g,
      /_\{[^}]+\}/g,
      /\^{[^}]+\}/g,
      /\\[a-zA-Z]+/g,
    ];
    
    const testMathText = '∫₀^∞ e^(-x²) dx = √π/2';
    mathPatterns.forEach((pattern, index) => {
      const matches = testMathText.match(pattern);
      console.log(`Pattern ${index + 1}: ${matches ? matches.length : 0} matches`);
    });
    
    console.log('✅ All tests completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

export const testImageProcessing = async (imageFile) => {
  console.log('🧪 Testing image processing...');
  
  if (!imageFile) {
    console.error('❌ No image file provided');
    return;
  }
  
  try {
    // Test basic processing
    console.log('📋 Test 1: Basic processing...');
    const basicResult = await ocrService.processImage(imageFile);
    console.log('Basic result:', basicResult);
    
    // Test advanced processing
    console.log('📋 Test 2: Advanced processing...');
    const advancedResult = await ocrService.processImageAdvanced(imageFile);
    console.log('Advanced result:', advancedResult);
    
    // Test content analysis
    if (advancedResult.success) {
      console.log('📋 Test 3: Content analysis...');
      const analysis = ocrService.analyzeContent(advancedResult.text);
      console.log('Content analysis:', analysis);
    }
    
    console.log('✅ Image processing tests completed');
    
  } catch (error) {
    console.error('❌ Image processing test failed:', error);
  }
};

// Utility functions for testing
export const createTestImage = (text, width = 800, height = 400) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  // Fill background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const lines = text.split('\n');
  const lineHeight = 30;
  const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });
  
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
};

export const runAllTests = async () => {
  console.log('🚀 Running all OCR tests...');
  
  await testOCRService();
  
  // Create test image
  const testImageBlob = await createTestImage('2 + 2 = 4\n∫ f(x) dx = F(x) + C');
  const testImageFile = new File([testImageBlob], 'test.png', { type: 'image/png' });
  
  await testImageProcessing(testImageFile);
  
  console.log('🎉 All tests completed!');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testOCR = {
    testOCRService,
    testImageProcessing,
    createTestImage,
    runAllTests
  };
} 