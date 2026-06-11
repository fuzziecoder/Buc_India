import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SmoothScroll from "./components/animations/SmoothScroll.jsx";
import Preloader from "./components/animations/Preloader.jsx";

// Lazy load registration routes
const MainRegistration = lazy(() => import("./components/MainRegistration.jsx"));

const Loading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-12 h-12 border-4 border-copper/20 border-t-copper rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <SmoothScroll>
        <AnimatePresence>
          {isLoading && (
            <Preloader 
              key="preloader" 
              onComplete={() => setIsLoading(false)} 
            />
          )}
        </AnimatePresence>

        <motion.div 
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
          className="origin-center"
        >
          <ScrollToTop />
          <div className="min-h-screen bg-carbon">
            <ToastContainer position="top-center" autoClose={3000} theme="dark" />
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Registration routes */}
                <Route path="/register/:slug" element={<MainRegistration />} />

                {/* Redirect rules to land only on registration page */}
                <Route path="/register" element={<Navigate to="/register/june-21-event" replace />} />
                <Route path="/" element={<Navigate to="/register/june-21-event" replace />} />
                <Route path="*" element={<Navigate to="/register/june-21-event" replace />} />
              </Routes>
            </Suspense>
          </div>
        </motion.div>
      </SmoothScroll>
    </Router>
  );
}

export default App;
