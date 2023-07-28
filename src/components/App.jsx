import css from "./App.module.css";
import { Searchbar } from "./searchbar/Searchbar";
import { ImageGallery } from './imagegallery/ImageGallery';
import { Loader } from "./loader/Loader";
import { Button } from "./button/Button"
import { Modal} from "./modal/Modal"
import { nanoid } from "nanoid";
import Notiflix from 'notiflix';
import 'notiflix/src/notiflix.css';
import { getImages } from '../service/api';
import {useRef, useState, useEffect} from 'react';

const App = () => {
  // state
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [querry, setQuerry] = useState("");
  const [maxPage, setMaxPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState({ largeImageURL: "", tags: "" });
  const [isShowModal, setIsShowModal] = useState(false);
// ref
  const refModal = useRef();
  const refLastElem = useRef();


// functions
// search  
  const handleChange = e => setQuerry(e.target.value)

  const resetSearch = () => {
    setImages([])
    setPage(1)
    setMaxPage(0)
    setIsLoading(true)
  }

  const handleSubmit = e => {
      e.preventDefault()
      if (!querry.trim()) return Notiflix.Notify.failure(`Fill the search field`);
      resetSearch()
  }
  
// fetch
  const loadMore = () => {
    setPage(prev => prev + 1)
    setIsLoading(true)
  }
  
  const onError = err => Notiflix.Notify.failure(err.message)

  const generateGalleryItems = data => data.map(({ webformatURL, tags, largeImageURL }) => {
    return { id: nanoid(), webformatURL, tags, largeImageURL }
  })

   // Modal
  const imageClick = ({ target: { dataset: { large }, alt } }) => {
    if (!large) return
    const imageOptions = { largeImageURL: large, tags: alt }
    setShowImage(imageOptions)
    setIsShowModal(true)
  }

  const closeModal = () => setIsShowModal(false)
  
  const modalClick = (e) => {
    if (!e.target.src)  closeModal()
  }

  const handleKeyDown = e => {
    if (e.key === "Escape") closeModal()
  }

// useEffects
  
   useEffect(() => {
    if (isShowModal) refModal.current.focus()
  }, [isShowModal]);
  
   useEffect( () => {
     if (isLoading) {
       getImages(querry, page).then(
         data => {
           if (!data.hits.length) throw new Error("Sorry, there are no images matching your search query. Please try again.");
           if (maxPage === 0) setMaxPage(Math.ceil(data.totalHits / 12))
           return generateGalleryItems(data.hits)
          }
       ).then(imagesPage => setImages([...images, ...imagesPage]))
         .catch(onError).finally(() => setIsLoading(false))
     }

     if (images.length > 0) refLastElem.current.scrollIntoView({ behavior: 'smooth' })
  }, [isLoading, querry, page, maxPage, images]);
  
  
  return (
       <div className={css.App}>
        <Searchbar querry={querry} onChange={handleChange} onSubmit={handleSubmit}/>
        {images.length > 0 && <ImageGallery images={images} onClick={imageClick} refLastElem={refLastElem} />}
         <Loader render={isLoading} />
        {page < maxPage && <Button onClick={loadMore} />}
        {isShowModal && <Modal imageOptions={showImage} refModal={refModal} onClick={modalClick} onKeyDown={handleKeyDown} />}
       </div>
     )
}

export default App