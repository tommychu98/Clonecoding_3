const preventEmptyLinks = () => {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href="#"]');

        if (!link) return;

        event.preventDefault();
    });
};

const setSvgPathLength = () => {
    document.querySelectorAll('.svgAni path').forEach((path) => {
        const totalLength = path.getTotalLength();

        path.style.strokeDasharray = totalLength;
    });
};

const initMenu = () => {
    const menuWrap = document.querySelector('.menuOpen .menuWrap');
    const openButton = document.querySelector('.menuOpen button.open');
    const closeButtons = document.querySelectorAll('.menuOpen .menuWrap .close');

    if (!menuWrap || !openButton) return;

    openButton.addEventListener('click', () => {
        menuWrap.classList.add('on');
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            menuWrap.classList.remove('on');
        });
    });
};

const applyAnimationOptions = (target) => {
    const { duration, delay, iteration } = target.dataset;

    if (duration) {
        target.style.webkitAnimationDuration = duration;
        target.style.animationDuration = duration;
    }

    if (delay) {
        target.style.webkitAnimationDelay = delay;
        target.style.animationDelay = delay;
    }

    if (iteration) {
        target.style.webkitAnimationIterationCount = iteration;
        target.style.animationIterationCount = iteration;
    }
};

const isInViewport = (target) => {
    const offset = Number(target.dataset.offset) || 0;
    const rect = target.getBoundingClientRect();
    const top = rect.top + offset;
    const bottom = rect.bottom - offset;

    return bottom >= 0 && top <= window.innerHeight;
};

const showAnimation = (target) => {
    const animateClass = target.dataset.animate;

    target.style.visibility = 'visible';
    target.classList.add('animated');

    if (animateClass) {
        target.classList.add(animateClass);
    }
};

const hideAnimation = (target) => {
    const animateClass = target.dataset.animate;

    target.style.visibility = 'hidden';
    target.classList.remove('animated');

    if (animateClass) {
        target.classList.remove(animateClass);
    }
};

const initScrollAnimation = () => {
    const targets = document.querySelectorAll('.animate');
    let ticking = false;

    targets.forEach((target) => {
        applyAnimationOptions(target);
    });

    const updateAnimation = () => {
        targets.forEach((target) => {
            if (isInViewport(target)) {
                showAnimation(target);
            } else {
                hideAnimation(target);
            }
        });
    };

    const requestUpdate = () => {
        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(() => {
            updateAnimation();
            ticking = false;
        });
    };

    window.addEventListener('scroll', requestUpdate);
    window.addEventListener('resize', requestUpdate);
    updateAnimation();
};

const initBackgroundColor = () => {
    const updateBackground = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const isActive = scrollTop > 1400 && scrollTop <= 2700;

        document.body.classList.toggle('on', isActive);
    };

    window.addEventListener('scroll', updateBackground);
    window.addEventListener('resize', updateBackground);
    updateBackground();
};

(() => {
    preventEmptyLinks();
    setSvgPathLength();
    initMenu();
    initScrollAnimation();
    initBackgroundColor();
})();
