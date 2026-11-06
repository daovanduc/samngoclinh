// Enhanced Animate on Scroll (AOS) Implementation
document.documentElement.classList.add('js-enabled');

// ============================================
// iOS VIEWPORT HEIGHT FIX
// ============================================
function setVH() {
  // Set CSS custom property --vh to 1% of viewport height
  // This fixes the iOS Safari address bar issue
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set on load
setVH();

// Update on resize and orientation change
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
  setTimeout(setVH, 100); // Delay for iOS to settle
});

// ============================================
// PAGE PRELOADER
// ============================================
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  
  if (preloader) {
    // Hide preloader when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(() => {
          preloader.remove();
        }, 500);
      }, 500); // Small delay for smoother experience
    });
    
    // Fallback: hide preloader after 5 seconds even if page hasn't fully loaded
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
      }
    }, 5000);
  }
}

// Initialize preloader immediately
initPreloader();

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-aos-delay') || 0;
      
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, parseInt(delay));
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
  const aosElements = document.querySelectorAll('[data-aos]');
  
  aosElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
    
    if (isInViewport) {
      const delay = el.getAttribute('data-aos-delay') || 0;
      setTimeout(() => {
        el.classList.add('aos-animate');
      }, parseInt(delay));
    } else {
      observer.observe(el);
    }
  });
  
  // Re-check on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        aosElements.forEach(el => {
          if (!el.classList.contains('aos-animate')) {
            const rect = el.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            
            if (isInViewport) {
              const delay = el.getAttribute('data-aos-delay') || 0;
              setTimeout(() => {
                el.classList.add('aos-animate');
              }, parseInt(delay));
            }
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ============================================
  // STAGGERED ANIMATIONS FOR GRID ITEMS
  // ============================================
  initStaggeredAnimations();
  
  // ============================================
  // PARALLAX EFFECTS
  // ============================================
  initParallaxEffects();
  
  // ============================================
  // TEXT REVEAL ANIMATIONS
  // ============================================
  initTextRevealAnimations();
  
  // ============================================
  // FLOATING ANIMATIONS
  // ============================================
  initFloatingAnimations();
  
  // ============================================
  // COUNTER ANIMATIONS
  // ============================================
  initCounterAnimations();
  
  // ============================================
  // PRODUCT STORY IMAGE ENHANCEMENTS
  // ============================================
  initProductStoryImageEffects();
});

// ============================================
// STAGGERED ANIMATIONS FUNCTION
// ============================================
function initStaggeredAnimations() {
  const grids = document.querySelectorAll('.products-grid, .values-grid, .recipes-grid');
  
  grids.forEach(grid => {
    const items = grid.children;
    
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(items).forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate-in');
            }, index * 100);
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    gridObserver.observe(grid);
  });
}

// ============================================
// PARALLAX EFFECTS FUNCTION
// ============================================
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.hero, .product-story-image');
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateParallax() {
    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const scrolled = window.scrollY;
      const rate = 0.3;
      
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        if (el.classList.contains('hero')) {
          const heroContent = el.querySelector('.hero-content');
          if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * rate * 0.5}px)`;
          }
        }
        
        if (el.classList.contains('product-story-image')) {
          const img = el.querySelector('.product-story-img');
          if (img) {
            const yPos = (rect.top / window.innerHeight) * 20;
            img.style.transform = `scale(1.05) translateY(${yPos}px)`;
          }
        }
      }
    });
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// TEXT REVEAL ANIMATIONS FUNCTION
// ============================================
function initTextRevealAnimations() {
  const titles = document.querySelectorAll('.hero-title, .section-title');
  
  titles.forEach(title => {
    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('text-revealed');
          textObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    textObserver.observe(title);
  });
}

// ============================================
// FLOATING ANIMATIONS FUNCTION
// ============================================
function initFloatingAnimations() {
  const floatElements = document.querySelectorAll('.value-icon, .scroll-indicator');
  
  floatElements.forEach(el => {
    el.classList.add('float-animation');
  });
}

// ============================================
// COUNTER ANIMATIONS FUNCTION
// ============================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-counter'));
    const duration = 2000;
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(counter, target, duration);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counterObserver.observe(counter);
  });
}

function animateCounter(element, target, duration) {
  let start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(easeOutQuart * target);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  
  requestAnimationFrame(update);
}

// ============================================
// PRODUCT STORY IMAGE ENHANCEMENTS
// ============================================
function initProductStoryImageEffects() {
  const storyImages = document.querySelectorAll('.product-story-image');
  
  storyImages.forEach(imageContainer => {
    // Add corner accent (bottom-right)
    const cornerAccent = document.createElement('div');
    cornerAccent.className = 'corner-accent';
    imageContainer.appendChild(cornerAccent);
    
    // Add image overlay for gradient effect
    const imageOverlay = document.createElement('div');
    imageOverlay.className = 'image-overlay';
    imageContainer.appendChild(imageOverlay);
    
    // Add shine effect
    const shineEffect = document.createElement('div');
    shineEffect.className = 'shine-effect';
    imageContainer.appendChild(shineEffect);
    
    // Add reveal animation overlay
    const imageReveal = document.createElement('div');
    imageReveal.className = 'image-reveal';
    imageContainer.appendChild(imageReveal);
    
    // Add mouse move parallax effect
    imageContainer.addEventListener('mousemove', (e) => {
      const img = imageContainer.querySelector('.product-story-img');
      if (!img) return;
      
      const rect = imageContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Subtle parallax movement
      img.style.transform = `scale(1.08) translate(${x * 10}px, ${y * 10}px)`;
    });
    
    imageContainer.addEventListener('mouseleave', () => {
      const img = imageContainer.querySelector('.product-story-img');
      if (img) {
        img.style.transform = 'scale(1)';
      }
    });
  });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.getElementById('header');
const hero = document.querySelector('.hero');

if (header && hero) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-80px 0px 0px 0px'
  });

  heroObserver.observe(hero);

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 120) {
      header.classList.add('scrolled');
    } else if (currentScroll < 80) {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLeft = document.querySelector('.nav-left');
const navRight = document.querySelector('.nav-right');

if (mobileMenuToggle && navLeft && navRight && header) {
  let mobileNavContainer = document.querySelector('.mobile-nav-container');
  if (!mobileNavContainer) {
    mobileNavContainer = document.createElement('div');
    mobileNavContainer.className = 'mobile-nav-container';
    header.appendChild(mobileNavContainer);
    
    const combinedList = document.createElement('ul');
    combinedList.className = 'nav-list';
    
    const leftItems = navLeft.querySelectorAll('.nav-list li');
    leftItems.forEach(item => {
      combinedList.appendChild(item.cloneNode(true));
    });
    
    const rightItems = navRight.querySelectorAll('.nav-list li');
    rightItems.forEach(item => {
      combinedList.appendChild(item.cloneNode(true));
    });
    
    mobileNavContainer.appendChild(combinedList);
  }

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    mobileNavContainer.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  };

  mobileMenuToggle.addEventListener('click', toggleMenu);
  mobileMenuToggle.addEventListener('touchend', toggleMenu);

  const navLinks = mobileNavContainer.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavContainer.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    });
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
document.querySelectorAll('.product-story-btn, .btn').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  
  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'translate(0, 0)';
  });
});

// ============================================
// IMAGE LAZY LOADING WITH FADE IN
// ============================================
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('load', function() {
    this.classList.add('loaded');
  });
  
  if (img.complete) {
    img.classList.add('loaded');
  }
});

// ============================================
// CURSOR GLOW EFFECT (Optional - for desktop)
// ============================================
if (window.matchMedia('(pointer: fine)').matches) {
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);
  
  let cursorX = 0;
  let cursorY = 0;
  let glowX = 0;
  let glowY = 0;
  
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });
  
  function animateCursor() {
    glowX += (cursorX - glowX) * 0.1;
    glowY += (cursorY - glowY) * 0.1;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
}
