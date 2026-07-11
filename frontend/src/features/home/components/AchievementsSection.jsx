"use client";
import React from 'react';
const awardImg = '/assets/Images/achievement_award.png';
const sportsImg = '/assets/Images/achievement_sports.png';
const posterImg = '/assets/Images/achievement_poster.png';

const AchievementsSection = () => {
  const achievements = [
    {
      id: 1,
      category: 'Academics',
      date: 'Oct 30, 2024',
      title: 'National Research Excellence Award',
      description: 'Recognizing outstanding contributions to sustainable technology research.',
      image: awardImg
    },
    {
      id: 2,
      category: 'Sports',
      date: 'Oct 25, 2024',
      title: 'Championship Victory in Inter-University League',
      description: 'Our varsity team secures the gold in the regional finals.',
      image: sportsImg
    },
    {
      id: 3,
      category: 'Community',
      date: 'Oct 20, 2024',
      title: 'Social Impact Leadership Award',
      description: 'Honoring our student volunteers for their dedication to local literacy programs.',
      image: posterImg
    }
  ];

  return (
    <section className="w-full bg-background py-12 lg:py-14">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-text-secondary text-[0.65rem] lg:text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            College Achievements
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-primary">
            Awards and Achievements
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 w-full mx-auto">
          {achievements.map((item) => (
            <div key={item.id} className="group cursor-pointer flex flex-col">

              {/* Image */}
              <div className="w-full h-[180px] md:h-[200px] rounded-2xl overflow-hidden mb-6 shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Meta Info (Category & Date) */}
              <p className="text-[0.65rem] font-semibold text-primary tracking-widest uppercase mb-3 flex items-center gap-2">
                {item.category} <span className="w-1 h-1 rounded-full bg-primary"></span> {item.date}
              </p>

              {/* Title */}
              <h3 className="text-xl lg:text-2xl font-semibold text-text-primary mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed">
                {item.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AchievementsSection;

