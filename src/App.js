import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [photoGalleryArray, updatePhotoGalleryArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    axios.get('https://picsum.photos/v2/list')
      .then(response => {
        updatePhotoGalleryArray(response.data);
        setFilteredPhotos(response.data);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPhotos(photoGalleryArray);
    } else {
      setFilteredPhotos(
        photoGalleryArray.filter(photo =>
          photo.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, photoGalleryArray]);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="App min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-md">
        <div className="container mx-auto text-white text-2xl font-semibold">
          Professional Image Gallery
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search by author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          layout
        >
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layoutId={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                onClick={() => openModal(photo)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={photo.download_url}
                  alt={`image_${photo.id}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-end justify-start p-4">
                  <p className="text-white text-lg font-bold">{photo.author}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center text-white mt-8">
        <p>&copy; 2024 Professional Image Gallery. All rights reserved.</p>
      </footer>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg overflow-hidden max-w-4xl w-full"
            >
              <img
                src={selectedPhoto.download_url}
                alt={`Full size ${selectedPhoto.author}`}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{selectedPhoto.author}</h2>
                <p>ID: {selectedPhoto.id}</p>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;