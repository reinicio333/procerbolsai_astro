document.addEventListener('DOMContentLoaded', function () {
  let flipbookInstance = null;
  let isFlipbookInitialized = false;

  // Función para inicializar el flipbook
  function initFlipbook() {
    if (!isFlipbookInitialized) {
      try {
        flipbookInstance = $('#df_manual_book').flipBook({
          scrollWheel: false,
          enableDownload: false,
          enableFullscreen: false,
          autoEnableOutline: false,
          autoEnableThumbnail: false,
          soundEnable: false,
          hard: "none",
          pageMode: 1,
          backgroundColor: "none",
          template: {
            html: './assets/templates/default-book-view.html',
            styles: [
              './assets/templates/default-book-view.css'
            ],
            links: [
              './assets/templates/font-awesome.min.css'
            ],
            script: './assets/templates/default-book-view.js'
          }
        });
        isFlipbookInitialized = true;
      } catch (error) {
        console.error('Error al inicializar flipbook:', error);
      }
    }
  }

  // Función para limpiar el flipbook
  function cleanupFlipbook() {
    try {
      // Remover eventos globales que puedan estar activos
      $(document).off('keydown.flipbook');
      $(document).off('wheel.flipbook');
      $(window).off('resize.flipbook');
      
      // Ocultar cualquier elemento flotante del flipbook
      $('.df-ui, .df-lightbox, .df-tooltip').hide();
      
      // Remover cualquier elemento overlay que pueda quedar
      $('.df-ui-overlay, .df-backdrop').remove();
      
    } catch (error) {
      // Silenciar errores de limpieza
    }
  }

  // Control del modal
  const modal = document.getElementById('default-modal');
  const modalToggle = document.querySelector('[data-modal-toggle="default-modal"]');
  const modalClose = document.querySelector('[data-modal-hide="default-modal"]');

  // Abrir modal
  modalToggle.addEventListener('click', function () {
    document.body.classList.add('modal-open');
    
    // Inicializar flipbook después de que el modal se haya mostrado
    setTimeout(() => {
      initFlipbook();
      
      // Forzar redimensionamiento
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 500);
    }, 200);
  });

  // Función para cerrar modal
  function closeModal() {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    
    // Limpiar flipbook
    cleanupFlipbook();
    
    // Restaurar focus
    setTimeout(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      
      // Asegurar que no hay elementos canvas flotantes
      $('canvas').each(function() {
        if ($(this).closest('#default-modal').length === 0) {
          const rect = this.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            $(this).css('pointer-events', 'none');
          }
        }
      });
    }, 100);
  }

  // Event listeners para cerrar modal
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Cerrar modal con ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Cerrar modal haciendo clic fuera
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Observar cambios en el modal usando MutationObserver
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const modal = mutation.target;
        if (modal.classList.contains('hidden')) {
          setTimeout(() => {
            cleanupFlipbook();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
          }, 100);
        }
      }
    });
  });

  observer.observe(modal, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Actualizar margen del navbar
  const updateMargin = () => {
    const navbar = document.querySelector('nav');
    const content = document.querySelector('#content-container');
    if (navbar && content) {
      content.style.paddingTop = `${navbar.offsetHeight}px`;
    }
  };

  updateMargin();
  window.addEventListener('resize', updateMargin);
});