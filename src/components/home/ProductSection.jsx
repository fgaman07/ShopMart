import React from 'react';
import ProductCard from '../product/ProductCard';

export default function ProductSection({ title, productsList, viewAllLink }) {
  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">{title}</h2>
        {viewAllLink && (
           <a href={viewAllLink} className="text-primary font-semibold hover:underline text-sm md:text-base hidden sm:block">
             See All →
           </a>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {productsList.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            weight={product.weight}
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            image={product.image}
          />
        ))}
      </div>
      
      {viewAllLink && (
         <div className="mt-6 text-center sm:hidden">
            <a href={viewAllLink} className="inline-block border border-primary text-primary px-6 py-2 rounded-full font-semibold text-sm">
              View All Products
            </a>
         </div>
      )}
    </div>
  );
}
