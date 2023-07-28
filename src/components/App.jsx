import css from "./App.module.css";
import { Searchbar } from "./searchbar/Searchbar";
import { ImageGallery } from './imagegallery/ImageGallery';
import { Loader } from "./loader/Loader";
import { Button } from "./button/Button"
import { Modal} from "./modal/Modal"
import { Component } from "react";
import { nanoid } from "nanoid";
import Notiflix from 'notiflix';
import 'notiflix/src/notiflix.css';
import { getImages } from '../service/api';
import React from 'react';

class App extends Component {
  state = {
    images: [],
    page: 1,
    querry: '',
    maxPage: 0,
    isLoading: false,
    showImage: { largeImageURL: "", tags: "" },
    refModal: React.createRef(),
    refLastElem: React.createRef(),
    isShowModal: false
  }
   

    handleChange = e => {
      const { name, value } = e.target;
      this.setState({ [name]: value.trim() });
  }
  
   handleSubmit = e => {
      e.preventDefault()
     const { querry } = this.state
     if (!querry.trim()) return Notiflix.Notify.failure(`Fill the search field`);
      this.resetSearch()
    }
  
   resetSearch = () => this.setState({images: [], page: 1, maxPage: 0, isLoading: true })
    
   
  loadMore = () => {
    this.setState(prev => {
      return {page: prev.page + 1, isLoading: true}
    })
  }

  onError = err => Notiflix.Notify.failure(err.message)

  async componentDidUpdate(prevProps, prevState) {
   
    const { querry, page, maxPage, isLoading, images, isShowModal, refModal, refLastElem } = this.state
    // set focus to Modal for onKeyDown
    if (isShowModal) refModal.current.focus()
    // fetching new images
    if (isLoading)  {
      try {
         const data = await getImages(querry, page);
        if (!data.hits.length) throw new Error("Sorry, there are no images matching your search query. Please try again.");
        const imagesPage = this.generateGalleryItems(data.hits)
        this.setState({ images: [...images, ...imagesPage] })
        if (maxPage === 0) this.setState({ maxPage: Math.ceil(data.totalHits / 12) })
      } catch (error) {
        this.onError(error)
      } finally {
        this.setState({ isLoading: false });
      }
    }
    // scroll
    const prevImages = prevState.images
    if (images.length>0 && prevImages.length !== images.length) refLastElem.current.scrollIntoView({ behavior: 'smooth' })
  }

  generateGalleryItems = data => data.map(({ webformatURL, tags, largeImageURL }) => {
    return { id: nanoid(), webformatURL, tags, largeImageURL }
  })

  
  imageClick = ({ target: { dataset: { large }, alt } }) => {
    if (!large) return
    const imageOptions = { largeImageURL: large, tags: alt }
    this.setState({ showImage: imageOptions, isShowModal: true })
  }

  closeModal = () => this.setState({ isShowModal: false })

  modalClick = (e) => {
    if (!e.target.src)  this.closeModal()
  }

  handleKeyDown = e => {
    if (e.key === "Escape") this.closeModal()
  }
  
 
  render() {
    const { querry, page, maxPage, isLoading, images, isShowModal, showImage, refModal, refLastElem } = this.state
    return (
       <div className={css.App}>
        <Searchbar querry={querry} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
        {images.length > 0 && <ImageGallery images={images} onClick={this.imageClick} refLastElem={refLastElem} />}
         <Loader render={isLoading} />
        {page < maxPage && <Button onClick={this.loadMore} />}
        {isShowModal && <Modal imageOptions={showImage} refModal={refModal} onClick={this.modalClick} onKeyDown={this.handleKeyDown} />}
       </div>
     )
   }
  
}

export default App