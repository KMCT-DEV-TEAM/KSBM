"use client";
import React from 'react';

const EventsMoments = ({ momentsCaptured }) => {
  return (
    <section className="w-full py-20 px-6">
      <h2 className="text-center text-xl md:text-2xl font-bold uppercase tracking-widest text-pink-500 mb-12">
        {momentsCaptured.heading}
      </h2>
      <div className="max-w-7xl mx-auto columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {momentsCaptured.images.map((item, idx) => (
          <div key={idx} className="break-inside-avoid rounded-xl overflow-hidden border border-white/5 hover:border-pink-500/40 transition-colors">
            <img src={item.img} alt="Moment" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsMoments;
