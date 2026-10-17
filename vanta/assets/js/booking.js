/* ============================================================
   VANTA — Booking Module
   Multi-step form: service → date/time → details → confirm
   ============================================================ */

(function () {
  'use strict';

  const serviceOptions = document.getElementById('service-options');
  const step1Next  = document.getElementById('step1-next');
  const step2Back  = document.getElementById('step2-back');
  const step2Next  = document.getElementById('step2-next');
  const step3Back  = document.getElementById('step3-back');
  const step3Next  = document.getElementById('step3-next');
  const step4Back  = document.getElementById('step4-back');
  const step4Confirm = document.getElementById('step4-confirm');
  const bookingRestart = document.getElementById('booking-restart');
  const bookingSummaryEl = document.getElementById('booking-summary');
  const bookingRefDisplay = document.getElementById('booking-ref-display');
  const bookingConfirmSummary = document.getElementById('booking-confirm-summary');
  const calTitle   = document.getElementById('cal-title');
  const calGrid    = document.getElementById('cal-grid');
  const calPrev    = document.getElementById('cal-prev');
  const calNext    = document.getElementById('cal-next');
  const timeSlotsEl = document.getElementById('time-slots');
  const timeSlotsHint = document.getElementById('time-slots-hint');

  if (!serviceOptions) return;

  /* ── State ───────────────────────────────────────────────── */
  let selectedService = null;
  let selectedDate    = null;
  let selectedTime    = null;
  let calendarDate    = new Date();
  let currentStep     = 1;

  /* ── Render services ─────────────────────────────────────── */
  VANTA.bookingServices.forEach(svc => {
    const el = document.createElement('div');
    el.className = 'service-option';
    el.setAttribute('role', 'radio');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-checked', 'false');
    el.setAttribute('aria-label', `${svc.name}, ${svc.duration}, ${svc.price}`);
    el.dataset.id = svc.id;
    el.innerHTML = `
      <span class="service-option-name">${svc.name}</span>
      <span class="service-option-meta">${svc.duration}</span>
      <span class="service-option-price">${svc.price}</span>
    `;
    el.addEventListener('click', () => selectService(svc, el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectService(svc, el);
      }
    });
    serviceOptions.appendChild(el);
  });

  function selectService(svc, el) {
    document.querySelectorAll('.service-option').forEach(o => {
      o.classList.remove('selected');
      o.setAttribute('aria-checked', 'false');
    });
    el.classList.add('selected');
    el.setAttribute('aria-checked', 'true');
    selectedService = svc;
    step1Next.disabled = false;
  }

  /* ── Step navigation with smooth transitions ─────────────── */
  function goToStep(n) {
    const currentEl = document.querySelector('.booking-step-content.active') || document.getElementById(`booking-step-${currentStep}`);
    const nextEl = document.getElementById(`booking-step-${n}`);
    if (!nextEl) return;

    if (currentEl && currentEl !== nextEl) {
      currentEl.classList.add('is-fading-out');

      setTimeout(() => {
        document.querySelectorAll('.booking-step-content').forEach(el => {
          el.style.display = 'none';
          el.classList.remove('active', 'is-fading-out');
        });
        nextEl.style.display = 'block';
        // force layout recalculation for smooth transition
        void nextEl.offsetWidth;
        nextEl.classList.add('active');
      }, 160);
    } else {
      document.querySelectorAll('.booking-step-content').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active', 'is-fading-out');
      });
      nextEl.style.display = 'block';
      void nextEl.offsetWidth;
      nextEl.classList.add('active');
    }

    // Update step indicators
    document.querySelectorAll('.booking-step[id^="step-ind"]').forEach((ind, i) => {
      const stepNum = i + 1;
      ind.classList.remove('active', 'done');
      if (stepNum < n) ind.classList.add('done');
      else if (stepNum === n) ind.classList.add('active');
    });

    currentStep = n;
  }

  /* Step 1 → 2 */
  step1Next.addEventListener('click', () => {
    if (!selectedService) return;
    goToStep(2);
    renderCalendar();
  });

  /* Step 2 → 1 */
  step2Back.addEventListener('click', () => goToStep(1));

  /* Step 2 → 3 */
  step2Next.addEventListener('click', () => {
    if (!selectedDate || !selectedTime) return;
    goToStep(3);
  });

  /* Step 3 → 2 */
  step3Back.addEventListener('click', () => goToStep(2));

  /* Step 3 → 4 */
  step3Next.addEventListener('click', () => {
    if (!validateStep3()) return;
    buildSummary();
    goToStep(4);
  });

  /* Step 4 → 3 */
  step4Back.addEventListener('click', () => goToStep(3));

  /* Step 4 → 5 (confirm) */
  step4Confirm.addEventListener('click', () => {
    const ref = 'VNT-' + Math.floor(Math.random() * 90000 + 10000);
    bookingRefDisplay.textContent = `REF — ${ref}`;
    // Summary in success
    bookingConfirmSummary.innerHTML = `
      <div class="booking-summary" style="margin-top:var(--space-4);width:100%;">
        ${summaryRows()}
      </div>
    `;
    goToStep(5);
  });

  /* Restart */
  bookingRestart.addEventListener('click', () => {
    selectedService = null;
    selectedDate    = null;
    selectedTime    = null;
    document.querySelectorAll('.service-option').forEach(o => {
      o.classList.remove('selected');
      o.setAttribute('aria-checked', 'false');
    });
    step1Next.disabled = true;
    document.getElementById('bk-fname').value = '';
    document.getElementById('bk-lname').value = '';
    document.getElementById('bk-email').value = '';
    document.getElementById('bk-phone').value = '';
    document.getElementById('bk-notes').value = '';
    goToStep(1);
  });

  /* ── Validation ──────────────────────────────────────────── */
  function validateStep3() {
    let valid = true;
    const fname = document.getElementById('bk-fname');
    const lname = document.getElementById('bk-lname');
    const email = document.getElementById('bk-email');

    [fname, lname, email].forEach(input => {
      const err = document.getElementById(`${input.id}-err`);
      if (!input.value.trim()) {
        err.textContent = 'This field is required.';
        err.style.display = 'block';
        input.style.borderColor = '#e07070';
        valid = false;
      } else if (input.type === 'email' && !isEmail(input.value)) {
        err.textContent = 'Please enter a valid email address.';
        err.style.display = 'block';
        input.style.borderColor = '#e07070';
        valid = false;
      } else {
        err.style.display = 'none';
        input.style.borderColor = '';
      }
    });

    return valid;
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  /* ── Summary ─────────────────────────────────────────────── */
  function summaryRows() {
    const fname = document.getElementById('bk-fname').value.trim();
    const lname = document.getElementById('bk-lname').value.trim();
    const email = document.getElementById('bk-email').value.trim();
    const d = new Date(selectedDate + 'T12:00:00');
    const dateStr = d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    return `
      <div class="booking-summary-row"><span class="booking-summary-key">Service</span><span class="booking-summary-val">${selectedService.name}</span></div>
      <div class="booking-summary-row"><span class="booking-summary-key">Duration</span><span class="booking-summary-val">${selectedService.duration}</span></div>
      <div class="booking-summary-row"><span class="booking-summary-key">Price</span><span class="booking-summary-val" style="color:var(--c-gold);">${selectedService.price}</span></div>
      <div class="booking-summary-row"><span class="booking-summary-key">Date</span><span class="booking-summary-val">${dateStr}</span></div>
      <div class="booking-summary-row"><span class="booking-summary-key">Time</span><span class="booking-summary-val">${selectedTime}</span></div>
      <div class="booking-summary-row"><span class="booking-summary-key">Name</span><span class="booking-summary-val">${fname} ${lname}</span></div>
      <div class="booking-summary-row"><span class="booking-summary-key">Email</span><span class="booking-summary-val">${email}</span></div>
    `;
  }

  function buildSummary() {
    bookingSummaryEl.innerHTML = summaryRows();
  }

  /* ── Calendar ────────────────────────────────────────────── */
  const DAYS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTHS= ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function renderCalendar() {
    const year  = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    calTitle.textContent = `${MONTHS[month]} ${year}`;

    calGrid.innerHTML = '';

    // Day names
    DAYS.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'cal-day-name';
      cell.textContent = d;
      calGrid.appendChild(cell);
    });

    const firstDay  = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    // Empty cells before
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day empty';
      calGrid.appendChild(cell);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.setAttribute('role', 'gridcell');
      const thisDate = new Date(year, month, d);
      const isPast = thisDate < today;
      const isToday = thisDate.getTime() === today.getTime();
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isSunday = thisDate.getDay() === 0; // closed Sundays for salon

      cell.className = 'cal-day' + (isToday ? ' today' : '') + (isPast || isSunday ? ' disabled' : '');
      cell.textContent = d;

      if (selectedDate === dateStr) cell.classList.add('selected');
      if (!isPast && !isSunday) {
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('aria-label', `${d} ${MONTHS[month]}`);
        cell.addEventListener('click', () => selectDate(dateStr, cell));
        cell.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectDate(dateStr, cell);
          }
        });
      } else {
        cell.setAttribute('aria-disabled', 'true');
        cell.setAttribute('aria-label', isPast ? `${d} ${MONTHS[month]} — past date` : `${d} ${MONTHS[month]} — unavailable`);
      }

      calGrid.appendChild(cell);
    }
  }

  function selectDate(dateStr, el) {
    selectedDate = dateStr;
    selectedTime = null;
    step2Next.disabled = true;

    calGrid.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');

    renderTimeSlots(dateStr);
  }

  function renderTimeSlots(dateStr) {
    timeSlotsHint && (timeSlotsHint.style.display = 'none');
    timeSlotsEl.innerHTML = '';

    const slots = VANTA.getTimeSlots(dateStr);
    slots.forEach(slot => {
      const btn = document.createElement('button');
      btn.className = 'time-slot' + (slot.available ? '' : ' unavailable');
      btn.textContent = slot.time;
      btn.disabled = !slot.available;
      btn.setAttribute('aria-label', slot.time + (slot.available ? '' : ' — unavailable'));

      if (slot.available) {
        btn.addEventListener('click', () => {
          timeSlotsEl.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedTime = slot.time;
          step2Next.disabled = false;
        });
      }

      timeSlotsEl.appendChild(btn);
    });
  }

  calPrev.addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  });

  calNext.addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  });

  /* ── Init ────────────────────────────────────────────────── */
  goToStep(1);
})();
