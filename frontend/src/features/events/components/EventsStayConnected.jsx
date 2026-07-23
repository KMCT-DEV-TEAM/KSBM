"use client";
import React from 'react';

const EventsStayConnected = ({ stayConnected }) => {
  return (
    <section className="w-full py-20 px-6 relative bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
      <h2 className="text-center text-xl md:text-2xl font-bold uppercase tracking-widest text-pink-500 mb-12">
        {stayConnected.heading}
      </h2>
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
        {stayConnected.posters.map((poster, idx) => (
          <div key={idx} className="w-64 sm:w-72 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(219,39,119,0.2)] transition-all cursor-pointer transform hover:-translate-y-2">
            <img src={poster.img} alt="Poster" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsStayConnected;
