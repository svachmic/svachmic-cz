import * as React from "react";

const ReadingProgressBar = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") {
      return;
    }

    let rafId = null;

    const updateProgress = () => {
      // Calculate how far user has scrolled
      // Use fallbacks for older browsers (IE)
      const scrollTop =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollableHeight = docHeight - winHeight;

      if (scrollableHeight > 0) {
        const scrolled = (scrollTop / scrollableHeight) * 100;
        // Clamp between 0 and 100
        setProgress(Math.min(100, Math.max(0, scrolled)));
      } else {
        // If content is shorter than viewport, show as complete
        setProgress(100);
      }
    };

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Schedule update on next frame
      rafId = requestAnimationFrame(updateProgress);
    };

    // Initial calculation
    updateProgress();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Also update on resize (viewport size changes)
    window.addEventListener("resize", updateProgress, { passive: true });

    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="reading-progress-bar-container">
      <div
        className="reading-progress-bar"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Reading progress"
      />
    </div>
  );
};

export default ReadingProgressBar;
