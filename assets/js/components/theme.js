/**
 * Theme Manager - Dark/Light mode switcher with persistence
 */
const STORAGE_KEY = "novapulse-theme";

export function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const storedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const currentTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme") || "light";
      const nextTheme = activeTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
      
      // Notify toast
      window.showToast?.({
        title: "Theme Changed",
        message: `Switched to ${nextTheme} mode`,
        type: "info"
      });
    });
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    const sunIcon = toggleBtn.querySelector(".icon-sun");
    const moonIcon = toggleBtn.querySelector(".icon-moon");
    if (sunIcon && moonIcon) {
      if (theme === "dark") {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
      } else {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
      }
    }
  }
}
