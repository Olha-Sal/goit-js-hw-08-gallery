import galleryItems from "./gallery-items.js";


const galleryList = document.querySelector('.gallery');
const modalIsOpen = document.querySelector('.lightbox');
const originalImageAttr = document.querySelector('.lightbox__image');
const modalIsClose = document.querySelector('button[data-action="close-lightbox"]');

//Создание и рендер разметки по массиву данных и предоставленному шаблону.
const createGalleryItem = ({ preview, original, description }) => {
  return `<li class="gallery__item">
            <a class="gallery__link" href="${original}">
              <img class="gallery__image"
              src="${preview}"
              data-source="${original}" 
              alt="${description}"/>
            </a>
          </li>`
};

const markup = galleryItems.map(createGalleryItem).join('');
galleryList.insertAdjacentHTML("beforeend", markup);
  
// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
galleryList.addEventListener('click', onImageClick);
let currentIdx = 0;

function onImageClick(evt) {
  evt.preventDefault();

  if (evt.target.nodeName !== 'IMG') {
    return;
  }

  openModal();

  //Подмена значения атрибута src элемента img.lightbox__image.
  originalImageAttr.src = evt.target.dataset.source;
  originalImageAttr.alt = evt.target.alt;

  
  const imagesListLink = galleryItems.map(item => item.original);
  currentIdx = imagesListLink.indexOf(originalImageAttr.src);

  window.addEventListener('keydown', changeImage);
}

//Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
function changeImage(evt) {

    if (evt.code === 'ArrowRight') {
      if (currentIdx >= galleryItems.length - 1) {
        return;
      }
      currentIdx += 1;
      originalImageAttr.src = galleryItems[currentIdx].original;
      originalImageAttr.alt = galleryItems[currentIdx].description;
    }

    if (evt.code === 'ArrowLeft') {
      if (currentIdx <= 0) {
        return;
      }
      currentIdx -= 1;
      originalImageAttr.src = galleryItems[currentIdx].original;
      originalImageAttr.alt = galleryItems[currentIdx].description;
    }
  }

//Открытие модального окна по клику на элементе галереи. 
function openModal() {
  modalIsOpen.classList.add('is-open');
  window.addEventListener('keydown', onEscPress);
  modalIsOpen.addEventListener('click', onOverlayClickClose);
}

//Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
//Закрытие модального окна по клику на div.lightbox__overlay.
//Закрытие модального окна по нажатию клавиши ESC.
modalIsClose.addEventListener('click', closeModal);

function closeModal() {
  window.removeEventListener('keydown', onEscPress);
  window.removeEventListener("keydown", changeImage);
  
  modalIsOpen.removeEventListener('click', onOverlayClickClose)
  modalIsOpen.classList.remove('is-open');

//Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того,
//чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.
  originalImageAttr.src = '';
  originalImageAttr.alt = '';
}

function onOverlayClickClose (evt) {
  if (evt.target.nodeName !== 'IMG') {
    closeModal();
  }
}

function onEscPress(evt) {
  if (evt.code === 'Escape') {
    closeModal();
  }
}
