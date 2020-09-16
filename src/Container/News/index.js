import React, { useEffect, useState } from "react";
import { fetchNews } from "../../services";
import styles from "./styles.css";
import Card from "./Card";

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetchNews().then((response) => {
      setArticles(response.articles);
    });
  }, []);

  return (
    <section className={"container"}>
      {articles.map((article, index) => (
        <Card key={index} {...article}></Card>
      ))}
    </section>
  );
};

export default NewsPage;
