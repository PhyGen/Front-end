import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import { Upload } from 'lucide-react';
import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';

const PhyGenVideo = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [manimCode, setManimCode] = useState('');
  const [finalVideoUrl, setFinalVideoUrl] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isUploadingSolution, setIsUploadingSolution] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const questionId = sessionStorage.getItem('selectedQuestionId');
    if (questionId) {
      setSelectedQuestionId(questionId);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const handleRemove = () => {
    setImage(null);
    setManimCode('');
    setFinalVideoUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleContinue = async () => {
    if (!image) return;
    setIsUploading(true);
    setVideoUrl(null);
    setManimCode('');
    try {
      const formData = new FormData();
      formData.append('file', image);

      const ocrRes = await fetch('https://41614da08582.ngrok-free.app/ocr/', {
        method: 'POST',
        body: formData
      });
      if (!ocrRes.ok) throw new Error('OCR failed');
      const ocrData = await ocrRes.json();
      const content = ocrData.text_fixed;

      const manimRes = await fetch('https://41614da08582.ngrok-free.app/generate-manim-video/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (!manimRes.ok) throw new Error('Generate manim video failed');
      const text = await manimRes.text();

      const marker = '---MANIM CODE---';
      const index = text.indexOf(marker);
      const code = index >= 0 ? text.slice(index + marker.length).trim() : '';
      setManimCode(code);
      toast.success('Generated Manim code!');
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendManimCode = async () => {
    if (!manimCode) return;
    setIsUploading(true);
    try {
      const res = await fetch('https://41614da08582.ngrok-free.app/generate-manim-code-raw-text/', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: manimCode
      });
      if (!res.ok) {
        const errorText = await res.text();
        toast.error('Error: ' + errorText);
        return;
      }
      const blob = await res.blob();
      const videoURL = URL.createObjectURL(blob);
      setFinalVideoUrl(videoURL);
      toast.success('Rendered final video!');
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSolutionVideo = async () => {
    if (!finalVideoUrl || !selectedQuestionId) {
      toast.error('No video available or question ID missing');
      return;
    }

    setIsUploadingSolution(true);
    try {
      // Convert blob URL to File object
      const response = await fetch(finalVideoUrl);
      const blob = await response.blob();
      const videoFile = new File([blob], 'solution-video.mp4', { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('QuestionId', selectedQuestionId);
      formData.append('Content', 'Video File Manim for Solution');
      formData.append('VideoFile', videoFile);

      const res = await api.post('/solutions/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        // Get solutionId from response
        const solutionId = res.data.solutionId;
        
        if (solutionId) {
          toast.success('Solution video uploaded successfully!');
        } else {
          toast.warning('Video uploaded but no solutionId returned');
        }
        
        // Clear the question ID from session storage
        sessionStorage.removeItem('selectedQuestionId');
        setSelectedQuestionId(null);
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUploadingSolution(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px]">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-1">Upload Image for Manim Video</h2>
          <Button variant="outline" className="bg-gray-200 text-black hover:bg-gray-300" onClick={() => navigate('/mod/question')}>Quay lại</Button>
        </div>
        <p className="text-gray-500 mb-6">Drag and drop your image here or click to browse</p>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <div
                className={clsx(
                  'flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition cursor-pointer',
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white',
                  'min-h-[320px] w-full max-w-lg py-12 px-6 mb-4'
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current && inputRef.current.click()}
                style={{ outline: dragActive ? '2px solid #3b82f6' : 'none' }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {!image ? (
                  <div className="flex flex-col items-center justify-center mb-2">
                    <div className="rounded-full bg-gray-100 p-3 mb-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <span className="text-base text-black font-medium">Drag & drop image here or click to select</span>
                    <span className="text-xs text-gray-400 mt-1">You can upload 1 image file up to 8 MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-64 max-w-full rounded shadow" style={{ objectFit: 'contain' }} />
                    <Button variant="outline" size="lg" className="text-base px-6 py-2" onClick={(e) => { e.stopPropagation(); handleRemove(); }}>Remove Image</Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <div className="flex gap-2">
              <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600" onClick={handleRemove}>Cancel</Button>
            </div>
            <Button onClick={handleContinue} disabled={!image || isUploading} className="bg-blue-500 hover:bg-blue-600">
              {isUploading ? 'Processing...' : 'Continue'}
            </Button>
          </div>

          {manimCode && (
            <div className="mt-8">
              <label className="block text-lg font-semibold mb-2">Generated Manim Code:</label>
              <textarea
                className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm"
                value={manimCode}
                onChange={(e) => setManimCode(e.target.value)}
              />
              <p className="text-sm text-gray-600 mt-2">
                The Manim code may be wrong, please correct it yourself and post it here until you get the results
              </p>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" onClick={handleSendManimCode} disabled={isUploading}>
                {isUploading ? 'Rendering...' : 'Send manim code to receive video'}
              </Button>
            </div>
          )}

          {finalVideoUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Final Rendered Video:</h3>
              <video src={finalVideoUrl} controls className="w-full max-h-[500px] rounded" />
              
              {selectedQuestionId && (
                <div className="mt-4">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold" 
                    onClick={handleAddSolutionVideo}
                    disabled={isUploadingSolution}
                  >
                    {isUploadingSolution ? 'Uploading Solution Video...' : 'Add Solution Video'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
};

export default PhyGenVideo;
