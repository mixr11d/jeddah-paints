/**
 * ==========================================================================
 * معلم دهانات جدة المحترف - المحرك البرمجي المحدث للتفاعل والتتبع
 * ==========================================================================
 */

'use strict';

const CONFIG = {
  clientPhone: '0558713352',
  clientPhoneIntl: '966558713352',
  devPhoneIntl: '966578539687',
  adsConversionId: 'AW-xxxxxxxxxxxxx',
  callConversionLabel: 'xxxxxxxxxxxxxxxxx',
  whatsappConversionLabel: 'xxxxxxxxxxxxxx',
  formConversionLabel: 'xxxxxxxxxxxxxxxxxxx'
};

function initGoogleTagManager() {
  const loadGtag = () => {
    if (window.gtagLoaded) return;
    window.gtagLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.adsConversionId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', CONFIG.adsConversionId, { send_page_view: true });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadGtag, { timeout: 3500 });
  } else {
    window.addEventListener('load', () => setTimeout(loadGtag, 1500));
  }
}

function trackGoogleAdsConversion(conversionLabel, callback) {
  let callbackFired = false;
  const executeCallback = () => {
    if (!callbackFired && typeof callback === 'function') {
      callbackFired = true;
      callback();
    }
  };

  const timeoutId = setTimeout(executeCallback, 500);

  if (typeof window.gtag === 'function' && CONFIG.adsConversionId !== 'AW-xxxxxxxxxxxxx') {
    window.gtag('event', 'conversion', {
      send_to: `${CONFIG.adsConversionId}/${conversionLabel}`,
      event_callback: () => {
        clearTimeout(timeoutId);
        executeCallback();
      }
    });
  } else {
    clearTimeout(timeoutId);
    executeCallback();
  }
}

function handleCallClick(event) {
  const target = event.currentTarget;
  const phone = target.getAttribute('data-phone') || CONFIG.clientPhoneIntl;
  if (phone.includes('578539687')) return true;

  if (event.isTrusted) {
    trackGoogleAdsConversion(CONFIG.callConversionLabel, null);
  }
  return true;
}

function handleWhatsAppClick(event) {
  const target = event.currentTarget;
  const href = target.getAttribute('href') || '';
  if (href.includes(CONFIG.devPhoneIntl)) return true;

  if (event.isTrusted) {
    trackGoogleAdsConversion(CONFIG.whatsappConversionLabel, null);
  }
  return true;
}

// القائمة المتنقلة للجوال
function setupMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  if (!hamburgerBtn || !mobileNav) return;

  function openMenu() {
    hamburgerBtn.classList.add('active');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav || e.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

function setupScrollToTop() {
  const scrollContainer = document.getElementById('scrollTopContainer');
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollContainer || !scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollContainer.classList.add('visible');
    } else {
      scrollContainer.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupPaintCalculator() {
  const calcForm = document.getElementById('paintCalculatorForm');
  if (!calcForm) return;

  const areaInput = document.getElementById('calcArea');
  const packageSelect = document.getElementById('calcPackage');
  const resultDisplay = document.getElementById('calcResultVal');
  const sendWhatsappBtn = document.getElementById('calcWhatsappBtn');

  function calculate() {
    const area = parseFloat(areaInput.value) || 0;
    const pricePerMeter = parseFloat(packageSelect.value) || 0;
    const total = Math.round(area * pricePerMeter);

    if (resultDisplay) {
      resultDisplay.textContent = total > 0 ? `${total.toLocaleString('ar-SA')} ر.س` : '0 ر.س';
    }

    if (sendWhatsappBtn) {
      const selectedText = packageSelect.options[packageSelect.selectedIndex].text;
      const message = `السلام عليكم، أود الاستفسار عن خدمة الدهان بجدة:%0A- المساحة التقديرية: ${area} متر مربع%0A- نوع الباقة: ${selectedText}%0A- التكلفة التقديرية بالحاسبة: ${total} ريال سعودي`;
      sendWhatsappBtn.href = `https://wa.me/${CONFIG.clientPhoneIntl}?text=${message}`;
    }
  }

  areaInput.addEventListener('input', calculate);
  packageSelect.addEventListener('change', calculate);
  calculate();
}

function setupSmartLeadForms() {
  const forms = document.querySelectorAll('.smart-lead-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="client_name"]');
      const phoneInput = form.querySelector('[name="client_phone"]');
      const serviceSelect = form.querySelector('[name="service_type"]');
      const districtInput = form.querySelector('[name="district"]');

      const name = nameInput ? nameInput.value.trim() : 'عميل كريم';
      const phone = phoneInput ? phoneInput.value.trim() : 'غير محدد';
      const service = serviceSelect ? serviceSelect.value : 'طلب دهان عام';
      const district = districtInput ? districtInput.value.trim() : 'مدينة جدة';

      const message = `طلب جديد من الموقع الإلكتروني:%0A- الاسم: ${name}%0A- الجوال: ${phone}%0A- الخدمة المطلوبة: ${service}%0A- الحي/الموقع: ${district}`;
      const targetUrl = `https://wa.me/${CONFIG.clientPhoneIntl}?text=${message}`;

      trackGoogleAdsConversion(CONFIG.formConversionLabel, () => {
        window.location.href = targetUrl;
      });
    });
  });
}

function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGoogleTagManager();
  setupMobileMenu();
  setupScrollToTop();
  setupPaintCalculator();
  setupSmartLeadForms();
  setupFaqAccordion();

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', handleCallClick);
  });

  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach((link) => {
    link.addEventListener('click', handleWhatsAppClick);
  });
});
