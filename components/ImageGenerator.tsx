
import React, { useState } from 'react';
import { ImageStyle } from '../types';
import { generateFoodImage } from '../services/geminiService';
import Spinner from './Spinner';

const ImageGenerator: React.FC = () => {
  const [dishName, setDishName] = useState('');
  const [style, setStyle] = useState<ImageStyle>(ImageStyle.BRIGHT_MODERN);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!dishName) {
      setError('Please enter a dish name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateFoodImage(dishName, style);
      setGeneratedImage(imageUrl);
    } catch (e) {
      setError('Failed to generate image. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-sm border border-gray-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Controls */}
        <div className="flex flex-col space-y-6">
          <div>
            <label htmlFor="dishName" className="block text-sm font-medium text-gray-300 mb-2">
              Dish Name
            </label>
            <input
              type="text"
              id="dishName"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="e.g., Classic Margherita Pizza"
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Photo Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.values(ImageStyle).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-2 text-sm rounded-md transition-all duration-200 font-semibold ${
                    style === s
                      ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {/* Right Side: Image Display */}
        <div className="flex items-center justify-center bg-gray-900 rounded-lg min-h-[300px] lg:min-h-0 border border-gray-700">
          {isLoading && <Spinner large={true} />}
          {error && !isLoading && <p className="text-red-400 text-center px-4">{error}</p>}
          {!isLoading && !error && !generatedImage && (
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="mt-2">Your generated image will appear here</p>
            </div>
          )}
          {generatedImage && (
            <img
              src={generatedImage}
              alt={dishName}
              className="rounded-lg object-cover w-full h-full animate-fade-in"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
