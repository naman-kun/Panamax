/**
 * shadcn/ui Design System & Component Catalog Interactive Logic
 */
document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Theme Toggle (Light / Dark)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('shadcn-theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', nextTheme);
    localStorage.setItem('shadcn-theme', nextTheme);
  });

  // --------------------------------------------------------------------------
  // 2. Sidebar Search Filter & ScrollSpy
  // --------------------------------------------------------------------------
  const filterInput = document.getElementById('component-filter');
  const cards = document.querySelectorAll('.component-showcase-card');
  const navItems = document.querySelectorAll('.sidebar-nav-item');

  filterInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    cards.forEach(card => {
      const title = card.querySelector('.figma-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.figma-description')?.textContent.toLowerCase() || '';
      const matches = title.includes(query) || desc.includes(query);
      card.style.display = matches ? 'flex' : 'none';
    });

    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'block' : 'none';
    });
  });

  // ScrollSpy for Sidebar Active State
  window.addEventListener('scroll', () => {
    let currentId = '';
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentId = card.id;
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link?.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 3. Code Snippet Copy-to-Clipboard
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-code-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      const codeElement = document.getElementById(targetId);
      if (!codeElement) return;

      try {
        await navigator.clipboard.writeText(codeElement.textContent || '');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Copied!
        `;
        btn.style.color = '#10b981';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Tabs Interaction
  // --------------------------------------------------------------------------
  const tabAccount = document.getElementById('tab-account');
  const tabPassword = document.getElementById('tab-password');
  const panelAccount = document.getElementById('panel-account');
  const panelPassword = document.getElementById('panel-password');

  tabAccount?.addEventListener('click', () => {
    tabAccount.classList.add('is-active');
    tabAccount.setAttribute('aria-selected', 'true');
    tabPassword.classList.remove('is-active');
    tabPassword.setAttribute('aria-selected', 'false');
    panelAccount.classList.add('is-active');
    panelPassword.classList.remove('is-active');
  });

  tabPassword?.addEventListener('click', () => {
    tabPassword.classList.add('is-active');
    tabPassword.setAttribute('aria-selected', 'true');
    tabAccount.classList.remove('is-active');
    tabAccount.setAttribute('aria-selected', 'false');
    panelPassword.classList.add('is-active');
    panelAccount.classList.remove('is-active');
  });

  document.getElementById('save-account-btn')?.addEventListener('click', () => {
    alert('Account changes saved successfully!');
  });
  document.getElementById('save-pass-btn')?.addEventListener('click', () => {
    alert('Password updated successfully!');
  });

  // --------------------------------------------------------------------------
  // 5. Switch Interaction
  // --------------------------------------------------------------------------
  const switchWrapper = document.getElementById('switch-wrapper');
  const switchTrack = document.getElementById('switch-track');
  const switchFeedback = document.getElementById('switch-feedback');

  const toggleSwitch = () => {
    const isChecked = switchTrack.classList.toggle('is-checked');
    switchTrack.setAttribute('aria-checked', isChecked ? 'true' : 'false');
    if (switchFeedback) {
      switchFeedback.textContent = isChecked ? 'State: On (Enabled)' : 'State: Off';
      switchFeedback.style.color = isChecked ? '#0284c7' : '';
    }
  };

  switchTrack?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSwitch();
  });
  switchWrapper?.addEventListener('click', toggleSwitch);

  // --------------------------------------------------------------------------
  // 6. Slider Interaction (Click & Drag)
  // --------------------------------------------------------------------------
  const sliderRoot = document.getElementById('slider-root');
  const sliderRange = document.getElementById('slider-range');
  const sliderThumb = document.getElementById('slider-thumb');
  const sliderVal = document.getElementById('slider-val');

  if (sliderRoot && sliderRange && sliderThumb && sliderVal) {
    let isDragging = false;

    const updateSlider = (clientX) => {
      const rect = sliderRoot.getBoundingClientRect();
      const rawPct = (clientX - rect.left) / rect.width;
      const pct = Math.max(0, Math.min(100, Math.round(rawPct * 100)));

      sliderRange.style.width = `${pct}%`;
      sliderThumb.style.left = `${pct}%`;
      sliderVal.textContent = pct;
      sliderRoot.setAttribute('aria-valuenow', pct);
    };

    sliderRoot.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        updateSlider(e.clientX);
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    sliderRoot.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
      }
    });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        updateSlider(e.touches[0].clientX);
      }
    });
    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // --------------------------------------------------------------------------
  // 7. Popover Interaction
  // --------------------------------------------------------------------------
  const popoverTrigger = document.getElementById('popover-trigger');
  const popoverCard = document.getElementById('popover-card');

  popoverTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = popoverCard.classList.toggle('is-visible');
    popoverTrigger.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (popoverCard?.classList.contains('is-visible') && !popoverCard.contains(e.target)) {
      popoverCard.classList.remove('is-visible');
      popoverTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  // --------------------------------------------------------------------------
  // 8. Hover Card Interaction
  // --------------------------------------------------------------------------
  const hoverTrigger = document.getElementById('hover-card-trigger-2');
  const hoverPanel = document.getElementById('hover-card-panel-2');

  if (hoverTrigger && hoverPanel) {
    let hoverOpenTimer = null;
    let hoverCloseTimer = null;

    const openHover = () => {
      clearTimeout(hoverCloseTimer);
      hoverOpenTimer = setTimeout(() => {
        hoverPanel.classList.add('is-open');
        hoverPanel.setAttribute('aria-hidden', 'false');
        hoverTrigger.setAttribute('aria-expanded', 'true');
      }, 250);
    };

    const closeHover = () => {
      clearTimeout(hoverOpenTimer);
      hoverCloseTimer = setTimeout(() => {
        hoverPanel.classList.remove('is-open');
        hoverPanel.setAttribute('aria-hidden', 'true');
        hoverTrigger.setAttribute('aria-expanded', 'false');
      }, 200);
    };

    hoverTrigger.addEventListener('mouseenter', openHover);
    hoverTrigger.addEventListener('mouseleave', closeHover);

    hoverPanel.addEventListener('mouseenter', () => clearTimeout(hoverCloseTimer));
    hoverPanel.addEventListener('mouseleave', closeHover);

    hoverTrigger.addEventListener('focus', openHover);
    hoverTrigger.addEventListener('blur', closeHover);
  }

});
