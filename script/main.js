document.addEventListener("DOMContentLoaded", () => {
  // Функція для ініціалізації каруселі
  function initializeCarousel() {
    const carousel = document.querySelector('.screenshot-carousel');
    if (!carousel) return;
    
    const slidesContainer = carousel.querySelector('.carousel-inner');
    const slides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelector('.carousel-indicators');
    
    const totalSlides = slides.length;
    
    // Починаємо з центрального слайду (якщо є непарна кількість слайдів)
    let currentIndex = Math.floor(totalSlides / 2);
    
    // Створюємо індикатори (крапки) для кожного слайду
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      indicators.appendChild(dot);
    }
    
    // Встановлюємо позицію для кожного слайда
    function setupSlides() {
      slides.forEach((slide, index) => {
        slide.style.left = '0';
        slide.style.transform = 'translateX(0)';
        slide.classList.toggle('active', index === currentIndex);
      });
    }
    
    // Функція переходу до конкретного слайду
    function goToSlide(index) {
      currentIndex = index;
      updateSlidePositions();
      
      // Оновлюємо активні крапки
      const dots = indicators.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
// Оновлює позиції слайдів на основі поточного індексу
// Оновлює позиції слайдів на основі поточного індексу
function updateSlidePositions() {
  slides.forEach((slide, index) => {
    // Скидаємо всі активні класи
    slide.classList.remove('active');
    
    // Обчислюємо відносну позицію від поточного слайду
    const offset = index - currentIndex;
    const zIndex = totalSlides - Math.abs(offset);
    
    // Встановлюємо стилі для кожного слайду
    slide.style.zIndex = zIndex;
    
    // Оновлена логіка для показу обрізаних бокових слайдів
    if (offset === 0) {
      // Активний слайд
      slide.style.transform = 'translateX(0) scale(1)';
      slide.style.opacity = '1';
      slide.style.filter = 'blur(0) brightness(1)';
      slide.classList.add('active');
    } else if (Math.abs(offset) === 1) {
      // Бокові слайди (наступний і попередній) - показуємо частково
      const direction = offset > 0 ? 1 : -1;
      // Зміщуємо сильніше, щоб показати тільки край зображення
      slide.style.transform = `translateX(${direction * 65}%) scale(0.9)`;
      slide.style.opacity = '0.5';
      slide.style.filter = 'blur(3px) brightness(0.7)';
    } else {
      // Повністю ховаємо інші слайди
      const direction = offset > 0 ? 1 : -1;
      slide.style.transform = `translateX(${direction * 120}%) scale(0.8)`;
      slide.style.opacity = '0';
      slide.style.filter = 'blur(5px) brightness(0.5)';
    }
  });
}
    
    // Функція для переходу до наступного слайду
    function goToNextSlide() {
      if (currentIndex < totalSlides - 1) {
        goToSlide(currentIndex + 1);
      } else {
        // Плавне повернення до першого слайду
        goToSlide(0);
      }
    }
    
    // Функція для переходу до попереднього слайду
    function goToPrevSlide() {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else {
        // Плавне повернення до останнього слайду
        goToSlide(totalSlides - 1);
      }
    }
    
    // Додаємо обробники подій для кнопок
    nextButton.addEventListener('click', goToNextSlide);
    prevButton.addEventListener('click', goToPrevSlide);
    
    // Додаємо навігацію за допомогою клавіатури
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    });
    
    // Додаємо підтримку свайпів на сенсорних пристроях
    let touchStartX = 0;
    let touchEndX = 0;
    
    slidesContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slidesContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Свайп вліво - наступний слайд
        goToNextSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Свайп вправо - попередній слайд
        goToPrevSlide();
      }
    }
    
    // Автоматична зміна слайдів (опціонально)
    let autoplayInterval;
    
    function startAutoplay() {
      autoplayInterval = setInterval(goToNextSlide, 5000);
    }
    
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }
    
    // Зупиняємо автоматичну зміну при наведенні курсору або торканні
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
    carousel.addEventListener('touchend', startAutoplay, { passive: true });
    
    // Додаємо адаптивність при зміні розміру вікна
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Оновлюємо позицію слайдів
        updateSlidePositions();
      }, 250); // Затримка для уникнення занадто частих оновлень
    });
    
    // Перевіряємо, чи кнопки не перекриваються контентом
    function adjustButtonsPosition() {
      const carouselRect = carousel.getBoundingClientRect();
      const mainElement = document.querySelector('main');
      const mainRect = mainElement.getBoundingClientRect();
      
      // Перевіряємо, чи кнопки виходять за межі головного контейнера
      if (carouselRect.left < mainRect.left + 20) {
        prevButton.style.left = '10px';
      }
      
      if (carouselRect.right > mainRect.right - 20) {
        nextButton.style.right = '10px';
      }
    }
    
    // Викликаємо одразу та при зміні розміру вікна
    adjustButtonsPosition();
    window.addEventListener('resize', adjustButtonsPosition);
    
    // Ініціалізуємо початковий стан
    setupSlides();
    updateSlidePositions();
    
    // Запускаємо автоматичну зміну слайдів
    startAutoplay();
  }
  
  // Ініціалізуємо карусель
  initializeCarousel();
  
  // Кнопка "Наверх"
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });
    
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});