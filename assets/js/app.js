/**
 * NovaPulse Main Application Bootstrap
 */
import { initTheme } from "./components/theme.js";
import { initToast } from "./components/toast.js";
import { initModals } from "./components/modal.js";
import { initNavigation } from "./components/navigation.js";
import { initPricing } from "./components/pricing.js";
import { initAccordion } from "./components/accordion.js";
import { initFeaturesFilter } from "./components/filter.js";
import { initInteractiveDemo } from "./components/interactiveDemo.js";
import { initForms } from "./components/forms.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Toast first so other components can emit notifications
  initToast();

  // Initialize Core System Modules
  initTheme();
  initModals();
  initNavigation();
  initPricing();
  initAccordion();
  initFeaturesFilter();
  initInteractiveDemo();
  initForms();

  // Legal modal triggers
  initLegalModals();

  // Simulated live edge status latency indicator
  initEdgeStatusIndicator();

  console.log("⚡ NovaPulse Modern Web Platform loaded successfully.");
});

function initLegalModals() {
  const btnPrivacy = document.getElementById("btn-privacy-policy");
  const btnTerms = document.getElementById("btn-terms-service");
  const titleElem = document.getElementById("legal-modal-title");
  const bodyElem = document.getElementById("legal-modal-body");

  if (btnPrivacy) {
    btnPrivacy.addEventListener("click", () => {
      if (titleElem) titleElem.textContent = "Privacy Policy";
      if (bodyElem) {
        bodyElem.innerHTML = `
          <p style="margin-bottom: var(--space-4);">At NovaPulse, we take data privacy and intellectual property with extreme diligence. We operate under zero-knowledge and SOC2 Type II principles.</p>
          <h4 style="margin-bottom: var(--space-2); font-size: var(--font-size-sm); color: var(--text-primary);">Data Collection</h4>
          <p style="margin-bottom: var(--space-4); font-size: var(--font-size-sm); color: var(--text-secondary);">We only store necessary metadata required to provide edge routing and session persistence. We never train public foundation models on your proprietary prompt or database payload data.</p>
          <h4 style="margin-bottom: var(--space-2); font-size: var(--font-size-sm); color: var(--text-primary);">Your Rights</h4>
          <p style="font-size: var(--font-size-sm); color: var(--text-secondary);">You hold unrestricted rights to export, redact, or permanently purge all stored customer inquiries and telemetry at any time.</p>
        `;
      }
      window.openModal?.("legal-modal");
    });
  }

  if (btnTerms) {
    btnTerms.addEventListener("click", () => {
      if (titleElem) titleElem.textContent = "Terms of Service";
      if (bodyElem) {
        bodyElem.innerHTML = `
          <p style="margin-bottom: var(--space-4);">Welcome to NovaPulse. By utilizing our autonomous edge and web platform, you agree to these standard terms.</p>
          <h4 style="margin-bottom: var(--space-2); font-size: var(--font-size-sm); color: var(--text-primary);">Service Availability & SLA</h4>
          <p style="margin-bottom: var(--space-4); font-size: var(--font-size-sm); color: var(--text-secondary);">We maintain a 99.99% monthly uptime SLA across our distributed edge points of presence.</p>
          <h4 style="margin-bottom: var(--space-2); font-size: var(--font-size-sm); color: var(--text-primary);">Permitted Use</h4>
          <p style="font-size: var(--font-size-sm); color: var(--text-secondary);">Services must be utilized in compliance with all relevant security guidelines, data protection regulations, and acceptable use policies.</p>
        `;
      }
      window.openModal?.("legal-modal");
    });
  }
}

function initEdgeStatusIndicator() {
  const latencyBadge = document.getElementById("edge-latency-badge");
  if (!latencyBadge) return;

  setInterval(() => {
    // Subtle realistic fluctuation between 12ms and 16ms
    const randomMs = Math.floor(Math.random() * 5) + 12;
    latencyBadge.textContent = `${randomMs}ms avg`;
  }, 4000);
}
