'use client';

import { FiAlertTriangle, FiStar, FiCheck, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface LimitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LimitModal({ isOpen, onClose }: LimitModalProps) {
    const router = useRouter();

    const handleUpgrade = () => {
        onClose();
        router.push('/pricing');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                        <FiAlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Plan Limitations</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                You're currently on the <span className="font-semibold">Free Plan</span> which has these limitations:
                            </p>
                            <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                                <li>Maximum 10 messages per session</li>
                                <li>4 pages maximum per document upload</li>
                                <li>5MB maximum file size</li>
                                <li>Basic text analysis only</li>
                                <li>3 document uploads per day</li>
                                <li>No priority support</li>
                                <li>No API access</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3 text-center">Compare Plans</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Free</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-indigo-600 uppercase tracking-wider">Premium</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Messages per session</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">10</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-center">Unlimited</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Pages per document</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">4</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-center">100</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">File size limit</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">5MB</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-center">50MB</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Daily uploads</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">3</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-center">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Advanced analysis</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center"><FiX className="inline text-red-500" /></td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-center"><FiCheck className="inline text-green-500" /></td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Priority support</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center"><FiX className="inline text-red-500" /></td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-center"><FiCheck className="inline text-green-500" /></td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">API access</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center"><FiX className="inline text-red-500" /></td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-center"><FiCheck className="inline text-green-500" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
                    <div>
                        <h4 className="font-medium text-indigo-700">Ready to unlock full potential?</h4>
                        <p className="text-sm text-indigo-600">Upgrade to Premium for unlimited access</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Continue Free
                        </button>
                        <button
                            type="button"
                            onClick={handleUpgrade}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center shadow-lg"
                        >
                            <FiStar className="mr-2" />
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}