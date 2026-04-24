import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {review.userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{review.userName || 'Anonymous'}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {stars.map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed pl-12">{review.comment}</p>
    </div>
  );
}
