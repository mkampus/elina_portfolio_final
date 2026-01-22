import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './hooks/useModalState';
import './styles/globals.css';

const InFront = lazy(() => import('./pages/InFront'));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <div className="w-12 h-12 border-2 border-border-color border-t-accent-front rounded-full animate-spin mx-auto mb-4"></div>
            <p className="typography-caption">Laeb...</p>
        </div>
    </div>
);

function App() {
    return (
        <ModalProvider>
            <Router
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<InFront />} />
                    </Routes>
                </Suspense>
            </Router>
        </ModalProvider>
    );
}

export default App;