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

  const fetchData = async () => {
      try {
         const data = await getImages(querry, page);
        if (!data.hits.length) throw new Error("Sorry, there are no images matching your search query. Please try again.");
        const imagesPage = generateGalleryItems(data.hits)
        setImages([...images, ...imagesPage] )
        if (maxPage === 0) setMaxPage(Math.ceil(data.totalHits / 12))
      } catch (error) {
        onError(error)
      } finally {
        setIsLoading( false);
      }
  }
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
     if (isLoading) fetchData()
  }, [isLoading]);
  
  useEffect(() => {
    if (images.length > 0) refLastElem.current.scrollIntoView({ behavior: 'smooth' })
  }, [images])


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
// class App extends Component {
//   state = {
//     images: [],
//     page: 1,
//     querry: '',
//     maxPage: 0,
//     isLoading: false,
//     showImage: { largeImageURL: "", tags: "" },
//     refModal: React.createRef(),
//     refLastElem: React.createRef(),
//     isShowModal: false
//   }
   

//     handleChange = e => {
//       const { name, value } = e.target;
//       this.setState({ [name]: value.trim() });
//   }
  
//    handleSubmit = e => {
//       e.preventDefault()
//      const { querry } = this.state
//      if (!querry.trim()) return Notiflix.Notify.failure(`Fill the search field`);
//       this.resetSearch()
//     }
  
//    resetSearch = () => this.setState({images: [], page: 1, maxPage: 0, isLoading: true })
    
   
//   loadMore = () => {
//     this.setState(prev => {
//       return {page: prev.page + 1, isLoading: true}
//     })
//   }

//   onError = err => Notiflix.Notify.failure(err.message)

//   async componentDidUpdate(prevProps, prevState) {
   
//     const { querry, page, maxPage, isLoading, images, isShowModal, refModal, refLastElem } = this.state
//     // set focus to Modal for onKeyDown
//     if (isShowModal) refModal.current.focus()
//     // fetching new images
//     if (isLoading)  {
//       try {
//          const data = await getImages(querry, page);
//         if (!data.hits.length) throw new Error("Sorry, there are no images matching your search query. Please try again.");
//         const imagesPage = this.generateGalleryItems(data.hits)
//         this.setState({ images: [...images, ...imagesPage] })
//         if (maxPage === 0) this.setState({ maxPage: Math.ceil(data.totalHits / 12) })
//       } catch (error) {
//         this.onError(error)
//       } finally {
//         this.setState({ isLoading: false });
//       }
//     }
//     // scroll
//     const prevImages = prevState.images
//     if (images.length>0 && prevImages.length !== images.length) refLastElem.current.scrollIntoView({ behavior: 'smooth' })
//   }

//   generateGalleryItems = data => data.map(({ webformatURL, tags, largeImageURL }) => {
//     return { id: nanoid(), webformatURL, tags, largeImageURL }
//   })

  
//   imageClick = ({ target: { dataset: { large }, alt } }) => {
//     if (!large) return
//     const imageOptions = { largeImageURL: large, tags: alt }
//     this.setState({ showImage: imageOptions, isShowModal: true })
//   }

//   closeModal = () => this.setState({ isShowModal: false })

//   modalClick = (e) => {
//     if (!e.target.src)  this.closeModal()
//   }

//   handleKeyDown = e => {
//     if (e.key === "Escape") this.closeModal()
//   }
  
 
//   render() {
//     const { querry, page, maxPage, isLoading, images, isShowModal, showImage, refModal, refLastElem } = this.state
//     return (
//        <div className={css.App}>
//         <Searchbar querry={querry} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
//         {images.length > 0 && <ImageGallery images={images} onClick={this.imageClick} refLastElem={refLastElem} />}
//          <Loader render={isLoading} />
//         {page < maxPage && <Button onClick={this.loadMore} />}
//         {isShowModal && <Modal imageOptions={showImage} refModal={refModal} onClick={this.modalClick} onKeyDown={this.handleKeyDown} />}
//        </div>
//      )
//    }
  
// }

export default App