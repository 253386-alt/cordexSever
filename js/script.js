document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');

  function setSidebar(open) {
    if (!sidebar || !overlay) return;
    
    sidebar.classList.toggle('sidebar--open', open);
    overlay.classList.toggle('overlay--show', open);
    sidebar.setAttribute('aria-hidden', !open);
    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', open);
    }
    document.body.classList.toggle('no-scroll', open);
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar.classList.contains('sidebar--open');
      setSidebar(!isOpen);
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => setSidebar(false));
  }

  if (overlay) {
    overlay.addEventListener('click', () => setSidebar(false));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setSidebar(false);
  });

  // Cerrar el sidebar al hacer clic en un enlace
  if (sidebar) {
    sidebar.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        setSidebar(false);
        // Permite que la navegación a otra página (.html) fluya de forma natural
      });
    });
  }
});