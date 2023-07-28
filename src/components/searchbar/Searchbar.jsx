import css from './Searchbar.module.css'
import PropTypes from "prop-types"

export const Searchbar = ({ querry, onChange, onSubmit}) => {
    return (
            <header className={css.Searchbar}>
              <form onSubmit={onSubmit} className={css.SearchForm}>
                 <button type="submit" className={css["SearchForm-button"]}>
                   <span className={css["SearchForm-button-label"]}>Search</span>
                 </button>
                 <input
                   name="querry"
                   className={css["SearchForm-input"]}
                   type="text"
                   autoComplete="off"
                   autoFocus
                   placeholder="Search images and photos"
                   value={querry}
                   onChange={onChange}
                  />
               </form>
           </header>
        )
}
    
Searchbar.propTypes = {
  querry: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}