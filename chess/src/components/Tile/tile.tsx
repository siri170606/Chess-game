import React from "react";
import "./tile.css";

interface TileProps {
  number: number;
  image?: string;
}

const Tile: React.FC<TileProps> = ({ number, image }) => {
  const isBlack = number % 2 === 0;
  return (
    <div className={`tile ${isBlack ? "black-tile" : "white-tile"}`}>
      {image && <img src={image} alt="" className="chess-piece" draggable={false} />}
    </div>
  );
};

export default Tile;
