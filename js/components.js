fetch('Components/animacion/Animacion.html')
.then(response => response.text())
.then(data => {
    document.getElementById('animacion').innerHTML = data;

    // var btn = document.querySelector(".search-button");
    // btn.addEventListener('click', function(event){
    //     event.preventDefault();
    
    //     var search = document.querySelector(".search-input").value;
    //     if (search) {
    //         localStorage.setItem("search", search);
    //         window.location.href = "products.html";
    //     }
    // })
});