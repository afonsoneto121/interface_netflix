$(document).ready( async ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const str_seach = urlParams.get('movie');
    
    const results = await getSeach(str_seach);
    
    owlSearch(results)
    $('#carousel-owl-search').on('click', function(event) {
        const id = event.target.name;
        window.location.href = `../../html/detalhes.html?id=${id}`;
    });
});

async function getSeach(value) {
    const token = sessionStorage.getItem('chave');
    const urlAPI = 'https://api.themoviedb.org/3';
    const urlTrendindWeek = '/search/movie';
    var header = {
        'Content-Type':'application/json;charset=utf-8',        
    }
    if(!token) return {}

    const data = await fetch(`${urlAPI}${urlTrendindWeek}?api_key=${token}&language=pt-BR&query=${value}`,header)
            .then(response => {
                return response.blob()
            })
            .then(blob => {
                return blob.text()
            })
            .then(text => {
                let movieJSON = JSON.parse(text);
                return movieJSON;
            })
    let {results} = data;
    const date_filter = results.filter(item => {
        if(item.poster_path) {
            return item;
        }
    })
    return date_filter;

}

async function owlSearch(value) {
    for (let index = 0; index < value.length; index++) {
        let path = `https://image.tmdb.org/t/p/w500${value[index].poster_path}`;
        $('#carousel-owl-search').trigger('add.owl.carousel', [`<div class="item"> <img class="box-filme" src="${path}" name=${value[index].id}>  </div>`])
        .trigger('refresh.owl.carousel');
    }
}
