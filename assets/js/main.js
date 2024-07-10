
(function () {
  "use strict";

  /* Easy selector helper function */
  const select = (selector, all = false) => {
    let element = selector.trim();
    if (all) {
      return [...document.querySelectorAll(element)];
    } else {
      return document.querySelector(element);
    }
  }

  /* Easy event listener function */
  const onListen = (type, selector, listener, all = false) => {
    let elements = select(selector, all);
    if (elements) {
      if (all) {
        elements.forEach(elem => elem.addEventListener(type, listener));
      } else {
        elements.addEventListener(type, listener);
      }
    }
  }


  /* Easy on scroll event listener */
  const handleScroll = (element, callback) => {
    element.addEventListener('scroll', callback);
  }

  /* Navbar links active state on scroll */
  let navLinks = select('#navbar .scrollto', true);
  const updateNavLinksState = () => {
    let scrollPosition = window.scrollY + 200;
    navLinks.forEach(link => {
      if (!link.hash) return;
      let section = select(link.hash);
      if (!section) return;
      if (scrollPosition >= section.offsetTop && scrollPosition <= (section.offsetTop + section.offsetHeight)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', updateNavLinksState);
  handleScroll(document, updateNavLinksState);


  /* Scrolls to an element with header offset */
  const scrollToElement = (elem) => {
    let header = select('#header');
    let offset = header.offsetHeight;

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16;
    }

    let elementPosition = select(elem).offsetTop;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }

  /* Header fixed top on scroll */
  let headerElement = select('#header');

  if (headerElement) {
    let headerOffset = headerElement.offsetTop;
    let nextElement = headerElement.nextElementSibling;
    const fixHeaderOnScroll = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        headerElement.classList.add('fixed-top');
        nextElement.classList.add('scrolled-offset');
      } else {
        headerElement.classList.remove('fixed-top');
        nextElement.classList.remove('scrolled-offset');
      }
    }
    window.addEventListener('load', fixHeaderOnScroll);
    handleScroll(document, fixHeaderOnScroll);
  }

  /* Scroll to top button */
  let scrollToTopButton = select('.scroll-to-top');

  if (scrollToTopButton) {
    const toggleScrollToTopButton = () => {
      if (window.scrollY > 100) {
        scrollToTopButton.classList.add('active');
      } else {
        scrollToTopButton.classList.remove('active');
      }
    }
    window.addEventListener('load', toggleScrollToTopButton);
    handleScroll(document, toggleScrollToTopButton);
  }

  /* Mobile nav toggle */
  onListen('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /* Scroll with offset on links with a class name .scrollto */
  onListen('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault();

      let navbar = select('#navbar');
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollToElement(this.hash);
    }
  }, true);

  /* Scroll with offset on page load with hash links in the URL */
  window.addEventListener('load', () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollToElement(window.location.hash);
    }
  });

  /* Portfolio isotope and filter */
  document.addEventListener("DOMContentLoaded", function () {
    // Helper function to select elements
    function selectElement(selector, all = false) {
      selector = selector.trim();
      if (all) {
        return [...document.querySelectorAll(selector)];
      } else {
        return document.querySelector(selector);
      }
    }

    // Initialize Isotope for portfolio filtering
    let portfolioContainer = selectElement(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });

      // Filter items on button click
      let portfolioFilters = selectElement("#portfolio-filters li", true);
      portfolioFilters.forEach(function (button) {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          // Remove active class from all filters
          portfolioFilters.forEach(function (btn) {
            btn.classList.remove("filter-active");
          });
          // Add active class to the clicked filter
          this.classList.add("filter-active");

          // Arrange items based on the clicked filter
          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
        });
      });
    }
  });

})()