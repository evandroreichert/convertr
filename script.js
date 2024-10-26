const slider = document.querySelector('.slider');
    const cards = document.querySelectorAll('.card');
    const indicatorsContainer = document.querySelector('.indicators');

    let startX;
    let currentX;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let currentIndex = 0;
    let animationID;

    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('indicator');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      indicatorsContainer.appendChild(dot);
    });

    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchmove', touchMove);
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mousemove', touchMove);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);

    function touchStart(event) {
      startX = getPositionX(event);
      isDragging = true;
      animationID = requestAnimationFrame(animation);
    }

    function touchMove(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startX;
      }
    }

    function touchEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);

      const movedBy = currentTranslate - prevTranslate;
      
      if (Math.abs(movedBy) > 100) {
        if (movedBy > 0 && currentIndex > 0) {
          currentIndex--;
        } else if (movedBy < 0 && currentIndex < cards.length - 1) {
          currentIndex++;
        }
      }

      goToSlide(currentIndex);
    }

    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
      slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function goToSlide(index) {
      currentIndex = index;
      const slideWidth = cards[0].offsetWidth;
      currentTranslate = prevTranslate = -index * slideWidth;
      setSliderPosition();
      updateIndicators();
    }

    function updateIndicators() {
      document.querySelectorAll('.indicator').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    window.addEventListener('resize', () => {
      goToSlide(currentIndex);
    });