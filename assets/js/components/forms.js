/**
 * Form Validation, LocalStorage Inquiries & Global Search
 */
import { featuresData } from "../data/featuresData.js";
import { faqsData } from "../data/faqsData.js";

const INQUIRIES_STORAGE_KEY = "novapulse-inquiries";
const NEWSLETTER_STORAGE_KEY = "novapulse-newsletter";

export function initForms() {
  initContactForm();
  initDemoModalForm();
  initNewsletterForm();
  initGlobalSearch();
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const msgInput = document.getElementById("contact-message");
  const charCounter = document.getElementById("message-char-count");

  if (!form) return;

  // Live character counter
  if (msgInput && charCounter) {
    msgInput.addEventListener("input", () => {
      charCounter.textContent = `${msgInput.value.length} / 500`;
    });
  }

  // Real-time error removal on input
  form.querySelectorAll("input, textarea, select").forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const serviceInput = document.getElementById("contact-service");
    const messageInput = document.getElementById("contact-message");

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate Service
    if (!serviceInput.value) {
      serviceInput.classList.add("is-invalid");
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.classList.add("is-invalid");
      isValid = false;
    }

    if (!isValid) {
      window.showToast?.({
        title: "Validation Error",
        message: "Please review and complete all required fields correctly.",
        type: "error"
      });
      return;
    }

    // Save inquiry to localStorage
    const inquiry = {
      id: Date.now(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      service: serviceInput.value,
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    saveInquiry(inquiry);

    // Provide immediate user feedback
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="animate-spin" style="display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;"></span> Sending...`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      if (charCounter) charCounter.textContent = "0 / 500";

      window.showToast?.({
        title: "Message Sent Successfully!",
        message: `Thank you, ${inquiry.name}. We will respond to ${inquiry.email} within 24 hours.`,
        type: "success",
        duration: 5000
      });
    }, 600);
  });
}

function initDemoModalForm() {
  const form = document.getElementById("modal-demo-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("modal-name");
    const emailInput = document.getElementById("modal-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;
    if (!nameInput.value.trim()) {
      nameInput.classList.add("is-invalid");
      valid = false;
    }
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add("is-invalid");
      valid = false;
    }

    if (!valid) {
      window.showToast?.({
        title: "Invalid Input",
        message: "Please enter your name and a valid corporate email.",
        type: "error"
      });
      return;
    }

    window.closeModal?.("demo-modal");
    window.showToast?.({
      title: "Demo Reserved!",
      message: `An invitation has been scheduled for ${emailInput.value.trim()}.`,
      type: "success",
      duration: 5000
    });
    form.reset();
  });
}

function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletter-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailInput.value.trim();

    if (!emailRegex.test(email)) {
      window.showToast?.({
        title: "Invalid Email",
        message: "Please provide a valid email address.",
        type: "error"
      });
      return;
    }

    // Persist newsletter subscriber
    const existing = JSON.parse(localStorage.getItem(NEWSLETTER_STORAGE_KEY) || "[]");
    if (existing.includes(email)) {
      window.showToast?.({
        title: "Already Subscribed",
        message: "You are already on our developer updates list!",
        type: "info"
      });
      return;
    }

    existing.push(email);
    localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(existing));

    form.reset();
    window.showToast?.({
      title: "Subscribed Successfully!",
      message: `Welcome aboard! Future updates will be sent to ${email}.`,
      type: "success"
    });
  });
}

function saveInquiry(inquiry) {
  const existing = JSON.parse(localStorage.getItem(INQUIRIES_STORAGE_KEY) || "[]");
  existing.push(inquiry);
  localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(existing));
}

function initGlobalSearch() {
  const searchInput = document.getElementById("global-search-input");
  const searchResults = document.getElementById("search-results-list");

  // Global Ctrl+K / Cmd+K listener
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      window.openModal?.("search-modal");
      setTimeout(() => searchInput?.focus(), 150);
    }
  });

  if (!searchInput || !searchResults) return;

  const searchableIndex = [
    { title: "Home / Hero", desc: "Autonomous AI Platform & Edge Suite", url: "#hero", category: "Section" },
    { title: "Live ROI Calculator", desc: "Interactive latency and cloud cost simulator", url: "#calculator", category: "Tool" },
    { title: "Core Features", desc: "Explore agent orchestration, edge runtime, telemetry", url: "#features", category: "Section" },
    { title: "Pricing & Plans", desc: "Starter, Pro, and Enterprise monthly & annual billing", url: "#pricing", category: "Section" },
    { title: "Client Testimonials", desc: "Enterprise case studies and reviews", url: "#testimonials", category: "Section" },
    { title: "Frequently Asked Questions", desc: "Architecture, customization, deployment FAQs", url: "#faqs", category: "Help" },
    { title: "Contact & Consultation", desc: "Get in touch with enterprise solutions architects", url: "#contact", category: "Contact" }
  ];

  // Also index all features and FAQs
  featuresData.forEach(f => {
    searchableIndex.push({
      title: f.title,
      desc: f.description,
      url: "#features",
      category: "Feature"
    });
  });

  faqsData.forEach(faq => {
    searchableIndex.push({
      title: faq.question,
      desc: faq.answer.substring(0, 70) + "...",
      url: "#faqs",
      category: "FAQ"
    });
  });

  function renderResults(query = "") {
    const q = query.toLowerCase().trim();
    const matches = q === "" 
      ? searchableIndex.slice(0, 5) 
      : searchableIndex.filter(item => 
          item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
        ).slice(0, 8);

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div style="padding: var(--space-8); text-align: center; color: var(--text-muted);">
          No results found for "<strong>${escapeHTML(query)}</strong>"
        </div>
      `;
      return;
    }

    searchResults.innerHTML = matches.map(item => `
      <a href="${item.url}" class="search-result-item" style="display: block; padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); border-bottom: 1px solid var(--border-subtle); text-decoration: none; transition: background var(--transition-fast);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <strong style="color: var(--text-primary); font-size: var(--font-size-sm);">${item.title}</strong>
          <span class="badge badge-primary" style="font-size: 10px;">${item.category}</span>
        </div>
        <div style="color: var(--text-muted); font-size: var(--font-size-xs);">${item.desc}</div>
      </a>
    `).join("");

    searchResults.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        window.closeModal?.("search-modal");
      });
      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "var(--bg-tertiary)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "";
      });
    });
  }

  searchInput.addEventListener("input", (e) => {
    renderResults(e.target.value);
  });

  // Initial populate
  renderResults("");
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
