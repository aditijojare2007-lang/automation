/**
 * Toast Notification Manager
 */
let toastContainer = null;

export function initToast() {
  toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    document.body.appendChild(toastContainer);
  }

  // Register globally for convenient call
  window.showToast = showToast;
}

export function showToast({ title = "Notification", message = "", type = "info", duration = 4000 }) {
  if (!toastContainer) initToast();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");

  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  } else {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHTML(title)}</div>
      ${message ? `<div class="toast-message">${escapeHTML(message)}</div>` : ""}
    </div>
    <button class="toast-close-btn" aria-label="Dismiss alert">&times;</button>
  `;

  const closeBtn = toast.querySelector(".toast-close-btn");
  closeBtn.addEventListener("click", () => dismissToast(toast));

  toastContainer.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(toast);
    }, duration);
  }

  return toast;
}

function dismissToast(toast) {
  if (!toast || toast.classList.contains("hiding")) return;
  toast.classList.add("hiding");
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, 250);
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
