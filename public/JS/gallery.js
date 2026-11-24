
/* =====================================================
   HEIST® — PRODUCT GALLERY SYSTEM
===================================================== */

(() => {

    const gallery = document.getElementById("productLightbox");

    if (!gallery) return;

    const triggers = document.querySelectorAll(".product-gallery-trigger");

    const image = document.getElementById("lightboxImage");
    const title = document.getElementById("lightboxTitle");
    const counter = document.getElementById("lightboxCounter");

    const closeButton = document.getElementById("lightboxClose");
    const previousButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");

    let currentImages = [];
    let currentIndex = 0;
    let lastFocusedElement = null;

    let touchStartX = 0;
    let touchEndX = 0;


    /* OPEN PRODUCT GALLERY */

    function openGallery(product) {

        currentImages = product.dataset.images
            .split("|")
            .map(path => path.trim())
            .filter(Boolean);

        if (!currentImages.length) return;

        currentIndex = 0;

        lastFocusedElement = product;

        title.textContent = product.dataset.title || "HEIST® PRODUCT";

        gallery.classList.add("active");
        gallery.setAttribute("aria-hidden", "false");

        document.body.classList.add("gallery-open");

        showImage();

        closeButton.focus();
    }


    /* DISPLAY CURRENT IMAGE */

    function showImage() {

        if (!currentImages.length) return;

        image.style.opacity = "0";

        const nextImage = new Image();

        nextImage.onload = () => {
            image.src = nextImage.src;
            image.alt = title.textContent + " — Image " + (currentIndex + 1);
            image.style.opacity = "1";
        };

        nextImage.onerror = () => {
            image.alt = "Image unavailable";
            image.style.opacity = "1";
            console.error("Could not load gallery image:", currentImages[currentIndex]);
        };

        nextImage.src = currentImages[currentIndex];

        counter.textContent =
            String(currentIndex + 1).padStart(2, "0") +
            " / " +
            String(currentImages.length).padStart(2, "0");

        previousButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === currentImages.length - 1;
    }


    /* NEXT IMAGE */

    function nextImage() {

        if (currentIndex < currentImages.length - 1) {
            currentIndex++;
            showImage();
        }

    }


    /* PREVIOUS IMAGE */

    function previousImage() {

        if (currentIndex > 0) {
            currentIndex--;
            showImage();
        }

    }


    /* CLOSE GALLERY */

    function closeGallery() {

        gallery.classList.remove("active");
        gallery.setAttribute("aria-hidden", "true");

        document.body.classList.remove("gallery-open");

        image.src = "";
        currentImages = [];

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }

    }


    /* PRODUCT CLICK EVENTS */

    triggers.forEach(product => {

        product.addEventListener("click", () => {
            openGallery(product);
        });

    });


    /* NAVIGATION BUTTONS */

    nextButton.addEventListener("click", nextImage);

    previousButton.addEventListener("click", previousImage);

    closeButton.addEventListener("click", closeGallery);


    /* CLOSE WHEN CLICKING OUTSIDE THE IMAGE */

    gallery.addEventListener("click", event => {

        if (event.target === gallery) {
            closeGallery();
        }

    });


    /* KEYBOARD CONTROLS */

    document.addEventListener("keydown", event => {

        if (!gallery.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeGallery();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

    });


    /* MOBILE SWIPE CONTROLS */

    gallery.addEventListener("touchstart", event => {

        touchStartX = event.changedTouches[0].screenX;

    }, { passive: true });


    gallery.addEventListener("touchend", event => {

        touchEndX = event.changedTouches[0].screenX;

        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) < 50) return;

        if (difference > 0) {
            nextImage();
        } else {
            previousImage();
        }

    }, { passive: true });


})();
x