import { getChaveApi } from "./chaveAPI.js";
const chaveAPI = await getChaveApi();
sessionStorage.setItem('chave',chaveAPI);

$(document).ready( async ()=>{
    $('#botaoDetalhes').click(()=>{
        const id = $('#botaoDetalhes').attr('name');
        window.location.href = `../html/detalhes.html?id=${id}`;
    });
    $('#bnt_search').click( ()=> {
        const str_search = $('#text_search').val();
        window.location.href = `../html/search.html?movie=${str_search}`;
    })
    $('#carousel-owl').on('click', function(event) {
        const id = event.target.name;
        window.location.href = `../html/detalhes.html?id=${id}`;
    });
    $('#carousel-owl-other').on('click', function(event) {
        const id = event.target.name;
        window.location.href = `../html/detalhes.html?id=${id}`;
    });

    const {results} = await getTrending();
    
    capa(results[0]);
    owlDestaque(results)

    const dateDiscover = await getDestaque();
    
    owlDiscover(dateDiscover)
});

async function getTrending() {
    const token = sessionStorage.getItem('chave');
    const urlAPI = 'https://api.themoviedb.org/3';
    const urlTrendindWeek = '/trending/movie/week';
    var header = {
        'Content-Type':'application/json;charset=utf-8',        
    }
    if(!token) return {}

    const data = await fetch(`${urlAPI}${urlTrendindWeek}?api_key=${token}&language=pt-BR`,header)
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

async function capa(value) {
    let path = `https://image.tmdb.org/t/p/original${value.backdrop_path}`;

    $('.filme-principal').css('background-image', `url(${path})`) ;
    $('#titulo').html(value.title);
    $('#descricao').html(value.overview);
    $('#botaoDetalhes').attr('name', value.id)

}
async function owlDestaque(value) {
    for (let index = 1; index <= 12; index++) {
        let path = `https://image.tmdb.org/t/p/w500${value[index].poster_path}`;
        $('#carousel-owl').trigger('add.owl.carousel', [`<div class="item"> <img class="box-filme" src="${path}" name=${value[index].id} >  </div>`])
        .trigger('refresh.owl.carousel');
    }
}

async function getDestaque() {
    const token = sessionStorage.getItem('chave');
    const urlAPI = 'https://api.themoviedb.org/3';
    const urlDestaque = '/discover/movie';
    var header = {
        'Content-Type':'application/json;charset=utf-8',        
    }
    if(!token) return {}

    const data = await fetch(`${urlAPI}${urlDestaque}?api_key=${token}&language=pt-BR&sort_by=popularity.desc&include_adult=false`,header)
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
    return results;    
}
async function owlDiscover(value) {
    for (let index = 1; index <= 12; index++) {
        let path = `https://image.tmdb.org/t/p/w500${value[index].poster_path}`;
        $('#carousel-owl-other').trigger('add.owl.carousel', [`<div class="item"> <img class="box-filme" src="${path}" name=${value[index].id}>  </div>`])
        .trigger('refresh.owl.carousel');
    }
}
