import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Test = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('/image')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setImages(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
    }, []);

    console.log(images)

    return (
        <div className='h-screen'>
            <h1>Test Page</h1>
            <div>
                
            </div>
        </div>
    );
};

export default Test;