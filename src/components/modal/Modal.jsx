import css from "./Modal.module.css"
import PropTypes from "prop-types"


export const Modal = ({ imageOptions, refModal, onClick, onKeyDown }) => {
    const { largeImageURL, tags } = imageOptions
    return (
        <div tabIndex={"-1"} ref={refModal} className={css.Overlay} onClick={onClick} onKeyDown={onKeyDown} >
           <div className={css.Modal} >
              <img src={largeImageURL} alt={tags} />
           </div>
        </div>
    )
}

Modal.propTypes = {
    imageOptions: PropTypes.object.isRequired,
    refModal: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired
}