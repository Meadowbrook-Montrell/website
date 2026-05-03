import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GraffitiLandingPage } from "./pages/GraffitiLandingPage";
import { LibraryPage } from "./pages/LibraryPage";
import { GalleryPage } from "./pages/GalleryPage";
import { AdminPage } from "./pages/AdminPage";
import { AdminGate } from "./components/AdminGate";
import { BookingPage } from "./pages/BookingPage";
import { MediaKitPage } from "./pages/MediaKitPage";
import { LinkBioPage } from "./pages/LinkBioPage";
import { CommunityPage } from "./pages/CommunityPage";
import { BlogPage } from "./pages/BlogPage";
import { EventsPage } from "./pages/EventsPage";
import { SearchPage } from "./pages/SearchPage";
import { EpisodePage } from "./pages/EpisodePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import PodcastPage from "./pages/PodcastPage";
import FanQAPage from "./pages/FanQAPage";
import ShopPage from "./pages/ShopPage";
import LeaderboardPage from "./pages/LeaderboardPage";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={true}>
        <Toaster />
        <Routes>
          <Route path="/" element={<GraffitiLandingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/episode/:id" element={<EpisodePage />} />
          <Route path="/admin" element={<AdminGate><AdminPage /></AdminGate>} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/media-kit" element={<MediaKitPage />} />
          <Route path="/link" element={<LinkBioPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/qa" element={<FanQAPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
