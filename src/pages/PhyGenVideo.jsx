import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import { Upload } from 'lucide-react';

const PhyGenVideo = () => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

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
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleContinue = async () => {
    if (!image) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', image);
      const response = await fetch('http://localhost:8000/solve-physics-problem/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data && data.message) {
        toast.success(data.message);
        console.log("Messege",data.message);
      } else {
        toast.error('No message returned from API');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px]">
        <ToastContainer />
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-1">Upload Image for Physics Problem</h2>
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
                <>
                  <div className="flex flex-col items-center justify-center mb-2">
                    <div className="rounded-full bg-gray-100 p-3 mb-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <span className="text-base text-black font-medium">Drag & drop image here or click to select</span>
                    <span className="text-xs text-gray-400 mt-1">You can upload 1 image file up to 8 MB</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-64 max-w-full rounded shadow" style={{ objectFit: 'contain' }} />
                  <Button variant="outline" size="lg" className="text-base px-6 py-2" onClick={e => { e.stopPropagation(); handleRemove(); }}>Remove Image</Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <Button onClick={handleRemove} variant="outline" className="bg-red-500 text-white hover:bg-red-600">Cancel</Button>
          <Button onClick={handleContinue} disabled={!image || isUploading} className="bg-blue-500 hover:bg-blue-600">
            {isUploading ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhyGenVideo; 