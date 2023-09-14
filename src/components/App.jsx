import React, { useState } from 'react';
import css from './App.module.css';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';

const App = () => {
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);

  const openedModal = largeImageURL => {
    setLargeImageURL(largeImageURL);
    setShowModal(true);

    document.addEventListener('keydown', closedModalEscape);
  };

  const closedModal = () => {
    setShowModal(false);
    setLargeImageURL('');

    document.removeEventListener('keydown', closedModalEscape);
  };

  const closedModalEscape = e => {
    if (e.code === 'Escape') {
      closedModal();
    }
  };

  return (
    <div className={css.App}>
      <ImageGallery onOpen={openedModal} />

      {showModal && (
        <Modal
          largeImageURL={largeImageURL}
          description="Large View"
          onClose={closedModal}
        />
      )}
    </div>
  );
};

export default App;
