
import React, { useState, useCallback } from 'react';
import { editImage, fileToBase64 } from '../services/geminiService';
import Spinner from './Spinner';

interface ImageData {
  mimeType: string;
  data: string;
  dataUrl: string;
}

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setEditedImage(null);
      try {
        const imageData = await fileToBase64(file);
        setOriginalImage(imageData);
      } catch (e) {
        setError("Could not process file. Please try another image.");
        console.error(e);
      }
    }
  }, []);

  const handleEdit = async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }
    if (!prompt) {
      setError('Please enter an editing instruction.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const resultUrl = await editImage(originalImage.data, originalImage.mimeType, prompt);
      setEditedImage(resultUrl);
    } catch (e) {
      setError('Failed to edit image. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm border border-gray-700">
      <div className="flex flex-col space-y-6">
        {/* Image Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg p-4 min-h-[250px] border border-gray-700">
            {originalImage ? (
              <img src={originalImage.dataUrl} alt="Original" className="max-h-64 rounded-md object-contain" />
            ) : (
              <div className="text-center text-gray-500">
                <p>Upload an image to start</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-900 rounded-lg p-4 min-h-[250px] border border-gray-700">
            {isLoading && <Spinner large={true} />}
            {!isLoading && editedImage && (
              <img src={editedImage} alt="Edited" className="max-h-64 rounded-md object-contain animate-fade-in" />
            )}
            {!isLoading && !editedImage && (
                <div className="text-center text-gray-500">
                    <p>Your edited image will appear here</p>
                </div>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="file-upload" className="w-full text-center cursor-pointer bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition block">
              {originalImage ? 'Change Image' : 'Upload Image'}
            </label>
            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a retro filter"
            className="flex-grow bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={!originalImage}
          />
          <button
            onClick={handleEdit}
            disabled={isLoading || !originalImage || !prompt}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Editing...' : 'Apply Edit'}
          </button>
        </div>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ImageEditor;
