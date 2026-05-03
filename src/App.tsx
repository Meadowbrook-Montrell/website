import { Route, Routes, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LandingPage } from "./pages/LandingPage";
import { GraffitiLandingPage } from "./pages/GraffitiLandingPage";
import { LibraryPage } from "./pages/LibraryPage";
import { GalleryPage } from "./pages/GalleryPage";
import { AdminPage } from "./pages/AdminPage";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={false}>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/v2" element={<GraffitiLandingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
