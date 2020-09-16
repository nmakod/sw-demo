import React from "react";
import styles from "./styles.css";

const Card = (props) => {
  const { title, urlToImage, author } = props;
  console.log(styles);
  return (
    <article className={"card"}>
      <div className="title">{title}</div>
      <img className={"image"} src={urlToImage} />
      <span className={"author"}>{author}</span>
    </article>
  );
};

export default Card;
