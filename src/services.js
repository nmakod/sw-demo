export const fetchNews = () => {
  return fetch(
    "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=4dbc17e007ab436fb66416009dfb59a8"
  ).then((response) => response.json());
};
