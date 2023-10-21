import React from 'react';
import './Card.css';
import Profile from './Images/profile.jpeg';

function CardComponent() {
  const cards = [
    {
      link: "https://www.mythrillfiction.com/the-dark-rider",
      coverImage: "https://ggayane.github.io/css-experiments/cards/dark_rider-cover.jpg",
      titleImage: "https://ggayane.github.io/css-experiments/cards/dark_rider-title.png",
      characterImage: "https://ggayane.github.io/css-experiments/cards/dark_rider-character.webp"
    },
    {
      link: "https://www.mythrillfiction.com/force-mage",
      coverImage: {Profile},
      titleImage: "https://ggayane.github.io/css-experiments/cards/force_mage-title.png",
      characterImage: "https://ggayane.github.io/css-experiments/cards/force_mage-character.webp"
    },
    {
      link: "https://www.mythrillfiction.com/force-mage",
      coverImage: "https://ggayane.github.io/css-experiments/cards/force_mage-cover.jpg",
      titleImage: "https://ggayane.github.io/css-experiments/cards/force_mage-title.png",
      characterImage: "https://ggayane.github.io/css-experiments/cards/force_mage-character.webp"
    }
  ];

  return (
    <div className='flex'>
      {cards.map((card, index) => (
        <a key={index} href={card.link} alt="Mythrill" target="_blank" rel="noopener noreferrer">
          <div className="card">
            <div className="wrapper">
              <img src={card.coverImage} alt="Cover" className="cover-image" />
            </div>
            <img src={card.titleImage} alt="Title" className="title" />
            <img src={card.characterImage} alt="Character" className="character" />
          </div>
        </a>
      ))}
    </div>
  );
}

export default CardComponent;
