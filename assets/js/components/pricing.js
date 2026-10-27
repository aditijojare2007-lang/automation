/**
 * Pricing Billing Toggle & Plan Selection
 */
const PRICING_DATA = {
  monthly: [
    { id: "starter", price: 29, period: "/month", billed: "billed monthly" },
    { id: "pro", price: 79, period: "/month", billed: "billed monthly" },
    { id: "enterprise", price: 199, period: "/month", billed: "billed monthly" }
  ],
  annual: [
    { id: "starter", price: 23, period: "/month", billed: "billed annually (save 20%)" },
    { id: "pro", price: 63, period: "/month", billed: "billed annually (save 20%)" },
    { id: "enterprise", price: 159, period: "/month", billed: "billed annually (save 20%)" }
  ]
};

export function initPricing() {
  const toggleTrack = document.getElementById("billing-toggle-track");
  const monthlyLabel = document.getElementById("label-monthly");
  const annualLabel = document.getElementById("label-annual");

  if (!toggleTrack) return;

  let currentCycle = "monthly";

  function setCycle(cycle) {
    currentCycle = cycle;
    const isAnnual = cycle === "annual";
    
    toggleTrack.classList.toggle("checked", isAnnual);
    toggleTrack.setAttribute("aria-checked", String(isAnnual));
    
    if (monthlyLabel && annualLabel) {
      monthlyLabel.classList.toggle("active", !isAnnual);
      annualLabel.classList.toggle("active", isAnnual);
    }

    const data = PRICING_DATA[cycle];
    data.forEach(item => {
      const priceElem = document.getElementById(`price-${item.id}`);
      const periodElem = document.getElementById(`period-${item.id}`);
      const billedElem = document.getElementById(`billed-${item.id}`);

      if (priceElem) {
        animateValue(priceElem, parseInt(priceElem.textContent), item.price, 300);
      }
      if (periodElem) periodElem.textContent = item.period;
      if (billedElem) billedElem.textContent = item.billed;
    });
  }

  toggleTrack.addEventListener("click", () => {
    setCycle(currentCycle === "monthly" ? "annual" : "monthly");
  });

  toggleTrack.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCycle(currentCycle === "monthly" ? "annual" : "monthly");
    }
  });

  if (monthlyLabel) {
    monthlyLabel.addEventListener("click", () => setCycle("monthly"));
  }
  if (annualLabel) {
    annualLabel.addEventListener("click", () => setCycle("annual"));
  }

  // Handle plan selection buttons
  document.querySelectorAll(".btn-select-plan").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const planName = btn.getAttribute("data-plan-name");
      const serviceSelect = document.getElementById("service-select");
      if (serviceSelect && planName) {
        serviceSelect.value = planName.toLowerCase();
      }
      window.openModal?.("demo-modal");
      window.showToast?.({
        title: "Plan Selected",
        message: `${planName} (${currentCycle}) selected. Complete the form to proceed.`,
        type: "success"
      });
    });
  });
}

function animateValue(elem, start, end, duration) {
  if (start === end || isNaN(start)) {
    elem.textContent = end;
    return;
  }
  const range = end - start;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(start + range * progress);
    elem.textContent = value;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      elem.textContent = end;
    }
  }

  requestAnimationFrame(step);
}
