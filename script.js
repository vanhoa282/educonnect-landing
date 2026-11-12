/**
 * EduConnect Modern Landing Page JavaScript
 * Comprehensive Animation Engine, Interactive 3D Parallax & Business Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Ambient Canvas Particle & Mesh Network Animation
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? 'rgba(59, 130, 246, ' : 'rgba(139, 92, 246, ';
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateMesh() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.18 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateMesh);
    }
    animateMesh();
  }

  /* ==========================================================================
     2. 3D Parallax Tilt Effect for Phone & Cards
     ========================================================================== */
  const phoneWrapper = document.getElementById('phone-tilt-card');
  if (phoneWrapper) {
    const handleMove = (e) => {
      const rect = phoneWrapper.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (!clientX || !clientY) return;

      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      const rotateX = (-y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;

      phoneWrapper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleLeave = () => {
      phoneWrapper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    };

    document.addEventListener('mousemove', (e) => {
      if (window.innerWidth > 768) {
        const hero = document.getElementById('hero');
        if (hero && hero.contains(e.target)) {
          handleMove(e);
        } else {
          handleLeave();
        }
      }
    });
  }

  // Tilt effect for cards with class .tilt-card
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(800px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ==========================================================================
     3. Spotlight Cursor on Bento Grid Cards
     ========================================================================== */
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     4. Intersection Observer: Scroll Reveal & Stagger Animations
     ========================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     5. Animated Number Counters
     ========================================================================== */
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = el.getAttribute('data-decimals') === '1';
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = target * ease;

      if (isDecimal) {
        el.textContent = currentVal.toFixed(1);
      } else {
        el.textContent = Math.floor(currentVal).toLocaleString('vi-VN');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('vi-VN');
      }
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(c => countUp(c));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) counterObserver.observe(statsSection);

  /* ==========================================================================
     6. Role Tab Switcher (Kinh Doanh & Giải Pháp)
     ========================================================================== */
  const roleTabs = document.querySelectorAll('.role-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = 'tab-' + tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     7. Interactive Calculator & Pricing Engine (Kinh Doanh)
     ========================================================================== */
  // Calculator mode switcher (Student vs Tutor)
  const calcStudentBtn = document.getElementById('calc-student-btn');
  const calcTutorBtn = document.getElementById('calc-tutor-btn');
  const calcPanelStudent = document.getElementById('calc-panel-student');
  const calcPanelTutor = document.getElementById('calc-panel-tutor');

  if (calcStudentBtn && calcTutorBtn) {
    calcStudentBtn.addEventListener('click', () => {
      calcStudentBtn.classList.add('active');
      calcTutorBtn.classList.remove('active');
      calcPanelStudent.classList.add('active');
      calcPanelTutor.classList.remove('active');
    });

    calcTutorBtn.addEventListener('click', () => {
      calcTutorBtn.classList.add('active');
      calcStudentBtn.classList.remove('active');
      calcPanelTutor.classList.add('active');
      calcPanelStudent.classList.remove('active');
    });
  }

  // Student calculation
  let selectedSubjectPrice = 120000;
  let selectedSessions = 20;
  let selectedDiscount = 0.10;

  const subjectPills = document.querySelectorAll('#subject-selector .pill');
  const pkgCards = document.querySelectorAll('#package-selector .pkg-card');
  const calcTotalPrice = document.getElementById('calc-total-price');
  const calcUnitPrice = document.getElementById('calc-unit-price');
  const calcDiscountTag = document.getElementById('calc-discount-tag');

  function updateStudentCalc() {
    const rawTotal = selectedSubjectPrice * selectedSessions;
    const finalTotal = Math.round(rawTotal * (1 - selectedDiscount));
    const finalPerSession = Math.round(finalTotal / selectedSessions);

    if (calcTotalPrice) calcTotalPrice.textContent = finalTotal.toLocaleString('vi-VN');
    if (calcUnitPrice) calcUnitPrice.textContent = finalPerSession.toLocaleString('vi-VN') + 'đ';

    if (calcDiscountTag) {
      if (selectedDiscount > 0) {
        calcDiscountTag.textContent = `Đã tiết kiệm ${(selectedDiscount * 100)}% (${(rawTotal - finalTotal).toLocaleString('vi-VN')}đ)`;
        calcDiscountTag.style.display = 'inline-block';
      } else {
        calcDiscountTag.textContent = 'Giá tiêu chuẩn';
      }
    }
  }

  subjectPills.forEach(pill => {
    pill.addEventListener('click', () => {
      subjectPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedSubjectPrice = parseInt(pill.getAttribute('data-price'), 10);
      updateStudentCalc();
    });
  });

  pkgCards.forEach(card => {
    card.addEventListener('click', () => {
      pkgCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedSessions = parseInt(card.getAttribute('data-sessions'), 10);
      selectedDiscount = parseFloat(card.getAttribute('data-discount'));
      updateStudentCalc();
    });
  });

  // Tutor calculation
  const tutorHoursSlider = document.getElementById('tutor-hours-slider');
  const sliderHoursVal = document.getElementById('slider-hours-val');
  const tutorRatePills = document.querySelectorAll('#tutor-rate-selector .pill');
  const tutorMonthlyEarn = document.getElementById('tutor-monthly-earn');
  const tutorWeeklyEarn = document.getElementById('tutor-weekly-earn');

  let tutorSessionRate = 120000;

  function updateTutorCalc() {
    if (!tutorHoursSlider) return;
    const hours = parseInt(tutorHoursSlider.value, 10);
    if (sliderHoursVal) sliderHoursVal.textContent = hours;

    // 1 session is 1.5 hours
    const sessionsPerWeek = hours / 1.5;
    const weekly = Math.round(sessionsPerWeek * tutorSessionRate);
    const monthly = weekly * 4;

    if (tutorWeeklyEarn) tutorWeeklyEarn.textContent = weekly.toLocaleString('vi-VN') + 'đ';
    if (tutorMonthlyEarn) tutorMonthlyEarn.textContent = monthly.toLocaleString('vi-VN');
  }

  if (tutorHoursSlider) {
    tutorHoursSlider.addEventListener('input', updateTutorCalc);
  }

  tutorRatePills.forEach(pill => {
    pill.addEventListener('click', () => {
      tutorRatePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      tutorSessionRate = parseInt(pill.getAttribute('data-rate'), 10);
      updateTutorCalc();
    });
  });

  /* ==========================================================================
     8. FAQ Accordion Interaction
     ========================================================================== */
  const accordionBtns = document.querySelectorAll('.accordion-btn');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      // Close other accordions
      document.querySelectorAll('.accordion-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBody = other.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     9. Interactive AI Consultation Widget Simulation
     ========================================================================== */
  const aiWidget = document.getElementById('ai-widget');
  const aiToggleBtn = document.getElementById('ai-toggle-btn');
  const aiPanel = document.getElementById('ai-panel');
  const aiClose = document.getElementById('ai-close');
  const aiTextInput = document.getElementById('ai-text-input');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiMessages = document.getElementById('ai-chat-messages');
  const aiChips = document.querySelectorAll('#ai-chips .chip');

  const knowledgeBase = [
    {
      keywords: ['toán', 'toan', 'toán 12', 'gia sư toán'],
      reply: 'EduConnect có hơn 120+ gia sư Toán từ lớp 1-12 và luyện thi THPT Quốc gia (tiêu biểu như Thầy Nguyễn Văn An - đánh giá 4.9⭐). Bạn có thể đặt gói 10/20/30 buổi học kèm 1:1 qua phòng WebRTC ngay hôm nay!'
    },
    {
      keywords: ['gia sư', 'đăng ký', 'kgu', 'làm gia sư', 'thu nhập'],
      reply: 'Chào bạn! Để đăng ký làm Gia sư trên EduConnect: bạn cần là sinh viên KGU hoặc giáo viên có điểm tích lũy tốt. Sau khi gửi hồ sơ, Quản trị viên sẽ cấp Mã Mời (Invite Code) để kích hoạt tài khoản. Thu nhập trung bình từ 6 - 15 triệu/tháng tùy theo lịch rảnh bạn thiết lập!'
    },
    {
      keywords: ['webrtc', 'học trực tuyến', 'phòng học', 'zoom', 'meet'],
      reply: 'Phòng học trực tuyến trên EduConnect sử dụng công nghệ WebRTC chạy trực tiếp trong ứng dụng. Bạn và gia sư có thể đàm thoại video HD, chia sẻ màn hình bài tập và gửi file ảnh mà KHÔNG CẦN cài đặt thêm Zoom hay Google Meet!'
    },
    {
      keywords: ['học phí', 'giá', 'bao nhiêu', 'chi phí', 'gói học'],
      reply: 'Học phí trên EduConnect rất linh hoạt, dao động từ 100.000đ - 140.000đ/buổi 90 phút. Khi đăng ký gói 20 buổi bạn được giảm 10%, gói 30 buổi giảm 15%. Toàn bộ học phí được giữ cọc an toàn, chỉ thanh toán cho gia sư sau khi hoàn tất buổi học.'
    }
  ];

  function appendAiMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `ai-msg ${role}`;
    msg.textContent = text;
    aiMessages.appendChild(msg);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function handleAiQuery(query) {
    const text = query.trim();
    if (!text) return;
    appendAiMessage('user', text);
    if (aiTextInput) aiTextInput.value = '';

    // Typing simulation
    setTimeout(() => {
      let foundReply = 'Cảm ơn bạn đã quan tâm đến EduConnect! Bạn có thể để lại thông tin tại biểu mẫu bên dưới hoặc gọi Hotline 0325 272 884 để được đội ngũ KGU hỗ trợ ghép nối gia sư nhanh nhất nhé.';
      const lower = text.toLowerCase();
      for (const item of knowledgeBase) {
        if (item.keywords.some(k => lower.includes(k))) {
          foundReply = item.reply;
          break;
        }
      }
      appendAiMessage('bot', foundReply);
    }, 600);
  }

  if (aiToggleBtn && aiPanel) {
    aiToggleBtn.addEventListener('click', () => {
      aiPanel.classList.toggle('open');
    });
  }

  if (aiClose) {
    aiClose.addEventListener('click', () => {
      aiPanel.classList.remove('open');
    });
  }

  if (aiSendBtn && aiTextInput) {
    aiSendBtn.addEventListener('click', () => handleAiQuery(aiTextInput.value));
    aiTextInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAiQuery(aiTextInput.value);
    });
  }

  aiChips.forEach(chip => {
    chip.addEventListener('click', () => {
      handleAiQuery(chip.getAttribute('data-query'));
    });
  });

  /* ==========================================================================
     10. Mobile Menu Drawer
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });

  /* ==========================================================================
     11. Toast & Confetti Feedback
     ========================================================================== */
  const toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Lead Form Submission
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      showToast(`🎉 Cảm ơn ${name}! EduConnect sẽ liên hệ Zalo (${phone}) trong 15 phút.`);
      leadForm.reset();
      triggerConfetti();
    });
  }

  // Order package button
  const btnOrder = document.getElementById('btn-order-package');
  if (btnOrder) {
    btnOrder.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Vui lòng điền thông tin để hoàn tất đặt gói học!');
      }
    });
  }

  // Download APK Button
  const btnDownloadApk = document.getElementById('btn-download-apk');
  if (btnDownloadApk) {
    btnDownloadApk.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('🚀 Đang chuẩn bị tải tệp cài đặt EduConnect APK...');
      setTimeout(() => {
        showToast('📦 Ứng dụng Android (com.vanhoa282.eduteach) sẵn sàng thử nghiệm!');
      }, 1500);
    });
  }

  // Simple Confetti Burst
  function triggerConfetti() {
    const colors = ['#2563EB', '#60A5FA', '#8B5CF6', '#10B981', '#F59E0B'];
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.left = '50%';
      conf.style.top = '50%';
      conf.style.width = Math.random() * 8 + 6 + 'px';
      conf.style.height = Math.random() * 8 + 6 + 'px';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      conf.style.zIndex = '9999';
      conf.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 250 + 100;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      document.body.appendChild(conf);

      let posX = window.innerWidth / 2;
      let posY = window.innerHeight / 2;
      let opacity = 1;

      const anim = () => {
        posX += vx * 0.016;
        posY += vy * 0.016 + 2; // gravity
        opacity -= 0.018;

        conf.style.left = posX + 'px';
        conf.style.top = posY + 'px';
        conf.style.opacity = opacity;

        if (opacity > 0) {
          requestAnimationFrame(anim);
        } else {
          conf.remove();
        }
      };
      requestAnimationFrame(anim);
    }
  }

});
