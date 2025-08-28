
import React, { useState, useCallback, useMemo } from 'react';
import type { ComicStyle } from '../types';
import { COMIC_STYLES } from '../constants';
import { UploadIcon, SparklesIcon } from './Icons';

interface ComicGeneratorFormProps {
  onGenerate: (
    prompt: string,
    style: ComicStyle,
    customStyle: string,
    characterImage: File | null,
    characterDesc: string
  ) => void;
  disabled: boolean;
}

const ComicGeneratorForm: React.FC<ComicGeneratorFormProps> = ({ onGenerate, disabled }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ComicStyle>('anime');
  const [customStyle, setCustomStyle] = useState('');
  const [characterImage, setCharacterImage] = useState<File | null>(null);
  const [characterDesc, setCharacterDesc] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCharacterImage(file);
      setImagePreview(URL.createObjectURL(file));
      setCharacterDesc(''); // Clear text desc if image is uploaded
    }
  };

  const handleCharacterDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterDesc(e.target.value);
    if (characterImage) {
        setCharacterImage(null);
        setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, style, customStyle, characterImage, characterDesc);
    }
  };
  
  const isFormInvalid = useMemo(() => {
    return !prompt.trim() || (style === 'custom' && !customStyle.trim()) || disabled;
  }, [prompt, style, customStyle, disabled]);

  return (
    <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-lg font-medium text-indigo-300 mb-2">
            Your Story Idea
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A brave knight saves a princess from a dragon."
            className="w-full h-28 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 resize-none"
            required
          />
        </div>

        <div>
            <h3 className="text-lg font-medium text-indigo-300 mb-2">Define the Main Character</h3>
            <p className="text-sm text-gray-400 mb-3">Upload an image OR describe the character. Image upload takes priority.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label htmlFor="character-image-upload" className="relative cursor-pointer bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center p-4 text-center transition-colors duration-300 h-32">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Character preview" className="h-full w-full object-cover rounded-md" />
                    ) : (
                        <>
                            <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-gray-400">Upload Character Image</span>
                        </>
                    )}
                    <input id="character-image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                </label>
                <div className="flex flex-col justify-center">
                    <p className="text-center text-gray-500 mb-2 md:mb-4">OR</p>
                    <input
                        type="text"
                        value={characterDesc}
                        onChange={handleCharacterDescChange}
                        placeholder="e.g., A knight with silver armor and a red cape."
                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                    />
                </div>
            </div>
        </div>

        <div>
          <label htmlFor="style" className="block text-lg font-medium text-indigo-300 mb-2">
            Choose Your Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COMIC_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className={`p-3 rounded-lg text-center font-semibold transition-all duration-300 ${
                  style === s.id
                    ? 'bg-indigo-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-indigo-500'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {style === 'custom' && (
          <div>
            <label htmlFor="custom-style" className="block text-lg font-medium text-indigo-300 mb-2">
              Describe Your Custom Style
            </label>
            <input
              id="custom-style"
              type="text"
              value={customStyle}
              onChange={(e) => setCustomStyle(e.target.value)}
              placeholder="e.g., 1950s pop art style"
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
              required
            />
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isFormInvalid}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="w-6 h-6" />
            Generate Comic
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComicGeneratorForm;
