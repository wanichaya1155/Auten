import React, { useState, useEffect } from 'react';
import './index.css'; // Import your CSS file

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to fetch products only once

  let slideIndex = 0;

  const showSlides = () => {
    let i;
    const slides = document.getElementsByClassName('slide');
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(showSlides, 3000);
  };

  useEffect(() => {
    showSlides(); // Call showSlides on component mount
    const intervalId = setInterval(showSlides, 3000); // Set up interval for automatic slider transition
    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []); // Empty dependency array to run showSlides effect only once on mount

  const renderProducts = () => {
    if (isLoading) {
      return <p>Loading products...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (!products.length) {
      return <p>No products found.</p>;
    }

    return products.map((product) => (
      <div key={product.ProductNo} className="item_box">
        <a href={`product_item.html?productNo=${product.ProductNo}`}>
          <img src={`img/${product.ProductNo}.jpg`} alt={product.ProductName} />
        </a>
        <div className="info">
          <p className="name_product">{product.ProductName}</p>
          <div className="category">
            <p>{product.Category}</p>
          </div>
          <div className="price">
            <p>{`${product.PricePerUnit} บาท`}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      {/* Include your navbar component here (consider using a separate component) */}
      <div className="slider-container">
        <div className="slider">
          {/* Add your individual slide elements here */}
          <div className="slide">
            <img src="img/imgslide1.png" alt="Image 1" />
          </div>
          {/* ... other slide elements */}
        </div>
      </div>
      <div className="item">
        {renderProducts()}
      </div>
    </div>
  );
};

export default Home;
