'use client';

import { FiX, FiDownload } from 'react-icons/fi';

export default function FilePreviewModal({
    file,
    onClose,
}: {
    file: { url: string; type: string } | null;
    onClose: () => void;
}) {
    if (!file) return null;

    const renderPreview = () => {
        if (file.type.startsWith('image/')) {
            return (
                <img
                    src={file.url}
                    alt="Preview"
                    className="max-h-[75vh] max-w-full rounded-lg object-contain transition duration-300"
                />
            );
        } else if (file.type === 'application/pdf') {
            return (
                <iframe
                    src={file.url}
                    className="w-full h-[75vh] rounded-md border"
                    title="PDF Preview"
                />
            );
        }
        return (
            <div className="text-gray-600 text-center text-sm">
                Preview not available for this file type.
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">File Preview</h3>
                    <div className="flex items-center gap-3">
                        <a
                            href={file.url}
                            download
                            title="Download"
                            className="text-gray-500 hover:text-indigo-600 transition"
                        >
                            <FiDownload className="h-5 w-5" />
                        </a>
                        <button
                            onClick={onClose}
                            title="Close"
                            className="text-gray-500 hover:text-red-500 transition"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 overflow-auto bg-white flex items-center justify-center">
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
}
