import { useState } from 'react';

const FAQSection = () => {
    // State for managing which FAQ is open
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How does Memora process my notes?",
            answer: "Memora uses advanced AI to analyze your uploaded materials, extracting key concepts, relationships, and important details. Our system identifies patterns and structures the information into digestible formats like summaries, flashcards, and study guides."
        },
        {
            question: "What file types does Memora support?",
            answer: "We support PDFs, DOCX, PPTX, images (JPG, PNG), and even handwritten notes through our OCR technology. The Pro plan adds support for audio recordings and video transcripts."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Absolutely! You can cancel your Memora subscription anytime through your account settings. Your access will continue until the end of your current billing period."
        },
        {
            question: "How does the free trial work?",
            answer: "The 14-day free trial gives you full access to all Pro features. No credit card is required to start. If you don't cancel before the trial ends, your subscription will automatically continue at the Pro plan rate."
        },
        {
            question: "Is my data secure with Memora?",
            answer: "Security is our top priority. All data is encrypted in transit and at rest. We never share your information with third parties, and you can delete your data permanently at any time."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about Memora
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-${index}`}
                            >
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {faq.question}
                                </h3>
                                <svg
                                    className={`h-5 w-5 text-indigo-600 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === index && (
                                <div id={`faq-${index}`} className="px-6 pb-6 pt-0">
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Additional Help */}
                <div className="mt-5 text-center">
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <a
                        href="/contact"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                        Contact Support
                        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;