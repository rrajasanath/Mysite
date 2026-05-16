document.addEventListener("DOMContentLoaded", function () {

    /* ----- NAVIGATION BAR FUNCTION ----- */
    function myMenuFunction() {
        var menuBtn = document.getElementById("myNavMenu");
        menuBtn.classList.toggle("responsive");
    }

    /* ----- ADD SHADOW ON NAVIGATION BAR WHILE SCROLLING ----- */
    window.addEventListener('scroll', throttle(headerShadow, 100));
    function headerShadow() {
        const navHeader = document.getElementById("header");
        if (window.scrollY > 50) {
            navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
            navHeader.style.height = "70px";
            navHeader.style.lineHeight = "70px";
        } else {
            navHeader.style.boxShadow = "none";
            navHeader.style.height = "90px";
            navHeader.style.lineHeight = "90px";
        }
    }

    /* ----- TYPING EFFECT ----- */
    if (typeof Typed !== "undefined") {
        var typingEffect = new Typed(".typedText", {
            strings: ["Video Editor", "Photographer", "Student"],
            loop: true,
            typeSpeed: 100,
            backSpeed: 80,
            backDelay: 2000
        });
    } else {
        console.warn("Typed.js is not defined.");
    }

    /* ----- SCROLL REVEAL ANIMATION ----- */
    if (typeof ScrollReveal !== "undefined") {
        const sr = ScrollReveal({
            origin: 'top',
            distance: '80px',
            duration: 2000,
            reset: true
        });

        /* -- HOME -- */
        sr.reveal('.featured-text-card', {});
        sr.reveal('.featured-name', { delay: 100 });
        sr.reveal('.featured-text-info', { delay: 200 });
        sr.reveal('.featured-text-btn', { delay: 200 });
        sr.reveal('.social_icons', { delay: 200 });
        sr.reveal('.featured-image', { delay: 300 });

        /* -- PROJECT BOX -- */
        sr.reveal('.project-box', { interval: 200 });

        /* -- HEADINGS -- */
        sr.reveal('.top-header', {});

        /* ----- SCROLL REVEAL LEFT_RIGHT ANIMATION ----- */
        const srLeft = ScrollReveal({
            origin: 'left',
            distance: '80px',
            duration: 2000,
            reset: true
        });
        srLeft.reveal('.about-info', { delay: 100 });
        srLeft.reveal('.contact-info', { delay: 100 });

        const srRight = ScrollReveal({
            origin: 'right',
            distance: '80px',
            duration: 2000,
            reset: true
        });
        srRight.reveal('.skills-box', { delay: 100 });
        srRight.reveal('.form-control', { delay: 100 });
    } else {
        console.warn("ScrollReveal is not defined.");
    }

    /* ----- CHANGE ACTIVE LINK ----- */
    const sections = document.querySelectorAll('section[id]');
    function scrollActive() {
        const scrollY = window.scrollY;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 50;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active-link');
                } else {
                    link.classList.remove('active-link');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);

    /* ----- DOWNLOAD CV BUTTON ----- */
    const cvButton = document.getElementById("cvButton");
    if (cvButton) {
        cvButton.addEventListener("click", function () {
            window.location.href = "SanathEN.pdf";
        });
    }

    /* ----- THEME TOGGLE FUNCTION (Fixes White Box Issue) ----- */
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    if (themeToggle) {
        // Apply saved theme preference
        if (localStorage.getItem("theme") === "dark") {
            enableDarkMode();
        }

        themeToggle.addEventListener("click", function () {
            if (body.classList.contains("dark-mode")) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    function enableDarkMode() {
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="uil uil-sun"></i>';
    }

    function disableDarkMode() {
        body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = '<i class="uil uil-moon"></i>';
    }

    /* ----- THROTTLE SCROLL FUNCTION ----- */
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }
});
