import css from './ImageGallery.module.css'
import { ImageGalleryItem } from "../imagegalleryitem/ImageGalleryItem"
import PropTypes from "prop-types"

export const ImageGallery = ({images, onClick, refLastElem}) => {
    return (
        <ul className={css.ImageGallery} onClick={onClick}>
            {images.map(item => {
              return <ImageGalleryItem key={item.id} dataItem={item}/>
            })}
            <li ref={refLastElem}></li>
        </ul>
    )
}

ImageGallery.propTypes = {
    images: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
}