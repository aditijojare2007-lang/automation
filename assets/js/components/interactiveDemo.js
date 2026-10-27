/**
 * Live Interactive ROI & Latency Calculator
 */
export function initInteractiveDemo() {
  const reqSlider = document.getElementById("slider-requests");
  const latencySlider = document.getElementById("slider-latency");
  const agentsSlider = document.getElementById("slider-agents");

  const reqValueDisplay = document.getElementById("val-requests");
  const latencyValueDisplay = document.getElementById("val-latency");
  const agentsValueDisplay = document.getElementById("val-agents");

  const outSavings = document.getElementById("calc-savings");
  const outSpeedup = document.getElementById("calc-speedup");
  const outHours = document.getElementById("calc-hours");
  const copyReportBtn = document.getElementById("btn-copy-calc");

  if (!reqSlider || !outSavings) return;

  function recalculate() {
    const req = parseInt(reqSlider.value); // in thousands (100 -> 50000)
    const lat = parseInt(latencySlider.value); // in ms (10 -> 250)
    const agents = parseInt(agentsSlider.value); // (1 -> 25)

    // Format display labels
    reqValueDisplay.textContent = req >= 1000 ? `${(req / 1000).toFixed(1)}M` : `${req}k`;
    latencyValueDisplay.textContent = `${lat}ms`;
    agentsValueDisplay.textContent = `${agents} agents`;

    // Formula calculations
    // Base cloud cost estimate vs NovaPulse edge optimization
    const monthlySavings = Math.round((req * 0.42) + (agents * 180));
    const speedup = ((250 / Math.max(lat, 5)) * 1.4).toFixed(1);
    const hoursSaved = Math.round((agents * 36) + (req * 0.015));

    outSavings.textContent = `$${monthlySavings.toLocaleString()}`;
    outSpeedup.textContent = `${speedup}x`;
    outHours.textContent = `${hoursSaved.toLocaleString()} hrs`;
  }

  [reqSlider, latencySlider, agentsSlider].forEach(slider => {
    slider?.addEventListener("input", recalculate);
  });

  // Copy report summary to clipboard
  if (copyReportBtn) {
    copyReportBtn.addEventListener("click", async () => {
      const summaryText = `NovaPulse Performance Estimate:
- Workload: ${reqValueDisplay.textContent} requests/mo
- Latency Target: ${latencyValueDisplay.textContent}
- Autonomous Agents: ${agentsValueDisplay.textContent}
--------------------------------------
Estimated Monthly Savings: ${outSavings.textContent}
Speedup Factor: ${outSpeedup.textContent}
Engineering Hours Saved/Yr: ${outHours.textContent}`;

      try {
        await navigator.clipboard.writeText(summaryText);
        window.showToast?.({
          title: "Report Copied!",
          message: "Benchmark metrics saved to clipboard.",
          type: "success"
        });
      } catch (err) {
        // Fallback
        window.showToast?.({
          title: "Report Generated",
          message: `${outSavings.textContent}/mo estimated savings.`,
          type: "info"
        });
      }
    });
  }

  // Initial calculation
  recalculate();
}
