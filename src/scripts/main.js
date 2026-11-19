/**
 * Progressive-enhancement UI helpers:
 * - Accessible <dialog> gallery lightbox with Prev/Next and Arrow-key navigation
 * - Secure-context clipboard copy buttons for email alias and code snippets
 */
function initLightbox() {
  const dialog = document.querySelector('[data-lightbox-modal]');
  const triggers = Array.from(document.querySelectorAll('a[data-lightbox]'));

  if (!dialog || typeof dialog.showModal !== 'function' || triggers.length === 0) {
    return;
  }

  const img = dialog.querySelector('[data-lightbox-img]');
  const captionEl = dialog.querySelector('[data-lightbox-caption-text]');
  const counterEl = dialog.querySelector('[data-lightbox-counter]');
  const directLink = dialog.querySelector('[data-lightbox-direct]');
  const errorEl = dialog.querySelector('[data-lightbox-error]');
  const closeBtn = dialog.querySelector('[data-lightbox-close]');
  const prevBtn = dialog.querySelector('[data-lightbox-prev]');
  const nextBtn = dialog.querySelector('[data-lightbox-next]');
  const detailsEl = dialog.querySelector('[data-lightbox-details]');
  const eyebrowEl = dialog.querySelector('[data-lightbox-panel-eyebrow]');
  const titleEl = dialog.querySelector('[data-lightbox-panel-title]');
  const roleEl = dialog.querySelector('[data-lightbox-panel-role]');
  const summaryEl = dialog.querySelector('[data-lightbox-panel-summary]');
  const featuresLabelEl = dialog.querySelector('[data-lightbox-panel-features-label]');
  const featuresEl = dialog.querySelector('[data-lightbox-panel-features]');
  const stackLabelEl = dialog.querySelector('[data-lightbox-panel-stack-label]');
  const stackEl = dialog.querySelector('[data-lightbox-panel-stack]');
  const verifyEl = dialog.querySelector('[data-lightbox-verify]');

  if (!img || !captionEl || !errorEl || !closeBtn) {
    return;
  }

  let lastTrigger = null;
  let activeGroup = triggers;
  let currentIndex = 0;

  const clearFeatures = () => {
    if (!featuresEl) {
      return;
    }
    while (featuresEl.firstChild) {
      featuresEl.removeChild(featuresEl.firstChild);
    }
  };

  const renderDetails = (anchor) => {
    if (!detailsEl) {
      return;
    }
    const eyebrow = anchor?.dataset.lightboxEyebrow || 'How It Works';
    const title = anchor?.dataset.lightboxTitle || '';
    const role = anchor?.dataset.lightboxRole || '';
    const summary = anchor?.dataset.lightboxSummary || '';
    const featuresLabel = anchor?.dataset.lightboxFeaturesLabel || 'Core Application Workflow';
    const stackLabel = anchor?.dataset.lightboxStackLabel || 'Stack & Cloud Integration';
    const stack = anchor?.dataset.lightboxStack || '';
    const verifyHref = anchor?.dataset.lightboxVerify || '';
    const features = (anchor?.dataset.lightboxFeatures || '')
      .split('|')
      .map((item) => item.trim())
      .filter(Boolean);

    clearFeatures();

    const hasDetails = Boolean(title || summary || features.length > 0);
    detailsEl.hidden = !hasDetails;
    if (!hasDetails) {
      if (eyebrowEl) eyebrowEl.textContent = 'How It Works';
      if (titleEl) titleEl.textContent = '';
      if (roleEl) roleEl.textContent = '';
      if (summaryEl) summaryEl.textContent = '';
      if (featuresLabelEl) featuresLabelEl.textContent = 'Core Application Workflow';
      if (stackLabelEl) stackLabelEl.textContent = 'Stack & Cloud Integration';
      if (stackEl) stackEl.textContent = '';
      if (verifyEl) {
        verifyEl.hidden = true;
        verifyEl.setAttribute('href', '#');
      }
      return;
    }

    if (eyebrowEl) eyebrowEl.textContent = eyebrow;
    if (titleEl) titleEl.textContent = title;
    if (roleEl) {
      roleEl.textContent = role;
      roleEl.hidden = !role;
    }
    if (summaryEl) {
      summaryEl.textContent = summary;
      summaryEl.hidden = !summary;
    }
    if (featuresLabelEl) featuresLabelEl.textContent = featuresLabel;
    if (stackLabelEl) stackLabelEl.textContent = stackLabel;
    if (stackEl) stackEl.textContent = stack;
    if (verifyEl) {
      verifyEl.hidden = !verifyHref;
      verifyEl.setAttribute('href', verifyHref || '#');
    }
    if (featuresEl) {
      for (const featureText of features) {
        const item = document.createElement('li');
        item.className = 'flex items-start gap-2';
        const marker = document.createElement('span');
        marker.setAttribute('aria-hidden', 'true');
        marker.className = 'shrink-0 font-bold text-teal-300';
        marker.textContent = '\u2022';
        const copy = document.createElement('span');
        copy.textContent = featureText;
        item.appendChild(marker);
        item.appendChild(copy);
        featuresEl.appendChild(item);
      }
    }
  };

  const showSlide = (index) => {
    const total = activeGroup.length;
    const nextIndex = ((index % total) + total) % total;
    const anchor = activeGroup[nextIndex];
    const href = anchor.getAttribute('href');
    if (!href) {
      return;
    }

    currentIndex = nextIndex;
    errorEl.hidden = true;
    img.hidden = false;
    img.removeAttribute('src');
    captionEl.textContent = anchor.dataset.lightboxCaption || '';
    img.alt = anchor.dataset.lightboxAlt || anchor.dataset.lightboxCaption || '';
    renderDetails(anchor);
    img.src = href;

    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${total}`;
    }
    if (directLink) {
      directLink.setAttribute('href', href);
    }
    if (prevBtn) {
      prevBtn.hidden = total < 2;
    }
    if (nextBtn) {
      nextBtn.hidden = total < 2;
    }
  };

  const resetModal = () => {
    img.removeAttribute('src');
    img.alt = '';
    img.hidden = false;
    errorEl.hidden = true;
    captionEl.textContent = '';
    renderDetails(null);

    if (counterEl) {
      counterEl.textContent = '';
    }
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
    lastTrigger = null;
  };

  img.addEventListener('error', () => {
    if (!dialog.open || !img.hasAttribute('src')) {
      return;
    }
    img.hidden = true;
    errorEl.hidden = false;
  });

  triggers.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }
      if (!anchor.getAttribute('href')) {
        return;
      }

      event.preventDefault();
      lastTrigger = anchor;
      const groupKey = anchor.dataset.lightboxGroup || 'default';
      activeGroup = triggers.filter(
        (item) => (item.dataset.lightboxGroup || 'default') === groupKey
      );
      showSlide(Math.max(0, activeGroup.indexOf(anchor)));
      dialog.showModal();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
  }

  document.addEventListener('keydown', (event) => {
    if (
      !dialog.open ||
      activeGroup.length < 2 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(currentIndex + 1);
    }
  });

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  dialog.addEventListener('close', resetModal);
}

function attachCopyControl(button, getPayload, statusEl, formatSuccess) {
  if (
    !button ||
    !statusEl ||
    !window.isSecureContext ||
    !navigator.clipboard ||
    typeof navigator.clipboard.writeText !== 'function'
  ) {
    return;
  }

  button.hidden = false;
  button.addEventListener('click', async () => {
    const text = getPayload();
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      statusEl.textContent = formatSuccess(text);
    } catch {
      statusEl.textContent = 'Copy unavailable in this browser context. Select the text directly instead.';
    }
  });
}

function initCopyHelpers() {
  const emailBtn = document.querySelector('[data-email-copy]');
  const emailStatus = document.querySelector('[data-email-status]');
  attachCopyControl(
    emailBtn,
    () => emailBtn?.dataset.emailAddress || '',
    emailStatus,
    (address) => `Copied ${address} to clipboard.`
  );

  for (const codeBtn of document.querySelectorAll('[data-code-copy]')) {
    const container = codeBtn.closest('details');
    if (!container) {
      continue;
    }
    const codeEl = container.querySelector('pre code') || container.querySelector('code');
    const codeStatus = container.querySelector('[data-code-status]');
    attachCopyControl(
      codeBtn,
      () => codeEl?.textContent?.trim() || '',
      codeStatus,
      () => 'Copied snippet to clipboard.'
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    initCopyHelpers();
  });
} else {
  initLightbox();
  initCopyHelpers();
}
