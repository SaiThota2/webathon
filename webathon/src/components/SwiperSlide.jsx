import React from 'react';
import { Link } from 'react-router-dom';

function SwiperSlide({ data }) {
    return (
        <div className={`swiper-slide swiper-slide--${data.classModifier}`}>
            <div>
                <h2>{data.title}</h2>
                <p>{data.description}</p>
                <Link
                to="/register">
              Explore
            </Link>
            </div>
        </div>
    );
}

export default SwiperSlide;
