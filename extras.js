/* extras.js - wires up project demo links, WhatsApp contact item and a working contact form */
document.addEventListener('DOMContentLoaded', function () {
  const EMAIL = 'adigital1001@gmail.com', PHONE = '923100576674';

  // 1. Project "Live Demo" buttons -> projects/<name>.html (same order as the cards)
  const pages = ['restaurant', 'finance', 'shop', 'fitness', 'weather', 'gallery'];
  document.querySelectorAll('.project-card').forEach(function (card, i) {
    const a = card.querySelector('.btn--primary');
    if (a && pages[i]) { a.href = 'projects/' + pages[i] + '.html'; a.target = '_blank'; a.rel = 'noopener'; }
    // Real screenshot of the project instead of the colour block
    const box = card.querySelector('.project-card__image');
    if (box && pages[i]) {
      box.style.background = "url('images/" + pages[i] + ".jpg') top center / cover no-repeat";
    }
  });
  const sub = document.querySelector('#projects .section__subtitle');
  if (sub) sub.textContent = 'A mix of practice builds and client-style projects. Click Live Demo to open any of them.';

  // 2. WhatsApp item (same number as phone)
  const tel = document.querySelector('a[href^="tel:"]');
  const item = tel && tel.closest('.contact__info-item');
  if (item) {
    const w = item.cloneNode(true);
    w.querySelector('.contact__info-label').textContent = 'WhatsApp';
    const a = w.querySelector('a');
    a.href = 'https://wa.me/' + PHONE; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Chat on WhatsApp';
    item.after(w);
  }

  // 3. Contact form: runs before the demo handler in script.js and really sends the email
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'contactForm') return;
    e.preventDefault(); e.stopPropagation();
    const f = e.target, g = function (id) { return f.querySelector('#' + id); };
    const st = g('formStatus'), btn = f.querySelector('button[type="submit"]'), lb = btn.querySelector('.btn__label');
    const v = { name: g('name').value.trim(), email: g('email').value.trim(), message: g('message').value.trim() };
    const errs = {
      name: v.name ? '' : 'Please enter your name.',
      email: re.test(v.email) ? '' : 'Please enter a valid email address.',
      message: v.message.length >= 10 ? '' : 'Message should be at least 10 characters.'
    };
    Object.keys(errs).forEach(function (k) {
      g(k + 'Error').textContent = errs[k];
      g(k).closest('.form-group').classList.toggle('has-error', !!errs[k]);
    });
    if (errs.name || errs.email || errs.message) {
      st.textContent = 'Please fix the highlighted fields.'; st.className = 'form-status error'; return;
    }
    const old = lb.textContent; btn.disabled = true; lb.textContent = 'Sending...';
    fetch('https://formsubmit.co/ajax/' + EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: v.name, email: v.email, message: v.message, _subject: 'New portfolio message from ' + v.name, _replyto: v.email, _template: 'table' })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.success === true || d.success === 'true') {
        st.textContent = "Thanks! Your message has been sent. I'll reply soon."; st.className = 'form-status success'; f.reset();
      } else { throw new Error('fail'); }
    }).catch(function () {
      st.textContent = "Couldn't send right now. Please WhatsApp or email me directly."; st.className = 'form-status error';
    }).finally(function () { btn.disabled = false; lb.textContent = old; });
  }, true);
});
