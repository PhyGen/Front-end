import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, AlertCircle, Zap } from 'lucide-react';
import clsx from 'clsx';

const OCRResultDisplay = ({ 
  result, 
  error, 
  isProcessing, 
  onCopyText, 
  onApplyToField,
  className 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyText) onCopyText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (isProcessing) {
    return (
      <Card className={clsx("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div className="text-center">
              <p className="text-blue-600 font-medium">Processing with OCR...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={clsx("w-full border-red-200", className)}>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-600 font-semibold mb-1">OCR Processing Failed</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <p className="text-gray-500 text-xs mt-2">
                Try uploading a clearer image or check if the image contains readable text.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className={clsx("w-full border-gray-200", className)}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Zap className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Upload an image to extract text using OCR</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const confidenceColor = result.confidence > 80 ? 'bg-green-100 text-green-800' :
                         result.confidence > 60 ? 'bg-yellow-100 text-yellow-800' :
                         'bg-red-100 text-red-800';

  const confidenceLabel = result.confidence > 80 ? 'High' :
                         result.confidence > 60 ? 'Medium' :
                         'Low';

  return (
    <Card className={clsx("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">OCR Results</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={confidenceColor}>
              {confidenceLabel} Confidence
            </Badge>
            <span className="text-sm text-gray-500">
              {Math.round(result.confidence)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Method: {result.method}</span>
          <span>•</span>
          <span>{result.text.split(/\s+/).length} words</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Extracted Text + Action Buttons in one big box */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg" >
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Extracted Text:</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(result.text)}
              className="h-7 px-2"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="mb-3">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
              {result.text}
            </pre>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApplyToField && onApplyToField('question', result.text)}
              className="flex-1"
            >
              Apply as Question
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApplyToField && onApplyToField('solution', result.text)}
              className="flex-1"
            >
              Apply as Solution
            </Button>
          </div>
        </div>

        {/* Detailed Analysis */}
        {result.words && result.words.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Word Analysis:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {result.words.slice(0, 10).map((word, index) => (
                <div key={index} className="flex justify-between p-1 bg-gray-50 rounded">
                  <span className="font-mono">{word.text}</span>
                  <span className="text-gray-500">{Math.round(word.confidence)}%</span>
                </div>
              ))}
              {result.words.length > 10 && (
                <div className="col-span-2 text-center text-gray-500 text-xs">
                  ... and {result.words.length - 10} more words
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OCRResultDisplay; 