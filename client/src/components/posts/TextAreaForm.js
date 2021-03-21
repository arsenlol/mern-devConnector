import React, {useRef} from 'react';
import PropTypes from 'prop-types';

const TextAreaForm = ({motivation, placeholder, submitHandler}) => {
    const textArea = useRef(null)
    const onSubmit = (e) => {
        e.preventDefault()
        submitHandler(textArea.current.value)
        textArea.current.value = null;
    }
    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>{motivation}</h3>
            </div>
            <form className="form my-1" onSubmit={(e) => onSubmit(e)}>
            <textarea ref={textArea}
                name="text"
                cols="30"
                rows="5"
                placeholder={placeholder}
                required
            ></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    );
}

TextAreaForm.propTypes = {
    motivation: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    submitHandler: PropTypes.func.isRequired,
};

export default TextAreaForm;