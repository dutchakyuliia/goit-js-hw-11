import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

async function fetchImages(value, page) {
    
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35164644-c0ded33a4bfd222370a5029bc';
const findEL = `?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    try {
const response = await axios.get(`${BASE_URL}${findEL}`)
return response;
    }
    catch { (error) {
    console.log(error)}
    }
};

let currentPage = 1;
let searchQuery = null;
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', handlerSubmitform);
loadMoreBtnEl.addEventListener('click', handlerLoadMoreBtn);

