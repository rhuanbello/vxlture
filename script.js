const getTags = (tag, all) => {
  return all ? document.querySelectorAll(tag) : document.querySelector(tag);
}

const openModalButton = getTags('.open-modal');
const closeModalButton = getTags('header button');
const addNewsButton = getTags('.add-news');
const inputsValue = getTags('input', true);

const modal = getTags('aside');
const newsContainer = getTags('.news');

const handleEventListeners = () => {
  document.addEventListener('keydown', (e) => e.key === 'Escape' && toggleModal(false));
  openModalButton.addEventListener('click', () => toggleModal(true));
  closeModalButton.addEventListener('click', () => toggleModal(false));

  addNewsButton.addEventListener('click', (e) => {
    e.preventDefault();
    setNewsData(inputsValue);
    toggleModal(false);
    resetInputValues(inputsValue)
  });
}

const toggleModal = (value) => {
  modal.style.opacity = value ? '1' : '0';
  modal.style.visibility = value ? 'visible' : 'hidden'

}

const setNewsData = ([title, description, img]) => {
  const titleValue = title.value;
  const descriptionValue = description.value;
  const imgValue = img.value;

  const newObj = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    img: imgValue,
    title: checkLenght(titleValue, 25),
    description: checkLenght(descriptionValue, 100),
    createdAt: new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  console.log('Objeto', newObj)

  addNews(newObj);
  setLocalStorage(newObj);
};

const checkLenght = (value, maxLenght) => (
  value.length > maxLenght ? value.substring(0, maxLenght) + '...' : value
);

const resetInputValues = (inputsArray) => {
  inputsArray.forEach(input => input.value = '')
};

const addNews = ({ img, title, description, id, createdAt}) => {

  console.log('Adicionando noticia', id)

  newsContainer.innerHTML +=
    `
      <li class="new">
          <div>
            <img class="new--img"
              src="${img}"
            >
          </div>
          <h3 class="new--title">${title}</h3>
          <p class="new--description">${description}</p>
          <p>${createdAt}</p>
          <span class="new--action" data-news-id="${id}">
            <i class="ri-close-line"></i>
          </span>
      </li>
    `

  setRemoveNewsEvent();
};

const setLocalStorage = (newObj) => {
  const localStorageNews = JSON.parse(localStorage.getItem('newsData')) || []
  const arrayOfNewObj = [...localStorageNews, newObj]
  localStorage.setItem('newsData', JSON.stringify(arrayOfNewObj));

}

const checkLocalStorage = () => {
  newsContainer.innerHTML = '';
  const localStorageNews = JSON.parse(localStorage.getItem('newsData')) || [];
  localStorageNews.forEach(news => addNews(news));
}

const setRemoveNewsEvent = () => {
  const removeNews = getTags('.new--action', true);

  removeNews.forEach(news => {
    news.addEventListener('click', () => {
      handleDeleteNews(news.dataset.newsId);
    })
  })

}

const handleDeleteNews = (id) => {
  const localStorageNews = JSON.parse(localStorage.getItem('newsData'));
  const newsIndex = localStorageNews.findIndex(({ id: newsId }) => newsId === id);
  localStorageNews.splice(newsIndex, 1);
  localStorage.setItem('newsData', JSON.stringify(localStorageNews));

  checkLocalStorage();
}

window.onload = () => {
  checkLocalStorage();
  handleEventListeners();
};