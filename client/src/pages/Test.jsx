import React, { useEffect, useState } from 'react';

const Test = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/image') // Remplace par ton URL backend si nécessaire
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Convertir les images binaires en URLs
                const imageUrls = data.map((image) => {
                    const blob = new Blob([new Uint8Array(image.data)], { type: image.mimeType });
                    return URL.createObjectURL(blob);
                });
                setImages(imageUrls);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des images :', error);
            });
    }, []);

    return (
        <div className='h-screen pt-24'>
            <h1>Test Page</h1>
            <div className='flex flex-wrap'>
                {images.map((src, index) => (
                    <img key={index} src={src} alt={`Image ${index}`} className='m-2' />
                ))}
            </div>
        </div>
    );
};

export default Test;
