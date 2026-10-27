/**
 * LEGION RISERS x NEXURE STUDIOS
 * iOS Style Full Glass E-Commerce Experience
 * Craftsmanship • Micro-Interactions • Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // COLOR SYSTEM & ASSETS
  // ---------------------------------------------------------------------------
  const colorData = {
    black: {
      name: 'Onyx Black',
      img: 'assets/shirt_black.png',
      desc: 'Midnight depth with contrast sterling white eagle crest.',
      themeHex: '#151516'
    },
    red: {
      name: 'Crimson Red',
      img: 'assets/shirt_red.png',
      desc: 'Rich cardinal scarlet with bold presence and white crest.',
      themeHex: '#cd202d'
    },
    blue: {
      name: 'Pacific Blue',
      img: 'assets/shirt_blue.png',
      desc: 'Regal oxford navy with tailored elegance and white crest.',
      themeHex: '#1858cd'
    },
    green: {
      name: 'Alpine Green',
      img: 'assets/shirt_green.png',
      desc: 'Subtle forest moss tone with relaxed contemporary drape.',
      themeHex: '#1a8748'
    },
    white: {
      name: 'Chalk White',
      img: 'assets/shirt_white.png',
      desc: 'Pristine alabaster cotton with stealth onyx black eagle crest.',
      themeHex: '#fbfbfd'
    }
  };

  let currentColor = 'black';
  let currentSize = 'L';

  // ---------------------------------------------------------------------------
  // PHOTOREALISTIC CLOTH UNFOLDING ENGINE (HTML5 Canvas 60fps)
  // ---------------------------------------------------------------------------
  const introOverlay = document.getElementById('introOverlay');
  const introSkipBtn = document.getElementById('introSkipBtn');
  const unfoldCanvas = document.getElementById('unfoldCanvas');
  const unfoldCanvasShadow = document.getElementById('unfoldCanvasShadow');
  const introProgressFill = document.getElementById('introProgressFill');
  const introLoadingText = document.getElementById('introLoadingText');

  function initOpeningUnfolding() {
    if (!introOverlay || !unfoldCanvas) return;

    const ctx = unfoldCanvas.getContext('2d');
    const TOTAL_FRAMES = 42;
    const DURATION = 2400; // 2.4 seconds

    const frames = [];
    let isDismissed = false;
    let animId = null;

    // Preload all 42 photorealistic simulation frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(2, '0');
      img.src = `assets/unfold_frames/frame_${num}.png`;
      img.onload = () => {
        if (i === 0 && !isDismissed) {
          drawFrame(0);
        }
      };
      frames.push(img);
    }

    function drawFrame(idx) {
      const img = frames[idx];
      if (!img || !img.complete) return;
      ctx.clearRect(0, 0, unfoldCanvas.width, unfoldCanvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, unfoldCanvas.width, unfoldCanvas.height);

      // Update dynamic ground shadow based on progress
      const progress = idx / (TOTAL_FRAMES - 1);
      if (unfoldCanvasShadow) {
        const shadowWidth = Math.round(160 + progress * 130);
        const shadowOpacity = 0.32 - progress * 0.14;
        unfoldCanvasShadow.style.width = `${shadowWidth}px`;
        unfoldCanvasShadow.style.opacity = `${shadowOpacity}`;
      }

      // Update progress bar
      if (introProgressFill) {
        introProgressFill.style.width = `${Math.round(progress * 100)}%`;
      }
      if (introLoadingText) {
        if (progress < 0.4) {
          introLoadingText.textContent = 'UNROLLING HEAVYWEIGHT TERRY';
        } else if (progress < 0.8) {
          introLoadingText.textContent = 'UNFURLING DROP SHOULDERS';
        } else {
          introLoadingText.textContent = 'ARCHIVE POLO UNVEILED';
        }
      }
    }

    let startTime = null;

    function render(timestamp) {
      if (isDismissed) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(1, elapsed / DURATION);

      const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(t * (TOTAL_FRAMES - 1)));
      drawFrame(frameIdx);

      if (t < 1) {
        animId = requestAnimationFrame(render);
      } else {
        setTimeout(dismissIntro, 200);
      }
    }

    animId = requestAnimationFrame(render);

    function dismissIntro() {
      if (isDismissed) return;
      isDismissed = true;
      if (animId) cancelAnimationFrame(animId);

      drawFrame(TOTAL_FRAMES - 1);

      introOverlay.classList.add('intro-dismissed');
      setTimeout(() => {
        introOverlay.style.display = 'none';
      }, 550);
    }

    if (introSkipBtn) {
      introSkipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissIntro();
      });
    }

    introOverlay.addEventListener('click', (e) => {
      if (e.target.closest('.intro-skip-btn')) return;
      dismissIntro();
    });

    const replayIntroBtn = document.getElementById('replayIntroBtn');
    if (replayIntroBtn) {
      replayIntroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isDismissed = false;
        startTime = null;
        introOverlay.style.display = 'flex';
        introOverlay.classList.remove('intro-dismissed');
        drawFrame(0);
        animId = requestAnimationFrame(render);
      });
    }
  }

  initOpeningUnfolding();

  // ---------------------------------------------------------------------------
  // COLOR SWITCHER LOGIC
  // ---------------------------------------------------------------------------
  const heroShirtImg = document.getElementById('heroShirtImg');
  const selectedColorName = document.getElementById('selectedColorName');
  const swatchButtons = document.querySelectorAll('.color-swatch-btn');
  const dockDots = document.querySelectorAll('.dock-color-dot');
  const stickyLensImg = document.getElementById('stickyLensImg');
  const sheetThumb = document.getElementById('sheetThumb');
  const sheetConfig = document.getElementById('sheetConfig');

  function updateColor(colorKey) {
    if (!colorData[colorKey]) return;
    currentColor = colorKey;
    const info = colorData[colorKey];

    // Update active states
    swatchButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === colorKey);
    });

    // Update color label
    if (selectedColorName) {
      selectedColorName.textContent = info.name;
    }

    // Smooth image transition with opacity bounce
    if (heroShirtImg) {
      heroShirtImg.style.opacity = '0.4';
      heroShirtImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        heroShirtImg.src = info.img;
        heroShirtImg.style.opacity = '1';
        heroShirtImg.style.transform = 'scale(1)';
      }, 120);
    }

    // Update sticky showcase if on 'front' lens
    if (stickyLensImg && currentCameraMode === 'front') {
      stickyLensImg.style.opacity = '0.4';
      setTimeout(() => {
        stickyLensImg.src = info.img;
        stickyLensImg.style.opacity = '1';
      }, 120);
    }

    // Update sheet preview
    if (sheetThumb) {
      sheetThumb.src = info.img;
    }
    updateSheetConfig();
  }

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      updateColor(btn.dataset.color);
    });
  });

  dockDots.forEach(dot => {
    dot.addEventListener('click', () => {
      updateColor(dot.dataset.color);
    });
  });

  // ---------------------------------------------------------------------------
  // SIZE SELECTOR LOGIC
  // ---------------------------------------------------------------------------
  const sizePills = document.querySelectorAll('.size-pill-btn');

  function updateSize(size) {
    currentSize = size;
    sizePills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.size === size);
    });
    updateSheetConfig();
  }

  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      updateSize(pill.dataset.size);
    });
  });

  function updateSheetConfig() {
    if (sheetConfig) {
      sheetConfig.textContent = `${colorData[currentColor].name} • Size ${currentSize} (Drop-Shoulder Relaxed)`;
    }
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE 3D SHIRT PEDESTAL TILT & PARALLAX
  // ---------------------------------------------------------------------------
  const shirtPedestal = document.getElementById('shirtPedestal');
  const shirtImageWrapper = document.getElementById('shirtImageWrapper');
  const shirtGroundShadow = document.getElementById('shirtGroundShadow');

  if (shirtPedestal && shirtImageWrapper) {
    const handleMove = (x, y, rect) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (x - centerX) / (rect.width / 2);
      const deltaY = (y - centerY) / (rect.height / 2);

      const rotateY = deltaX * 18;
      const rotateX = -deltaY * 18;

      shirtImageWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;

      if (shirtGroundShadow) {
        shirtGroundShadow.style.transform = `translateX(calc(-50% + ${-deltaX * 20}px)) scale(${1 - Math.abs(deltaY) * 0.1})`;
        shirtGroundShadow.style.opacity = `${0.16 + Math.abs(deltaY) * 0.08}`;
      }
    };

    const resetTilt = () => {
      shirtImageWrapper.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
      if (shirtGroundShadow) {
        shirtGroundShadow.style.transform = 'translateX(-50%) scale(1)';
        shirtGroundShadow.style.opacity = '0.16';
      }
    };

    shirtPedestal.addEventListener('mousemove', (e) => {
      const rect = shirtPedestal.getBoundingClientRect();
      handleMove(e.clientX, e.clientY, rect);
    });

    shirtPedestal.addEventListener('mouseleave', resetTilt);

    // Touch support for mobile
    shirtPedestal.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = shirtPedestal.getBoundingClientRect();
        handleMove(touch.clientX, touch.clientY, rect);
      }
    }, { passive: true });

    shirtPedestal.addEventListener('touchend', resetTilt);
  }

  // ---------------------------------------------------------------------------
  // SCROLLYTELLING / CAMERA LENS CONTROLLER
  // ---------------------------------------------------------------------------
  let currentCameraMode = 'front';
  const camPills = document.querySelectorAll('.cam-pill-btn');
  const lensBadge = document.getElementById('lensBadge');

  const cameraShots = {
    front: {
      getImg: () => colorData[currentColor].img,
      badge: 'Full Silhouette • 360 View',
      scale: 'scale(1)',
      cardId: 'step1'
    },
    crest: {
      getImg: () => 'assets/detail_embroidery.png',
      badge: 'High-Density Eagle Crest',
      scale: 'scale(1.05)',
      cardId: 'step2'
    },
    collar: {
      getImg: () => 'assets/detail_collar.png',
      badge: 'Ribbed Drop-Shoulder Collar',
      scale: 'scale(1.05)',
      cardId: 'step3'
    },
    sleeve: {
      getImg: () => 'assets/detail_sleeve.png',
      badge: 'Heavyweight French Terry Knit',
      scale: 'scale(1.05)',
      cardId: 'step4'
    }
  };

  function setCameraShot(shotKey) {
    if (!cameraShots[shotKey] || !stickyLensImg) return;
    currentCameraMode = shotKey;
    const shot = cameraShots[shotKey];

    camPills.forEach(p => {
      p.classList.toggle('active', p.dataset.shot === shotKey);
    });

    if (lensBadge) {
      lensBadge.textContent = shot.badge;
    }

    stickyLensImg.style.opacity = '0.3';
    setTimeout(() => {
      stickyLensImg.src = shot.getImg();
      stickyLensImg.style.transform = shot.scale;
      stickyLensImg.style.opacity = '1';
    }, 100);

    document.querySelectorAll('.feature-glass-panel').forEach(card => {
      card.classList.toggle('highlighted', card.id === shot.cardId);
    });
  }

  camPills.forEach(p => {
    p.addEventListener('click', () => {
      setCameraShot(p.dataset.shot);
    });
  });

  // IntersectionObserver for smooth scroll-driven perspective switching
  const featurePanels = document.querySelectorAll('.feature-glass-panel');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const shotMode = entry.target.dataset.shot;
          if (shotMode && shotMode !== currentCameraMode) {
            setCameraShot(shotMode);
          }
        }
      });
    }, {
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.4
    });

    featurePanels.forEach(p => observer.observe(p));
  }

  // ---------------------------------------------------------------------------
  // DYNAMIC ISLAND INTERACTION
  // ---------------------------------------------------------------------------
  const dynamicIsland = document.getElementById('dynamicIsland');

  if (dynamicIsland) {
    dynamicIsland.addEventListener('click', () => {
      dynamicIsland.classList.toggle('expanded');
    });

    document.addEventListener('click', (e) => {
      if (!dynamicIsland.contains(e.target)) {
        dynamicIsland.classList.remove('expanded');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // NATIVE iOS BOTTOM SHEET (Prebook Drawer)
  // ---------------------------------------------------------------------------
  const sheetOverlay = document.getElementById('sheetOverlay');
  const openSheetBtns = document.querySelectorAll('.js-open-prebook');
  const closeSheetBtn = document.getElementById('closeSheetBtn');

  function openPrebookSheet() {
    updateSheetConfig();
    sheetOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePrebookSheet() {
    sheetOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openSheetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPrebookSheet();
    });
  });

  if (closeSheetBtn) {
    closeSheetBtn.addEventListener('click', closePrebookSheet);
  }

  if (sheetOverlay) {
    sheetOverlay.addEventListener('click', (e) => {
      if (e.target === sheetOverlay) {
        closePrebookSheet();
      }
    });
  }

  // Esc key to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePrebookSheet();
      closeSizeModal();
    }
  });

  // ---------------------------------------------------------------------------
  // SIZE GUIDE MODAL
  // ---------------------------------------------------------------------------
  const sizeGuideModal = document.getElementById('sizeGuideModal');
  const openSizeGuideBtn = document.getElementById('openSizeGuideBtn');
  const closeSizeGuideBtn = document.getElementById('closeSizeGuideBtn');

  function openSizeModal() {
    sizeGuideModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSizeModal() {
    sizeGuideModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openSizeGuideBtn) {
    openSizeGuideBtn.addEventListener('click', openSizeModal);
  }
  if (closeSizeGuideBtn) {
    closeSizeGuideBtn.addEventListener('click', closeSizeModal);
  }
  if (sizeGuideModal) {
    sizeGuideModal.addEventListener('click', (e) => {
      if (e.target === sizeGuideModal) {
        closeSizeModal();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // SHARE SHEET (iOS Web Share API)
  // ---------------------------------------------------------------------------
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Legion Risers Plain Polo Shirt',
        text: 'Prebook the Legion Risers Plain Polo Shirt for ₹0 Free. Pay ₹649 on Delivery.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {}
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard');
      }
    });
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '90px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(15, 16, 18, 0.9)';
    toast.style.color = '#ffffff';
    toast.style.backdropFilter = 'blur(16px)';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '9999px';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 10px 24px rgba(0,0,0,0.2)';
    toast.style.zIndex = '2000';
    toast.style.transition = 'all 0.3s ease';
    toast.textContent = msg;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  // Initialize
  updateColor('black');
  updateSize('L');
});
