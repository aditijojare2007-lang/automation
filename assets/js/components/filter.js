/**
 * Feature Category Tabs & Detail Modal
 */
import { featuresData } from "../data/featuresData.js";

export function initFeaturesFilter() {
  const container = document.getElementById("features-grid");
  const tabButtons = document.querySelectorAll(".feature-tab-btn");

  if (!container) return;

  function render(category = "all") {
    const list = category === "all" 
      ? featuresData 
      : featuresData.filter(item => item.category === category);

    container.innerHTML = list.map(item => `
      <div class="card card-interactive feature-card animate-fade-in" data-feature-id="${item.id}">
        <div class="feature-icon-box">${item.icon}</div>
        <h3 class="feature-title">${item.title}</h3>
        <p class="feature-desc">${item.description}</p>
        <button class="feature-link btn-feature-detail" data-id="${item.id}">
          Learn more
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    `).join("");

    // Attach listeners for modal details
    container.querySelectorAll(".btn-feature-detail").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const feature = featuresData.find(f => f.id === id);
        if (feature) {
          showFeatureModal(feature);
        }
      });
    });
  }

  // Initial render
  render("all");

  // Tab button click
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-category");
      render(category);
    });
  });
}

function showFeatureModal(feature) {
  const titleElem = document.getElementById("feature-modal-title");
  const bodyElem = document.getElementById("feature-modal-body");
  const iconElem = document.getElementById("feature-modal-icon");

  if (titleElem) titleElem.textContent = feature.title;
  if (bodyElem) {
    bodyElem.innerHTML = `
      <p style="margin-bottom: var(--space-4); font-size: var(--font-size-base); color: var(--text-primary); font-weight: var(--font-weight-medium);">${feature.description}</p>
      <div style="padding: var(--space-4); background: var(--bg-tertiary); border-radius: var(--radius-md); border-left: 4px solid var(--brand-primary);">
        <h4 style="font-size: var(--font-size-sm); margin-bottom: var(--space-2); color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.05em;">Architecture Details</h4>
        <p style="font-size: var(--font-size-sm);">${feature.details}</p>
      </div>
    `;
  }
  if (iconElem) iconElem.innerHTML = feature.icon;

  window.openModal?.("feature-modal");
}
