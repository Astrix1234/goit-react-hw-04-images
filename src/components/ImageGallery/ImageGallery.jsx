import PropTypes from 'prop-types';
import css from './ImageGallery.module.css';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import { Hearts } from 'react-loader-spinner';
import Button from '../Button/Button';
import { fetchData } from '../Api/Api';
import React, { useState } from 'react';
import Searchbar from '../Searchbar/Searchbar';

const ImageGallery = ({ onOpen }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonShow, setButtonShow] = useState(false);
  const [searchQuestion, setSearchQuestion] = useState('');

  const fetchImages = async (query, page) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const data = await fetchData(query, page);

        setImages(prevState => [...prevState, ...data.hits]);
        setIsLoading(false);
        if (data.hits.length === 0) {
          setButtonShow(false);
        } else if (data.totalHits <= page * 12) {
          alert(
            'These will be the last images to be uploaded. Please enter a more specific query!'
          );
          setButtonShow(false);
        } else {
          setButtonShow(true);
        }
      } catch (error) {
        setIsLoading(false);
        alert('Something went wrong. Please try again.');
      }
    }, 2000);
  };

  const onSearch = e => {
    e.preventDefault();
    const query = e.currentTarget.elements.searchInput.value;
    if (query.trim() === '') {
      return alert('Please enter your request');
    }
    setImages([]);
    setSearchQuestion(query);
    setCurrentPage(1);

    fetchImages(query, 1);
  };

  const handleCurrentPageUpdate = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    fetchImages(searchQuestion, nextPage);
  };

  const onLoadMore = () => {
    handleCurrentPageUpdate();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Searchbar onSubmit={onSearch} />
      <ul className={css.ImageGallery}>
        {images.map((image, index) => (
          <ImageGalleryItem
            key={`${image.id}-${index}`}
            {...image}
            onClick={onOpen}
          />
        ))}
      </ul>
      {isLoading && (
        <Hearts
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="hearts-loading"
          // wrapperStyle={{ }}
          // wrapperClass=""
          visible={true}
        />
      )}
      {buttonShow && <Button loadMore={onLoadMore} />}
    </>
  );
};

ImageGallery.propTypes = {
  onOpen: PropTypes.func.isRequired,
};

export default ImageGallery;
