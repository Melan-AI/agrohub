import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="product-card glass-card">
      <div className="product-media">
        <div className="placeholder-img">Image</div>
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="price">{product.price} NGN</p>
        <p className="meta">Seller location: {product.location}</p>
        <p className="meta">Stock: {product.stock}</p>
        <p className="meta">Rating: {product.rating} ★</p>
        <div className="card-actions">
          <button className="btn primary">Buy Now</button>
          <button className="btn ghost">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}