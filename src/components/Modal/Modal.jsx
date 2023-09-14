import PropTypes from 'prop-types';
import css from './Modal.module.css';

const Modal = ({ largeImageURL, description, onClose }) => {
  return (
    <div
      className={css.Overlay}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={css.Modal}>
        <img src={largeImageURL} alt={description} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
