const track = document.querySelector(".carousel-track");
let currentSlide = 0;
const animeSlides = 5;
let autoSlideInterval;
const transitionDuration = 3000; // ms
const transitionStyle = "transform 0.5s ease-in-out";

// Navegación
document.getElementById("prev").onclick = () => moveSlide(-1);
document.getElementById("next").onclick = () => moveSlide(1);

function moveSlide(direction) {
    const slides = document.querySelectorAll(".carousel-slide");
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

const introSlide = track.querySelector(".intro");

// Mostrar skeletons
for (let i = 0; i < animeSlides; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "carousel-slide skeleton-slide";
    skeleton.innerHTML = `
        <div class="skeleton"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-text" style="width: 60%;"></div>
    `;
    introSlide.insertAdjacentElement("afterend", skeleton);
}

// Reemplazar con contenido real
const randomOffset = Math.floor(Math.random() * 1000);

fetch(`https://kitsu.io/api/edge/anime?page[offset]=${randomOffset}&page[limit]=${animeSlides}`)
    .then(res => res.json())
    .then(data => {
        const trending = data.data;
        // Eliminar skeletons
        const skeletons = document.querySelectorAll(".skeleton-slide");
        
        skeletons.forEach((skeleton, index) => {
            const anime = trending[index];
            if (!anime) return;

            const title = anime.attributes.titles.en_jp || anime.attributes.titles.ja_jp || "N/A";
            const image = anime.attributes.posterImage.medium;
            const rating = anime.attributes.averageRating || "N/A";
            const desc = anime.attributes.synopsis?.substring(0, 240) + "...";

            const content = `
                <img src="${image}" alt="${title}" />  
                <div style="display: flex; flex-direction: column; justify-content: space-around">
                    <h2>${title}</h2>
                    <p>${desc}</p>
                    <span style="color: var(--primary-color)">⭐ ${rating}</span>
                </div> 
            `;
            skeleton.classList.remove("skeleton-slide");
            skeleton.innerHTML = content;
        }); 

        setupInfiniteCarousel();
    });

/*let autoSlideInterval = setInterval(() => {
    moveSlide(1);
}, 3000);   
// Detener el auto-slide al interactuar
const carouselSection = document.querySelector('.description-carousel');
carouselSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
carouselSection.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => moveSlide(1), 3000);
});*/

// --- infinite carousel setup with clones ---
function setupInfiniteCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    console.log("Slides:", slides);
    const realSlides = Array.from(slides).filter(slide => !slide.classList.contains('clone'));
    const firstReal = realSlides[0]; // primer real (intro)
    const lastReal = realSlides[realSlides.length - 1];

    const firstClone = firstReal.cloneNode(true);
    const lastClone = lastReal.cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');

    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    currentSlide = 1;
    track.style.transition = "none";
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    setTimeout(() => {
        track.style.transition = transitionStyle;
    }, 50);

    track.addEventListener('transitionend', () => {
        const allSlides = document.querySelectorAll('.carousel-slide');
        const isClone = allSlides[currentSlide].classList.contains('clone');

        if (isClone) {
            track.style.transition = 'none';
            const goingToStart = allSlides[currentSlide].isSameNode(firstClone);
            currentSlide = goingToStart ? 1 : allSlides.length - 2;

            // Espera un frame para aplicar el cambio sin parpadeo
            requestAnimationFrame(() => {
                track.style.transform = `translateX(-${currentSlide * 100}%)`;

                // Rehabilitar transición en el siguiente ciclo
                requestAnimationFrame(() => {
                    track.style.transition = transitionStyle;
                });
            });
        }
    });


    // === auto-slide every 5 seconds ===
    autoSlideInterval = setInterval(() => moveSlide(1), transitionDuration);

    // Pause auto-slide on hover
    // and resume on mouse leave
    const carouselSection = document.querySelector('.description-carousel');
    carouselSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    carouselSection.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => moveSlide(1), transitionDuration);
    });
}
