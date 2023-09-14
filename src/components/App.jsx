import React, { Component } from 'react';
import css from './App.module.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import { Hearts } from 'react-loader-spinner';
import { fetchData } from './Api/Api';

class App extends Component {
  state = {
    images: [],
    largeImageURL: '',
    searchQuestion: '',
    showModal: false,
    isLoading: false,
    currentPage: 1,
    error: null,
  };

  fetchImages = async () => {
    this.setState({ isLoading: true });
    setTimeout(async () => {
      try {
        const images = await fetchData(
          this.state.searchQuestion,
          this.state.currentPage
        );

        this.setState(prevState => ({
          images: [...prevState.images, ...images],
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        this.setState({ isLoading: false, error: 'Something went wrong.' });
        alert('Something went wrong. Please try again.');
      }
    }, 2000);
  };

  handleCurrentPageUpdate = () => {
    this.setState(
      prevState => ({
        currentPage: prevState.currentPage + 1,
      }),
      () => {
        this.fetchImages();
      }
    );
  };

  onSearch = e => {
    e.preventDefault();
    const query = e.target.elements.searchInput.value;
    if (query.trim() === '') {
      return alert('Please enter your request');
    }
    this.setState(
      {
        images: [],
        currentPage: 1,
        searchQuestion: query,
      },
      () => {
        this.fetchImages();
      }
    );
  };

  onLoadMore = () => {
    this.handleCurrentPageUpdate();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  openedModal = largeImageURL => {
    this.setState(
      {
        largeImageURL: largeImageURL,
        showModal: true,
      },
      () => {
        document.addEventListener('keydown', this.closedModalEscape);
      }
    );
  };

  closedModal = () => {
    this.setState(
      {
        largeImageURL: '',
        showModal: false,
      },
      () => {
        document.removeEventListener('keydown', this.closedModalEscape);
      }
    );
  };

  closedModalEscape = e => {
    if (e.code === 'Escape') {
      this.closedModal();
    }
  };

  render() {
    const { images, largeImageURL, showModal, isLoading } = this.state;
    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.onSearch} />
        <ImageGallery images={images} onOpen={this.openedModal} />
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
        {showModal && (
          <Modal
            largeImageURL={largeImageURL}
            description="Large View"
            onClose={this.closedModal}
          />
        )}
        <Button loadMore={this.onLoadMore} />
      </div>
    );
  }
}

export default App;
