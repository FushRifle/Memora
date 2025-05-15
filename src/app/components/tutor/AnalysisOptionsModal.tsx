import { useState } from 'react';
import { FiSettings, FiX } from 'react-icons/fi';

export default function AnalysisOptionsModal({
    options,
    setOptions,
    onClose
}: {
    options: any;
    setOptions: (options: any) => void;
    onClose: () => void;
}) {
    const [localOptions, setLocalOptions] = useState(options);

    const handleSave = () => {
        setOptions(localOptions);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Analysis Settings</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Output Format</label>
                        <select
                            value={localOptions.format}
                            onChange={(e) => setLocalOptions({ ...localOptions, format: e.target.value })}
                            className="w-full border rounded p-2"
                        >
                            <option value="bullet-points">Bullet Points</option>
                            <option value="paragraph">Paragraph</option>
                            <option value="summary-table">Summary Table</option>
                            <option value="mind-map">Mind Map</option>
                            <option value="outline">Outline</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Complexity Level</label>
                        <select
                            value={localOptions.complexity}
                            onChange={(e) => setLocalOptions({ ...localOptions, complexity: e.target.value })}
                            className="w-full border rounded p-2"
                        >
                            <option value="simple">Simple</option>
                            <option value="detailed">Detailed</option>
                            <option value="technical">Technical</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="includeExamples"
                            checked={localOptions.includeExamples}
                            onChange={(e) => setLocalOptions({ ...localOptions, includeExamples: e.target.checked })}
                            className="mr-2"
                        />
                        <label htmlFor="includeExamples" className="text-sm">Include Practical Examples</label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="generateQuestions"
                            checked={!!localOptions.generateQuestions}
                            onChange={(e) => setLocalOptions({
                                ...localOptions,
                                generateQuestions: e.target.checked ? 3 : false
                            })}
                            className="mr-2"
                        />
                        <label htmlFor="generateQuestions" className="text-sm">Generate Study Questions</label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}