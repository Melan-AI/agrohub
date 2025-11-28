import React from "react";
import ProductCard from "../components/ProductCard";

const PRODUCTS = [
  { id: 1, name: "Tomatoes", price: 200, location: "Ilorin", stock: 50, rating: 4.6, img: "" },
  { id: 2, name: "Yam Tubers", price: 1200, location: "Kaiama", stock: 20, rating: 4.8, img: "" },
  { id: 3, name: "Fresh Pepper", price: 180, location: "Pategi", stock: 100, rating: 4.4, img: "" },
  id: 4, name: "nuts", price: 1800, location: "ilorinwest", stock: 100, rating: 4.6, img: }
];

export default function Marketplace({ user }) {
  return (
    <div className="marketplace">
      <h1>Marketplace</h1>
      <div className="product-grid">
        {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}