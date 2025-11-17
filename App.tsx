
import React, { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import { GenerateIcon, EditIcon } from './components/IconComponents';

type Tab = 'generate' | 'edit';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  const tabs: { id: Tab; name: string; icon: React.ReactNode }[] = [
    { id: 'generate', name: 'Virtual Photographer', icon: <GenerateIcon /> },
    { id: 'edit', name: 'Image Editor', icon: <EditIcon /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
            AI Image Studio
          </h1>
          <p className="text-gray-400 mt-2">
            Create stunning visuals with the power of AI
          </p>
        </header>

        <div className="mb-8 flex justify-center border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium transition-colors duration-200 focus:outline-none ${
                activeTab === tab.id
                  ? 'border-b-2 border-indigo-500 text-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        <main>
          {activeTab === 'generate' && <ImageGenerator />}
          {activeTab === 'edit' && <ImageEditor />}
        </main>
      </div>
       <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
          <p>Powered by Google Gemini</p>
        </footer>
    </div>
  );
};

export default App;
