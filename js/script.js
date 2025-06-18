/* * Toggle Dark Mode */
const toggleBtn = document.getElementById('toggle-theme');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        toggleBtn.textContent = 'Light Mode';
    } else {
        toggleBtn.textContent = 'Dark Mode';
    }
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

/* Form for searching anime or manga */
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
    // Clear previous results
const result = document.getElementById('search-results');
result.innerHTML = '';
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Prevent form submission
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        // Fetch data from Kitsu API
        fetchAnimeData(animeUrl + `?filter[text]=${searchQuery}`, displaySearchData);
       // fetchAnimeData(mangaUrl + `?filter[text]=${searchQuery}`, displaySearchData);
    } else {
        result.innerHTML = `
        <p class="error-message">Por favor, ingresa un término de búsqueda.</p>`; 
        
    }
    searchInput.value = ''; 
    result.scrollIntoView({ behavior: 'smooth' }); 
});

/* Get data from Kitsu API */
const basicUrl = `https://kitsu.io/api/edge`;
const animeUrl = basicUrl + `/anime`;
const mangaUrl = basicUrl + `/manga`;

const animeTrendingUrl = `${basicUrl}/trending/anime`;
const mangasTrendingUrl = `${basicUrl}/trending/manga`;

const limit = '?page[limit]=5&page[offset]=0';

async function fetchAnimeData(url, callback) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        //displayAnimeData(data);
        callback(data)
    } catch (error) {
        console.error('Error fetching anime data:', error);
    }
}

/* --- Display data from Kitsu API --- */
function displayAnimeData(data) {
    const apiDataDiv = document.getElementById('api-data');
    apiDataDiv.innerHTML = '';
    const featured = data.data[0];
    const others = data.data.slice(1); 


    // first anime
    const featuredCard = document.createElement('article');
    featuredCard.classList.add('anime-featured');
    featuredCard.innerHTML = `
        <img src="${featured.attributes.posterImage.medium}" alt="${featured.attributes.titles.en}">
        <div class="anime-info">
            <span> ⭐ ${featured.attributes.averageRating || 'N/A'}</span>
            <h3>${featured.attributes.titles.en_jp || featured.attributes.titles.ja_jp}</h3>
            <p>${featured.attributes.synopsis || 'No hay sinopsis disponible'}</p>
        </div>
    `;
    apiDataDiv.appendChild(featuredCard);

    // other animes
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('anime-grid');

    others.forEach(anime => {
        const animeCard = document.createElement('article');
        animeCard.classList.add('trending-card');
        animeCard.innerHTML = `
            <img src="${anime.attributes.posterImage.medium}" alt="${anime.attributes.titles.en}">
            <h3>${anime.attributes.titles.en_jp || anime.attributes.titles.ja_jp}</h3>
            <span> ⭐ ${anime.attributes.averageRating || 'N/A'}</span>

        `;
        gridContainer.appendChild(animeCard);
    });
    apiDataDiv.appendChild(gridContainer);
}

function displaySearchData(data) {
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = '';

    data.data.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        animeCard.innerHTML = `
            <img src="${anime.attributes.posterImage.medium}" alt="${anime.attributes.titles.en}">
            <div class="anime-info">
                <h3>${anime.attributes.titles.en_jp || anime.attributes.titles.ja_jp}</h3>
                <p>${anime.attributes.synopsis || 'No hay sinopsis disponible'}</p>
                <div class="anime-meta">
                    <span>${anime.attributes.startDate || 'Fecha de inicio desconocida'}</span>
                    <span>${anime.attributes.endDate || 'Fecha de finalización desconocida'}</span>
                                    <span>${anime.attributes.ageRating || 'Sin clasificación'}</span>
                <span>${anime.attributes.subtype || 'Sin tipo'}</span>
                <span>${anime.attributes.status || 'Estado desconocido'}</span>
                </div>
            </div>
        `;
        searchResultsDiv.appendChild(animeCard);
    });
}

// Llamada a la API de Kitsu
fetchAnimeData(animeTrendingUrl , displayAnimeData);