'use client'

export default function PageNavigation({ 
    currentPage, 
    onNext, 
    onPrevious 
}: { 
    currentPage: number, 
    onNext: () => void, 
    onPrevious: () => void 
}) {
    return (
        <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-xl border p-3 z-50 flex items-center gap-3">
            <button
                onClick={onPrevious}
                disabled={currentPage <= 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Previous Page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <div className="flex items-center gap-2 px-2">
                <span className="text-sm font-semibold text-gray-700">Page</span>
                <span className="text-lg font-bold text-blue-600">{currentPage}</span>
            </div>
            
            <button
                onClick={onNext}
                className="p-2 rounded hover:bg-gray-100 transition-all"
                title="Next Page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
