import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { ModalProvider } from './hooks/useModalState';
import InFront from './pages/InFront';
import ProjectPage from './pages/ProjectPage';
import './styles/globals.css';

const NotFound = () => (
    <main className="min-h-screen bg-white px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-light uppercase tracking-tight">Page not found</h1>
            <p className="mt-4 text-sm text-gray-700">The page URL does not exist.</p>
            <Link
                to="/"
                className="mt-8 inline-block border border-black px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
            >
                Back to homepage
            </Link>
        </div>
    </main>
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
                <Routes>
                    <Route path="/" element={<InFront />} />
                    <Route path="/:categorySlug/:projectSlug" element={<ProjectPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </ModalProvider>
    );
}

export default App;
