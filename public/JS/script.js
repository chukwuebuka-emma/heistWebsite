
/* =========================================
   HEIST® — COMPLETE INTERACTIVE EXPERIENCE
   Lagos After Dark
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       PAGE LOADER
    ====================================== */

    const loader = document.getElementById("loader");

    if (loader) {
        setTimeout(() => {
            loader.classList.add("hide");
            document.body.classList.remove("loading");
        }, 1600);
    } else {
        document.body.classList.remove("loading");
    }


    /* =====================================
       MOBILE NAVIGATION
    ====================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mobileMenu.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));

            document.body.style.overflow = isOpen ? "hidden" : "";

        });

        mobileMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");

                document.body.style.overflow = "";

            });

        });

    }


    /* =====================================
       REDUCED MOTION ACCESSIBILITY
    ====================================== */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================
       ANIMATION STYLES
    ====================================== */

    const animationStyles = document.createElement("style");

    animationStyles.textContent = `

        /* GENERAL REVEAL */

        .heist-reveal {
            opacity: 0;
            transform: translateY(40px);
            transition:
                opacity .9s ease,
                transform .9s cubic-bezier(.2,.7,.2,1);
            transition-delay: var(--heist-delay, 0ms);
        }

        .heist-reveal.heist-visible {
            opacity: 1;
            transform: translateY(0);
        }


        /* HERO ANIMATIONS */

        .hero-content,
        .collection-hero-content {
            animation: heistHeroEnter 1.2s ease forwards;
        }

        .about-hero-title {
            animation: heistHeroEnter 1.2s ease .2s both;
        }

        @keyframes heistHeroEnter {
            from {
                opacity: 0;
                transform: translateY(35px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }


        /* ABOUT PAGE IMAGE REVEALS */

        .about-city-image,
        .about-full-image img {
            transition: transform 1.2s cubic-bezier(.2,.7,.2,1);
        }

        .about-city-image.heist-reveal {
            transform: scale(1.08);
        }

        .about-city-image.heist-visible {
            transform: scale(1);
        }

        .about-full-image.heist-reveal img {
            transform: scale(1.08);
        }

        .about-full-image.heist-visible img {
            transform: scale(1);
        }


        /* COLLECTION PAGE */

        .product-image {
            transition:
                transform .7s cubic-bezier(.2,.7,.2,1),
                filter .7s ease;
        }

        .product-card:hover .product-image {
            transform: scale(1.025);
            filter: brightness(1.08);
        }

        .collection-editorial-image {
            transition: transform 1.2s ease;
        }

        .collection-editorial:hover .collection-editorial-image {
            transform: scale(1.025);
        }


        /* REDUCED MOTION */

        @media (prefers-reduced-motion: reduce) {

            .heist-reveal {
                opacity: 1;
                transform: none;
                transition: none;
            }

            .hero-content,
            .collection-hero-content,
            .about-hero-title {
                animation: none;
            }

            .product-image,
            .collection-editorial-image,
            .about-city-image,
            .about-full-image img {
                transition: none;
                transform: none;
            }

        }

    `;

    document.head.appendChild(animationStyles);


    /* =====================================
       SCROLL REVEAL ANIMATIONS
    ====================================== */

    const revealSelectors = [

        ".reveal",

        ".manifesto-heading",
        ".manifesto-bottom",
        ".about-city-content",
        ".about-city-image",
        ".about-full-image",
        ".about-full-image-text",
        ".values-header",
        ".value-item",
        ".about-closing-content",

        ".collection-intro",
        ".products-heading",
        ".product-card",
        ".collection-editorial-content",
        ".collection-closing"

    ];

    const revealElements = document.querySelectorAll(
        revealSelectors.join(",")
    );

    revealElements.forEach((element, index) => {

        element.classList.add("heist-reveal");

        if (element.classList.contains("product-card")) {
            element.style.setProperty(
                "--heist-delay",
                `${(index % 2) * 120}ms`
            );
        }

    });

    if (reduceMotion) {

        revealElements.forEach(element => {
            element.classList.add("heist-visible");
        });

    } else if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("heist-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("heist-visible");
        });

    }


    /* =====================================
       HERO VIDEO
    ====================================== */

    const heroVideo = document.querySelector(".hero-video");

    if (heroVideo) {

        heroVideo.muted = true;

        const playVideo = () => {

            const playPromise = heroVideo.play();

            if (playPromise !== undefined) {

                playPromise.catch(() => {
                    heroVideo.classList.add("video-fallback");
                });

            }

        };

        playVideo();

        heroVideo.addEventListener("error", () => {
            heroVideo.classList.add("video-fallback");
        });

    }


    /* =====================================
       COLLECTION HERO PARALLAX
    ====================================== */

    const collectionHeroImage = document.querySelector(
        ".collection-hero-image"
    );

    if (collectionHeroImage && !reduceMotion) {

        let ticking = false;

        window.addEventListener("scroll", () => {

            if (ticking) return;

            ticking = true;

            requestAnimationFrame(() => {

                const scrollPosition = window.scrollY;

                if (scrollPosition < window.innerHeight) {

                    collectionHeroImage.style.transform =
                        `translateY(${scrollPosition * 0.12}px) scale(1)`;

                }

                ticking = false;

            });

        }, { passive: true });

    }


    /* =====================================
       IMAGE LIGHTBOX
    ====================================== */

    const galleryImages = document.querySelectorAll(
        ".campaign-gallery img, .campaign-image img"
    );

    if (galleryImages.length > 0) {

        const lightbox = document.createElement("div");

        lightbox.className = "heist-lightbox";

        lightbox.innerHTML = `

            <button class="lightbox-close" aria-label="Close image viewer">
                &times;
            </button>

            <button class="lightbox-prev" aria-label="Previous image">
                &#10094;
            </button>

            <img class="lightbox-image" src="" alt="">

            <button class="lightbox-next" aria-label="Next image">
                &#10095;
            </button>

        `;

        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector(".lightbox-image");
        const closeButton = lightbox.querySelector(".lightbox-close");
        const prevButton = lightbox.querySelector(".lightbox-prev");
        const nextButton = lightbox.querySelector(".lightbox-next");

        let currentImageIndex = 0;

        const openLightbox = index => {

            currentImageIndex = index;

            const image = galleryImages[currentImageIndex];

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt || "HEIST campaign image";

            lightbox.classList.add("active");

            document.body.style.overflow = "hidden";

        };

        const closeLightbox = () => {

            lightbox.classList.remove("active");

            document.body.style.overflow = "";

        };

        const changeImage = direction => {

            currentImageIndex =
                (currentImageIndex + direction + galleryImages.length)
                % galleryImages.length;

            openLightbox(currentImageIndex);

        };

        galleryImages.forEach((image, index) => {

            image.style.cursor = "pointer";

            image.addEventListener("click", () => {
                openLightbox(index);
            });

        });

        closeButton.addEventListener("click", closeLightbox);

        prevButton.addEventListener("click", () => {
            changeImage(-1);
        });

        nextButton.addEventListener("click", () => {
            changeImage(1);
        });

        lightbox.addEventListener("click", event => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });

        document.addEventListener("keydown", event => {

            if (!lightbox.classList.contains("active")) return;

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowRight") {
                changeImage(1);
            }

            if (event.key === "ArrowLeft") {
                changeImage(-1);
            }

        });


        /* LIGHTBOX DESIGN */

        const lightboxStyles = document.createElement("style");

        lightboxStyles.textContent = `

            .heist-lightbox {
                position: fixed;
                inset: 0;
                z-index: 99999;
                background: rgba(0,0,0,.96);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: .35s ease;
                padding: 60px 70px;
            }

            .heist-lightbox.active {
                opacity: 1;
                visibility: visible;
            }

            .lightbox-image {
                max-width: 90%;
                max-height: 85vh;
                object-fit: contain;
            }

            .heist-lightbox button {
                position: absolute;
                border: none;
                background: none;
                color: white;
                cursor: pointer;
                font-size: 35px;
                padding: 10px;
            }

            .lightbox-close {
                top: 20px;
                right: 30px;
            }

            .lightbox-prev {
                left: 20px;
                top: 50%;
            }

            .lightbox-next {
                right: 20px;
                top: 50%;
            }

            .heist-lightbox button:hover {
                color: #e33b32;
            }

            @media(max-width:600px) {

                .heist-lightbox {
                    padding: 50px 15px;
                }

                .lightbox-image {
                    max-width: 100%;
                    max-height: 75vh;
                }

                .lightbox-prev {
                    left: 2px;
                }

                .lightbox-next {
                    right: 2px;
                }

            }

        `;

        document.head.appendChild(lightboxStyles);

    }


    /* =====================================
       HEIST® CONSOLE SIGNATURE
    ====================================== */

    console.log(
        "%c HEIST® — LAGOS AFTER DARK ",
        "background:#080808;color:#e33b32;font-size:16px;font-weight:bold;padding:12px;"
    );

});
