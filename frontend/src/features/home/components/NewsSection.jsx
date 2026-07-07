import React from 'react';

const NewsSection = () => {
  const featuredArticle = {
    id: 1,
    tag: 'FEATURED',
    date: 'OCTOBER 24, 2024',
    title: 'KSBM National Business Summit 2024: Navigating the AI Frontier',
    description: 'Over 50 industry experts converged at KSBM to discuss the transformative power of AI in modern business management. The summit highlighted key strategies for integrating AI into core business operations, creating new avenues for growth and innovation.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop' // Auditorium/conference
  };

  const sideArticles = [
    {
      id: 2,
      date: 'OCTOBER 15, 2024',
      title: 'KSBM Students Win National HR Conclave 2024',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop' // Students/award
    },
    {
      id: 3,
      date: 'OCTOBER 08, 2024',
      title: "Inauguration of the 'Innovate KSBM' Incubation Lab",
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop' // Lab/tech
    },
    {
      id: 4,
      date: 'SEPTEMBER 28, 2024',
      title: 'New Global Faculty Partnership with Zurich School of Finance',
      image: 'https://images.unsplash.com/photo-1577415124228-28d546bd7cc6?q=80&w=2070&auto=format&fit=crop' // Meeting/handshake or graphic
    }
  ];

  return (
    <section className="w-full bg-background py-20 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-14 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-primary">
            Latest From KSBM
          </h2>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Featured Article */}
          <div className="w-full lg:w-[60%] group cursor-pointer">
            {/* Image Wrapper */}
            <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden mb-8 shadow-sm">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Featured Badge */}
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white text-[0.65rem] font-bold tracking-[0.2em] px-4 py-2 rounded-full border border-white/20 uppercase">
                {featuredArticle.tag}
              </div>
            </div>

            {/* Content */}
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
              {featuredArticle.date}
            </p>
            <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4 leading-[1.3] group-hover:text-primary transition-colors duration-300">
              {featuredArticle.title}
            </h3>
            <p className="text-text-secondary text-[0.95rem] leading-relaxed max-w-[95%]">
              {featuredArticle.description}
            </p>
          </div>

          {/* Right Column: Side Articles List */}
          <div className="w-full lg:w-[40%] flex flex-col gap-8 justify-between">
            {sideArticles.map((article) => (
              <div key={article.id} className="flex gap-6 items-center group cursor-pointer">
                {/* Image Wrapper */}
                <div className="w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] shrink-0 rounded-2xl overflow-hidden shadow-sm">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Content */}
                <div className="flex flex-col justify-center">
                  <p className="text-[0.65rem] font-bold text-text-secondary uppercase tracking-[0.15em] mb-2">
                    {article.date}
                  </p>
                  <h4 className="text-lg lg:text-xl font-bold text-primary leading-snug group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default NewsSection;
