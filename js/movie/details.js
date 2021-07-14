$(document).ready( async ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const str_seach = urlParams.get('id');
    
    const results = await getDetails(str_seach);
    loadMovie(results);

    const datas = await getRecommendations(str_seach);
    owlRecommendation(datas);

    $('#carousel-owl-recom').on('click', function(event) {
        const id = event.target.name;
        window.location.href = `../../html/detalhes.html?id=${id}`;
    });
   
});
/* 
async function getProviders(value) {
    const token = sessionStorage.getItem('chave');
    const urlAPI = 'https://api.themoviedb.org/3';
    const urlMovie = `/movie/${value}/watch/providers`;
    var header = {
        'Content-Type':'application/json;charset=utf-8',        
    }
    if(!token) return {}

    const data = await fetch(`${urlAPI}${urlMovie}?api_key=${token}&language=pt-BR`,header)
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
    
    return data;
}
 */
async function getDetails(value) {
    const token = sessionStorage.getItem('chave');
    const urlAPI = 'https://api.themoviedb.org/3';
    const urlMovie = '/movie/';
    var header = {
        'Content-Type':'application/json;charset=utf-8',        
    }
    if(!token) return {}

    const data = await fetch(`${urlAPI}${urlMovie}/${value}?api_key=${token}&language=pt-BR`,header)
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
    return data;
}

async function loadMovie(value) {
    let path = `https://image.tmdb.org/t/p/original${value.backdrop_path}`;
    const genres = value.genres;
    let list = [];
    genres.forEach( value => {        
        list.push(value.name)
    })
    let str_genres = list.join(' - ');
    $('#img_capa').attr('src',path);

    $('#nome').html(value.title);
    $('#status').html(value.status);
    $('#data_lan').html(value.release_date);
    $('#votos').html('Média de votos entre os usuários ' + value.vote_average); //vote_count
    $('#genero').html(str_genres);
    $('#descricao').html(value.overview);    
}

async function getRecommendations(value) {
    const token = sessionStorage.getItem('chave');
    const urlAPI = 'https://api.themoviedb.org/3';
    const urlMovie = `/movie/${value}/similar`;
    var header = {
        'Content-Type':'application/json;charset=utf-8',        
    }
    if(!token) return {}

    const data = await fetch(`${urlAPI}${urlMovie}?api_key=${token}&language=pt-BR`,header)
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

async function owlRecommendation(value) {
    for (let index = 0; index < value.length; index++) {
        let path = `https://image.tmdb.org/t/p/w500${value[index].poster_path}`;
        $('#carousel-owl-recom').trigger('add.owl.carousel', [`<div class="item"> <img class="box-filme" src="${path}" name=${value[index].id}>  </div>`])
        .trigger('refresh.owl.carousel');
    }
}