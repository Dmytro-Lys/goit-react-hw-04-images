import { Dna } from 'react-loader-spinner'
import css from "./Loader.module.css"
import PropTypes from "prop-types"

export const Loader = ({render}) => {
    return (
        <Dna
            visible={render}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass={css.loader}
        />)
}

Loader.propTypes = {
    render: PropTypes.bool.isRequired
}