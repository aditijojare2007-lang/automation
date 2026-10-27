/**
 * Universal Modal Controller
 */
export function initModals() {
  // Listen for modal triggers
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-modal-target]");
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute("data-modal-target");
      openModal(modalId);
    }

    const closeBtn = e.target.closest("[data-modal-close]");
    if (closeBtn) {
      e.preventDefault();
      const modal = closeBtn.closest(".modal-backdrop");
      if (modal) {
        closeModal(modal.id);
      }
    }

    // Dismiss on backdrop click
    if (e.target.classList.contains("modal-backdrop")) {
      closeModal(e.target.id);
    }
  });

  // Global Escape key listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal-backdrop.is-active");
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });

  window.openModal = openModal;
  window.closeModal = closeModal;
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("is-active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus the first focusable input or close button
  setTimeout(() => {
    const focusable = modal.querySelector('input, select, textarea, button:not([data-modal-close])');
    if (focusable) focusable.focus();
  }, 100);
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("is-active");
  modal.setAttribute("aria-hidden", "true");
  
  // Restore scroll only if no other modals are active
  const anyActive = document.querySelector(".modal-backdrop.is-active");
  if (!anyActive) {
    document.body.style.overflow = "";
  }
}
