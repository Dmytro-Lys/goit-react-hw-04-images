import css from './ImageGalleryItem.module.css'
import PropTypes from "prop-types"

export const ImageGalleryItem = ({dataItem }) => {
    const {webformatURL, tags, largeImageURL} = dataItem
    return(
      <li className={css.ImageGalleryItem}>
        <img className={css["ImageGalleryItem-image"]} src={webformatURL} alt={tags} data-large={largeImageURL} />
      </li>
    )
}

ImageGalleryItem.propTypes = {
    dataItem: PropTypes.object.isRequired
}