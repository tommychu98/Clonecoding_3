const initializeSwipers = () => {
    if (typeof window.Swiper === 'undefined') {
        return;
    }

    const heroSwiperElement = document.querySelector('.hero-swiper');

    if (!heroSwiperElement) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    new window.Swiper(heroSwiperElement, {
        slidesPerView: 1,
        slidesPerGroup: 1,
        loop: true,
        speed: prefersReducedMotion ? 0 : 300,
        autoplay: prefersReducedMotion
            ? false
            : {
                  delay: 4000,
                  disableOnInteraction: false,
              },
        navigation: {
            prevEl: heroSwiperElement.querySelector('.hero__control--prev'),
            nextEl: heroSwiperElement.querySelector('.hero__control--next'),
        },
        pagination: {
            el: heroSwiperElement.querySelector('.hero__pagination'),
            bulletElement: 'button',
            clickable: true,
        },
        watchOverflow: true,
    });
};

const initializeCon1Motion = () => {
    const sections = document.querySelectorAll('[data-con1-motion]');

    if (sections.length === 0) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    sections.forEach((section) => {
        section.classList.add('con1-motion-ready');
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        sections.forEach((section) => {
            section.classList.add('con1-motion-visible');
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
                    return;
                }

                entry.target.classList.add('con1-motion-visible');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.2,
        },
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
};

const initializeCon3Motion = () => {
    const section = document.querySelector('[data-con3-motion]');

    if (!section) {
        return;
    }

    const intro = section.querySelector('[data-con3-intro]');
    const cards = Array.from(section.querySelectorAll('[data-con3-card]'));
    const leftColumn = section.querySelector('[data-con3-column="left"]');
    const rightColumn = section.querySelector('[data-con3-column="right"]');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 1200px)');
    const supportsIntersectionObserver = 'IntersectionObserver' in window;

    section.classList.add('con3-motion-ready');

    cards.forEach((card) => {
        const isRightColumn = card.parentElement === rightColumn;
        card.style.setProperty('--con3-card-delay', isRightColumn ? '0.08s' : '0s');
    });

    if (reducedMotionQuery.matches || !supportsIntersectionObserver) {
        intro.classList.add('con3-intro-visible');
        cards.forEach((card) => card.classList.add('con3-card-visible'));
    } else {
        const introObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    intro.classList.add('con3-intro-visible');
                    introObserver.unobserve(entry.target);
                });
            },
            {
                rootMargin: '0px 0px -20% 0px',
                threshold: 0.1,
            },
        );

        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('con3-card-visible');
                    cardObserver.unobserve(entry.target);
                });
            },
            {
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.15,
            },
        );

        introObserver.observe(intro);
        cards.forEach((card) => cardObserver.observe(card));
    }

    if (!leftColumn || !rightColumn) {
        return;
    }

    const columns = [leftColumn, rightColumn];
    let progress = 0;
    let distances = [0, 0];
    let scrollDistance = 0;

    const renderScroll = () => {
        columns.forEach((column) => {
            column.style.setProperty('--con3-scroll-y', `${-scrollDistance * progress}px`);
        });
    };

    const measureScroll = () => {
        columns.forEach((column) => column.style.setProperty('--con3-scroll-y', '0px'));

        if (!desktopQuery.matches) {
            progress = 0;
            distances = [0, 0];
            scrollDistance = 0;
            return;
        }

        const sectionRect = section.getBoundingClientRect();
        // Move both columns equally so the stagger remains at every scroll position.
        distances = columns.map((column) => {
            const top = column.getBoundingClientRect().top - sectionRect.top;
            return Math.max(0, top + column.offsetHeight - sectionRect.height + 40);
        });
        scrollDistance = Math.max(...distances);
        renderScroll();
    };

    section.addEventListener('wheel', (event) => {
        if (!desktopQuery.matches || event.ctrlKey || !event.cancelable || scrollDistance === 0) {
            return;
        }

        if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) {
            return;
        }

        // At either end, let the next wheel event continue scrolling the page.
        if ((event.deltaY > 0 && progress >= 1) || (event.deltaY < 0 && progress <= 0)) {
            return;
        }

        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? section.clientHeight : 1;
        event.preventDefault();
        progress = Math.min(1, Math.max(0, progress + (event.deltaY * unit) / scrollDistance));
        renderScroll();
    }, { passive: false });

    window.addEventListener('resize', measureScroll, { passive: true });
    desktopQuery.addEventListener('change', measureScroll);
    if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(measureScroll);
        resizeObserver.observe(section);
        columns.forEach((column) => resizeObserver.observe(column));
    }
    measureScroll();
};

const initializeNavActiveState = () => {
    const navLinks = Array.from(document.querySelectorAll('#nav .nav__link'));

    if (navLinks.length === 0) {
        return;
    }

    const setActiveLink = (selectedLink) => {
        navLinks.forEach((link) => {
            const isActive = link === selectedLink;

            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const initialActiveLink = navLinks.find((link) => link.classList.contains('active')) || navLinks[0];
    setActiveLink(initialActiveLink);

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setActiveLink(link);
        });

        link.addEventListener('keydown', (event) => {
            if (event.key !== ' ' && event.key !== 'Spacebar') {
                return;
            }

            event.preventDefault();
            setActiveLink(link);
        });
    });
};

document.addEventListener('DOMContentLoaded', initializeSwipers);
document.addEventListener('DOMContentLoaded', initializeCon1Motion);
document.addEventListener('DOMContentLoaded', initializeCon3Motion);
document.addEventListener('DOMContentLoaded', initializeNavActiveState);
