const track = document.querySelector(".carousel-track");
let currentSlide = 0;

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
for (let i = 0; i < 3; i++) {
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

fetch(`https://kitsu.io/api/edge/anime?page[offset]=${randomOffset}&page[limit]=3`)
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
    
    });
