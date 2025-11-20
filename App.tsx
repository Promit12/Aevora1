import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PhotoUploader } from './components/PhotoUploader';
import { LoadingState } from './components/LoadingState';
import { UploadedImage, AppStatus } from './types';
import { generateHugImage } from './services/geminiService';

function App() {
  const [childPhoto, setChildPhoto] = useState<UploadedImage | null>(null);
  const [adultPhoto, setAdultPhoto] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!childPhoto || !adultPhoto) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateHugImage(childPhoto.base64, adultPhoto.base64);
      setGeneratedImage(resultBase64);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      setStatus(AppStatus.ERROR);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while weaving memories.');
    }
  };

  const handleReset = useCallback(() => {
    setChildPhoto(null);
    setAdultPhoto(null);
    setGeneratedImage(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 pb-16 max-w-5xl">
        
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Initial State: Uploads */}
        {status !== AppStatus.SUCCESS && status !== AppStatus.PROCESSING && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-200">
                 <div className="flex items-center space-x-2 mb-4 border-b border-brand-100 pb-3">
                    <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2 py-1 rounded">Step 1</span>
                    <h2 className="font-serif text-lg text-brand-900">Childhood Photo</h2>
                 </div>
                 <PhotoUploader 
                    label="Upload Old Photo"
                    subLabel="You as a child"
                    image={childPhoto}
                    onImageSelect={setChildPhoto}
                    onRemove={() => setChildPhoto(null)}
                 />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-200">
                <div className="flex items-center space-x-2 mb-4 border-b border-brand-100 pb-3">
                    <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2 py-1 rounded">Step 2</span>
                    <h2 className="font-serif text-lg text-brand-900">Current Photo</h2>
                 </div>
                 <PhotoUploader 
                    label="Upload Recent Photo"
                    subLabel="You as an adult"
                    image={adultPhoto}
                    onImageSelect={setAdultPhoto}
                    onRemove={() => setAdultPhoto(null)}
                 />
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleGenerate}
                disabled={!childPhoto || !adultPhoto}
                className={`
                  px-10 py-4 rounded-full text-lg font-medium shadow-lg transform transition-all duration-200
                  ${(!childPhoto || !adultPhoto)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-warm-500 text-white hover:bg-warm-900 hover:-translate-y-1 hover:shadow-xl active:translate-y-0'
                  }
                `}
              >
                ✨ Generate Hug
              </button>
              {(!childPhoto || !adultPhoto) && (
                <p className="mt-3 text-sm text-gray-400">Upload both photos to continue</p>
              )}
            </div>
          </div>
        )}

        {/* Processing State */}
        {status === AppStatus.PROCESSING && (
          <div className="flex justify-center py-12">
            <LoadingState />
          </div>
        )}

        {/* Success State */}
        {status === AppStatus.SUCCESS && generatedImage && (
          <div className="animate-fade-in max-w-4xl mx-auto">
             <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-100 flex flex-col md:flex-row">
                
                {/* Result Image */}
                <div className="md:w-2/3 bg-gray-50 relative">
                  <img 
                    src={generatedImage} 
                    alt="Generated Hug" 
                    className="w-full h-full object-contain max-h-[600px]"
                  />
                </div>

                {/* Sidebar / Actions */}
                <div className="md:w-1/3 p-8 flex flex-col justify-center bg-brand-50 border-l border-brand-100">
                   <h2 className="text-2xl font-serif font-bold text-brand-900 mb-4">
                     Memory Created
                   </h2>
                   <p className="text-brand-600 mb-8 text-sm leading-relaxed">
                     Your past and present have been beautifully reunited. We hope this image brings a smile to your face.
                   </p>

                   <a 
                    href={generatedImage} 
                    download="aevora-memory.png"
                    className="w-full block text-center bg-brand-900 text-white py-3 rounded-xl font-medium hover:bg-black transition-colors mb-3 shadow-md"
                   >
                     Download Image
                   </a>

                   <button 
                    onClick={handleReset}
                    className="w-full block text-center bg-white border border-brand-300 text-brand-800 py-3 rounded-xl font-medium hover:bg-brand-100 transition-colors"
                   >
                     Start Over
                   </button>
                </div>
             </div>
             
             {/* Mini Previews of inputs */}
             <div className="mt-8 flex justify-center gap-4 opacity-70">
                <div className="text-center">
                    <p className="text-xs text-brand-500 mb-1">Child</p>
                    <img src={childPhoto?.previewUrl} className="w-16 h-16 object-cover rounded-lg border border-brand-200" alt="child input"/>
                </div>
                <div className="flex items-center text-brand-300">+</div>
                <div className="text-center">
                    <p className="text-xs text-brand-500 mb-1">Adult</p>
                    <img src={adultPhoto?.previewUrl} className="w-16 h-16 object-cover rounded-lg border border-brand-200" alt="adult input"/>
                </div>
             </div>
          </div>
        )}

      </main>

      <footer className="py-6 text-center text-brand-400 text-sm">
        <p>© {new Date().getFullYear()} Aevora. Powered by Gemini Nano Banana.</p>
      </footer>
    </div>
  );
}

export default App;