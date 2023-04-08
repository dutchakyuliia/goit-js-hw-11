import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

async function fetchImage(value, page) {
    
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35164644-c0ded33a4bfd222370a5029bc';
const findEL = `?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    try {
const response = await axios.get(`${BASE_URL}${findEL}`)
return response;
    }
    catch  (error) {
    console.log(error)
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

function createMarkup(data) {
  let markupPost = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="photo-card" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b></br>${likes}
    </p>
    <p class="info-item">
      <b>Views</b></br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b></br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b></br>${downloads}
    </p>
  </div>
</a>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markupPost);
}

async function handlerSubmitform(e) {
  e.preventDefault();
  clearForm();
  searchQuery = e.currentTarget.searchQuery.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.failure('Sorry, you have not entered anything.');
    return;
  } else {
    try {
      const response = await fetchImage(searchQuery, currentPage);
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      createMarkup(response.data.hits);
      lightbox.refresh();

      if (response.data.hits.length === 40) {
        loadMore();
      }
      
    } catch (error) {
      console.log(error);
    }
  }
}

async function handlerLoadMoreBtn(e) {
  e.preventDefault();
  try {
    const response = await fetchImage(searchQuery, currentPage);
    createMarkup(response.data.hits);
    lightbox.refresh();
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    const totalPage = response.data.totalHits / 40;
    if (totalPage <= currentPage) {
      loadMoreBtnEl.classList.add('hidden');
      Notiflix.Notify.success(
        "We're sorry, but you've reached the end of search results."
      );
      return;

    }
    currentPage += 1;
  } catch (error) {
    console.log(error);
  }
}

function clearForm() {
  gallery.innerHTML = '';
  currentPage = 1;
  searchQuery = null;
  loadMoreBtnEl.classList.add('hidden');
}
function loadMore() {
  currentPage += 1;
  loadMoreBtnEl.classList.remove('hidden');
}
