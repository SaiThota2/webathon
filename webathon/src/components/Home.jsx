import Navbar from "./Navbar";
import React, { useEffect } from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';
import SwiperSlide from "./SwiperSlide";
import './Home.css';



const Home = () => {
  const slides = [
    {
        classModifier: 'one',
        title: 'T.Manikanta-21PA1A54B0',
        description: 'Placed With 23.4LPA In Amazon...',
        // link: 'https://en.wikipedia.org/wiki/Jellyfish'
    },
    {
        classModifier: 'two',
        title: 'V.Raghavendra-21PA1A54B8',
        description: 'Placed With 20.5LPA In Web-technologies...',
        // link: 'https://en.wikipedia.org/wiki/Seahorse'
    },
    {
      classModifier: 'three',
      title: 'P.Sri Teja-21PA1A5481',
      description: 'Placed With 15.8LPA In Walmart...',
      // link: 'https://en.wikipedia.org/wiki/Seahorse'
  },
    // ... add other slides data here
];

useEffect(() => {
    new Swiper(".swiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 3,
            slideShadows: true
        },
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
            1560: { slidesPerView: 3 }
        }
    });
}, []);

  
  return (
    <div>
      <Navbar />        
      <main>
            <div>
                <span>discover</span>
                <h1>OUR TOP PLACEMENTS</h1>
                <hr />
                <p>This year has been a great year and out Students placed in some of the top companies as shown</p>
            </div>
            <div className="swiper">
                <div className="swiper-wrapper">
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index} data={slide} />
                    ))}
                </div>
                <div className="swiper-pagination"></div>
            </div>
            {/* Add your images here */}
        </main>
      </div>
  );
};

export default Home;







