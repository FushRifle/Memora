'use client';

import { FiX, FiDownload } from 'react-icons/fi';

export default function FilePreviewModal({
    file,
    onClose
}: {
    file: { url: string, type: string } | null;
    onClose: () => void;
}) {
    if (!file) return null;

    const renderPreview = () => {
        if (file.type.startsWith('image/')) {
            return <img src={file.url} alt="Preview" className="max-h-[80vh] max-w-full" />;
        } else if (file.type === 'application/pdf') {
            return (
                <iframe
                    src={file.url}
                    className="w-full h-[80vh]"
                    title="PDF Preview"
                />
            );
        }
        return <div className="p-4">Preview not available for this file type</div>;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center border-b px-4 py-2">
                    <h3 className="text-lg font-medium">File Preview</h3>
                    <div className="flex space-x-2">
                        <a
                            href={file.url}
                            download
                            className="p-1 text-gray-500 hover:text-indigo-600"
                            title="Download"
                        >
                            <FiDownload className="h-5 w-5" />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-500 hover:text-gray-700"
                            title="Close"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-auto p-4 flex-1 flex items-center justify-center">
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
}