/**
 * Accordion Component & Live FAQ Filter
 */
import { faqsData } from "../data/faqsData.js";

export function initAccordion() {
  const faqListContainer = document.getElementById("faq-accordion-container");
  const searchInput = document.getElementById("faq-search-input");
  const faqEmptyState = document.getElementById("faq-empty-state");

  if (!faqListContainer) return;

  // Render FAQs
  renderFaqs(faqsData, faqListContainer);

  // Accordion click delegation
  faqListContainer.addEventListener("click", (e) => {
    const header = e.target.closest(".accordion-header");
    if (!header) return;

    const item = header.closest(".accordion-item");
    const content = item.querySelector(".accordion-content");
    const isExpanded = header.getAttribute("aria-expanded") === "true";

    // Close other items (exclusive accordion mode)
    faqListContainer.querySelectorAll(".accordion-item").forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
        otherItem.querySelector(".accordion-header")?.setAttribute("aria-expanded", "false");
        const otherContent = otherItem.querySelector(".accordion-content");
        if (otherContent) otherContent.style.maxHeight = null;
      }
    });

    if (isExpanded) {
      item.classList.remove("active");
      header.setAttribute("aria-expanded", "false");
      content.style.maxHeight = null;
    } else {
      item.classList.add("active");
      header.setAttribute("aria-expanded", "true");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });

  // Live FAQ Search filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = faqsData.filter(faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
      );

      renderFaqs(filtered, faqListContainer);

      if (faqEmptyState) {
        faqEmptyState.style.display = filtered.length === 0 ? "block" : "none";
      }
    });
  }
}

function renderFaqs(items, container) {
  container.innerHTML = items.map((faq, index) => `
    <div class="accordion-item" data-faq-id="${faq.id}">
      <button class="accordion-header" id="faq-head-${faq.id}" aria-expanded="false" aria-controls="faq-body-${faq.id}">
        <span>${faq.question}</span>
        <svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="accordion-content" id="faq-body-${faq.id}" role="region" aria-labelledby="faq-head-${faq.id}">
        <p>${faq.answer}</p>
      </div>
    </div>
  `).join("");
}
