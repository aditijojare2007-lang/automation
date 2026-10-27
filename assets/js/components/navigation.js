/**
 * Navigation, Mobile Drawer & Scrollspy Controller
 */
export function initNavigation() {
  const header = document.querySelector(".site-header");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const announcementBar = document.getElementById("announcement-bar");
  const announcementClose = document.getElementById("announcement-close");

  // Announcement bar dismiss
  if (announcementClose && announcementBar) {
    if (localStorage.getItem("novapulse-announcement-dismissed") === "true") {
      announcementBar.style.display = "none";
    }

    announcementClose.addEventListener("click", () => {
      announcementBar.style.display = "none";
      localStorage.setItem("novapulse-announcement-dismissed", "true");
    });
  }

  // Sticky header scroll detection
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("is-open");
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
      
      const menuIcon = mobileMenuBtn.querySelector(".icon-menu");
      const closeIcon = mobileMenuBtn.querySelector(".icon-close");
      if (menuIcon && closeIcon) {
        menuIcon.style.display = isOpen ? "none" : "block";
        closeIcon.style.display = isOpen ? "block" : "none";
      }
    });

    // Close mobile drawer when any link is clicked
    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("is-open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        const menuIcon = mobileMenuBtn.querySelector(".icon-menu");
        const closeIcon = mobileMenuBtn.querySelector(".icon-close");
        if (menuIcon && closeIcon) {
          menuIcon.style.display = "block";
          closeIcon.style.display = "none";
        }
      });
    });
  }

  // Scrollspy to highlight active nav link
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function onScrollSpy() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScrollSpy, { passive: true });
}
