import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

//Internal Imports
import Style from "./TeamComposition.module.css";
import img from "./../../img/index";

const TeamComposition = () => {

    const founderArray = [
        {
            name: "MR. BLUE",
            position: "Blockchain & Software Developer",
            image: "MrBlue",
            linkedIn: "https://www.linkedin.com/in/filippo-andretta-28a40a210"
        },
        {
            name: "MR. WHITE",
            position: "Blockchain Developer",
            favority_song_variation: "I Shoot The Sherif- Eric Clapton",
            image: "MrWhite",
            linkedIn: "https://www.linkedin.com/in/gianmaria-carnazzi-1a0a38184"
        },
        {
            name: "MR. PURPLE",
            position: "Art Director",
            favority_song_variation: "I Shoot The Sherif- Eric Clapton",
            image: "MrPurple",
            linkedIn: "https://www.instagram.com/loweallas/"
        },
        {
            name: "MR. YELLOW",
            position: "Mobile App Developer",
            favority_song_variation: "I Shoot The Sherif- Eric Clapton",
            image: "MrYellow",
            linkedIn: "https://www.linkedin.com/in/alberto-noris-b31035211"
        },
    ];

    return (
        <div className={Style.TeamComposition}>
            <h2 className="font-large">Team composition</h2>
            <div className={Style.TeamComposition_bottom}>
                {founderArray.map((el, i) => (
                    <Link href={`${el.linkedIn}`} className={Style.TeamComposition_bottom_card} key={el.name}>
                        <Image
                            src={img[`${el.image}`]} className={Style.image} alt={`Team image ${i}`} contain="fill" />
                        <div className={Style.TeamComposition_bottom_card_right}>
                            <h3 className="font-normal">{el.name}</h3>
                            <small className="font-small">{el.position}</small>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default TeamComposition