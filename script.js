/**
 * ==========================================================================
 * معلم دهانات جدة المحترف - محرك التتبع والتفاعل فائق السرعة
 * Vanilla JS | Google Ads Conversion Tracking Engine | Zero Blocking (CWV)
 * ==========================================================================
 */

'use strict';

// 1. الإعدادات العامة والمتغيرات
const CONFIG = {
  clientPhone: '0558713352',
  clientPhoneIntl: '966558713352',
  devPhoneIntl: '966578539687',
  adsConversionId: 'AW-xxxxxxxxxxxxx',
  callConversionLabel: 'xxxxxxxxxxxxxxxxx',
  whatsappConversionLabel: 'xxxxxxxxxxxxxx',
  formConversionLabel: 'xxxxxxxxxxxxxxxxxxx'
};

// 2. تحميل كود تتبع إعلانات قوقل بطريقة غير حاجزة للأداء (Idle Execution)
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
    gtag('config', CONFIG.adsConversionId, {
      send_page_view: true
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadGtag, { timeout: 3500 });
  } else {
    window.addEventListener('load', () => {
      setTimeout(loadGtag, 1500);
    });
  }
}

// 3. دالة إرسال تحويلات إعلانات قوقل
function trackGoogleAdsConversion(conversionLabel, callback) {
  let callbackFired = false;
  const executeCallback = () => {
    if (!callbackFired && typeof callback === 'function') {
      callbackFired = true;
      callback();
    }
  };

  // مهلة زمنية احتياطية في حال تعثر إرسال الحدث
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

// 4. معالجة نقرات الاتصال الهاتفي
function handleCallClick(event) {
  const target = event.currentTarget;
  const phone = target.getAttribute('data-phone') || CONFIG.clientPhoneIntl;

  // استثناء رقم المطور لمنع إرسال إحالات غير صحيحة
  if (phone.includes('578539687')) {
    return true;
  }

  if (event.isTrusted) {
    trackGoogleAdsConversion(CONFIG.callConversionLabel, null);
  }
  return true;
}

// 5. معالجة نقرات الواتساب
function handleWhatsAppClick(event) {
  const target = event.currentTarget;
  const href = target.getAttribute('href') || '';

  // استثناء رقم المطور
  if (href.includes(CONFIG.devPhoneIntl)) {
    return true;
  }

  if (event.isTrusted) {
    trackGoogleAdsConversion(CONFIG.whatsappConversionLabel, null);
  }
  return true;
}

// 6. تشغيل القائمة المتنقلة (Mobile Hamburger Menu)
function setupMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (!hamburgerBtn || !mobileNav) return;

  function toggleMenu(isOpen) {
    hamburgerBtn.classList.toggle('active', isOpen);
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  hamburgerBtn.addEventListener('click', () => {
    const willOpen = !mobileNav.classList.contains('open');
    toggleMenu(willOpen);
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav || e.target.closest('a')) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

// 7. زر التمرير للأعلى السلس
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 8. تهيئة حاسبة تكلفة الدهانات التفاعلية
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

// 9. تشغيل النماذج الذكية (.smart-lead-form)
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

// 10. إعداد أسئلة وأجوبة الأكورديون (FAQ Accordion)
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

// 11. ربط مستمعات الأحداث بعد جاهزية DOM
document.addEventListener('DOMContentLoaded', () => {
  initGoogleTagManager();
  setupMobileMenu();
  setupScrollToTop();
  setupPaintCalculator();
  setupSmartLeadForms();
  setupFaqAccordion();

  // ربط جميع روابط الاتصال والواتساب بالتحويلات تلقائياً
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', handleCallClick);
  });

  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach((link) => {
    link.addEventListener('click', handleWhatsAppClick);
  });
});
