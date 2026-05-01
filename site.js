/* The Only Humans — shared site script */

(function markActiveNav() {
  const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.topnav a[data-page]').forEach(a => {
    if (a.dataset.page === path || (path === '' && a.dataset.page === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

(function mailchimpForm() {
  const form = document.getElementById('mc-form');
  const msg = document.getElementById('mc-msg');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;
    msg.textContent = 'sending...';

    const action = form.action.replace('/post?', '/post-json?');
    const data = new URLSearchParams(new FormData(form)).toString();
    const cbName = 'mc_cb_' + Math.random().toString(36).slice(2);
    const url = `${action}&${data}&c=${cbName}`;

    const script = document.createElement('script');
    window[cbName] = (res) => {
      if (res.result === 'success') {
        msg.textContent = 'thank you — check your inbox.';
        form.reset();
      } else {
        const clean = (res.msg || 'something went wrong. please try again.').replace(/<[^>]*>/g, '');
        msg.textContent = clean;
      }
      delete window[cbName];
      script.remove();
    };
    script.src = url;
    script.onerror = () => { msg.textContent = 'something went wrong. please try again.'; };
    document.body.appendChild(script);
  });
})();
