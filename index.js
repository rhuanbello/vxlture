const getTags = (tag, all) => {
  return all ? document.querySelectorAll(tag) : document.querySelector(tag);
}

const openModalButton = getTags('.open-modal');
const closeModalButton = getTags('aside header button');
const addNewsButton = getTags('.add-news');
const gridContainerButtons = getTags('.grid--container div', true);
const logoAnchor = getTags('.menu a');

const inputsValue = getTags('input', true);

const modal = getTags('aside');
const newsContainer = getTags('.news');
const categoriesContainer = getTags('.menu--categories');
const header = getTags('header');

const handleEventListeners = () => {

  document.addEventListener('keydown', (e) => e.key === 'Escape' && toggleModal(false));
  openModalButton.addEventListener('click', () => toggleModal(true));
  closeModalButton.addEventListener('click', () => toggleModal(false));
  logoAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 400,
      behavior: 'smooth',
    })
  })

  addNewsButton.addEventListener('click', (e) => {
    e.preventDefault();
    setNewsData(inputsValue);
    toggleModal(false);
    resetInputValues(inputsValue)
  });

  gridContainerButtons.forEach(gridButton => {
    const innerButtons = gridButton.children;

    gridButton.addEventListener('click', () => {
      const { length } = innerButtons;

      const currentGridContainerClass = newsContainer.getAttribute('class').split(' ').splice(1)[0];
      newsContainer.classList.remove(currentGridContainerClass);
      newsContainer.classList.add(`grid--container-${length}`);

      gridContainerButtons.forEach(button => button.classList.remove('active-grid'));
      gridButton.classList.add('active-grid');

    })

  })

  document.addEventListener('scroll', () => {
    const { scrollY } = window;
    if (scrollY >= 100) {
      header.style.background = 'rgb(19, 19, 31, .9)'
    } else {
      header.style.background = 'var(--dark)'
    };
  });

}

const toggleModal = (value) => {
  modal.style.opacity = value ? '1' : '0';
  modal.style.visibility = value ? 'visible' : 'hidden'

}

const setNewsData = ([category, description, img]) => {
  const categoryValue = category.value;
  const descriptionValue = description.value;
  const imgValue = img.value;

  const newObj = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    img: imgValue,
    category: categoryValue,
    description: checkLenght(descriptionValue, 85),
    createdAt: new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  addNews(newObj);
  setLocalStorage(newObj);
  setRemoveNewsEvent();
  handleCategories();
};

const checkLenght = (value, maxLenght) => (
  value.length > maxLenght ? value.substring(0, maxLenght) + '...' : value
);

const resetInputValues = (inputsArray) => {
  inputsArray.forEach(input => input.value = '')
};

const addNews = ({ img, category, description, createdAt, id }) => {
  newsContainer.insertAdjacentHTML('afterbegin', `
      <li class="new ">
        <div>
          <img class="new--img"
            src="${img}"
            onerror="this.src='./assets/image-not-found.svg'" 
          >
        </div>
        <span class="news--category">${category}</span>
        <h3 class="news--description">${description}</h3>
        <p class="news--date">${createdAt}</p>
        <span class="news--action" data-news-id="${id}">
          <i class="ri-close-line"></i>
        </span>
      </li>
    `)

};

const handleCategories = () => {
  const categoriesNews = getTags('.news--category', true);

  handleCategoriesColors(categoriesNews);
  handleCategoriesFilter();
}

const handleCategoriesColors = (categoriesNews) => {
  categoriesNews.forEach((category) => {
    const { innerText, style } = category;
    style.color = `var(--${innerText.toLowerCase()})`
  })
}

const handleCategoriesFilter = () => {
  const localStorageNews = JSON.parse(localStorage.getItem('newsData')) || [];
  const categoriesList = [...new Set(localStorageNews.map(x => x.category))].sort().reverse();

  categoriesContainer.innerHTML = '';
  categoriesList.forEach(category => {
    categoriesContainer.insertAdjacentHTML('beforeend', `
      <button class="menu--nav">${category}</button>
    `);
  })

  const menuItems = getTags('.menu button', true);

  menuItems.forEach((category) => {

    category.addEventListener('click', () => {
      const { innerText } = category;
      const filteredNews = localStorageNews.filter((({ category }) => category === innerText));

      if (innerText === 'Início') {
        renderNewsOnPage();
      } else {
        renderNewsOnPage(filteredNews);
      }
    })
  })

}

const setLocalStorage = (newObj) => {
  const localStorageNews = JSON.parse(localStorage.getItem('newsData')) || []
  const arrayOfNewObj = [...localStorageNews, newObj]
  localStorage.setItem('newsData', JSON.stringify(arrayOfNewObj));

}

const renderNewsOnPage = (newsToRender = JSON.parse(localStorage.getItem('newsData'))) => {
  newsContainer.innerHTML = '';
  newsToRender.forEach(news => addNews(news));
  handleCategories();
  setRemoveNewsEvent();
}

const setRemoveNewsEvent = () => {
  const removeNews = getTags('.news--action', true);

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
  renderNewsOnPage();

}

window.onload = () => {
  handleEventListeners();
  renderNewsOnPage();
};