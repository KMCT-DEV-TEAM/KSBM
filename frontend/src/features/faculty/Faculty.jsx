"use client";
import React, { useState, useEffect } from 'react';
import FacultyHero from './components/FacultyHero';
import FacultyIntro from './components/FacultyIntro';
import FacultyGridSection from './components/FacultyGridSection';
import api from '../../api/axios';

const defaultFacultyData = {
  heroHeading: "Faculty Members",
  heroSubtext: "Our distinguished faculty are committed to delivering quality education through innovative teaching, practical learning, and personalized mentorship, helping students build the skills and confidence needed for successful careers.",
  heroBgImage: "/assets/Images/image 2.png",
  introSubheading: "FACULTY MEMBERS",
  introHeading: "Learn from the Best",
  introText: "At KSBM, our faculty members are the cornerstone of academic excellence. With a blend of strong academic credentials, industry expertise, and a passion for teaching, they create a dynamic learning environment that encourages critical thinking, innovation, and leadership. Beyond the classroom, our faculty mentor, inspire, and guide students through every stage of their academic journey, equipping them with the knowledge, confidence, and practical skills needed to succeed in an ever-evolving global business landscape.",
  ksbmFaculty: [
    { _id: "1", name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "2", name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "3", name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "4", name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "5", name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "6", name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "7", name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "8", name: "Aleena Joseph", title: "Assistant Professor in Business Management", image: "/assets/Images/image 31.png" }
  ],
  adjunctFaculty: [
    { _id: "a1", name: "Aleena Joseph", title: "Adjunct Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "a2", name: "Aleena Joseph", title: "Adjunct Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "a3", name: "Aleena Joseph", title: "Adjunct Professor in Business Management", image: "/assets/Images/image 31.png" },
    { _id: "a4", name: "Aleena Joseph", title: "Adjunct Professor in Business Management", image: "/assets/Images/image 31.png" }
  ]
};

const Faculty = () => {
  const [data, setData] = useState(defaultFacultyData);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await api.get('/cms/faculty');
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Faculty data, using defaults:', error);
      }
    };
    fetchFacultyData();
  }, []);

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <FacultyHero data={data} />
      <FacultyIntro data={data} />
      <FacultyGridSection id="ksbm-faculty" title="KSBM Faculty" members={data?.ksbmFaculty} />
      <FacultyGridSection id="adjunct-faculty" title="Adjunct Faculty" members={data?.adjunctFaculty} />
    </div>
  );
};

export default Faculty;
