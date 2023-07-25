import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const JOKE_URL = "https://v2.jokeapi.dev/joke";
const categories = ["Programming", "Miscellaneous", "Dark", "Pun", "Spooky", "Christmas"];
const maxAmount = 3;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const url = `${JOKE_URL}/Any`;
  const joke = await axios.get(url);
  res.render("index", { data: joke.data, categories: categories, maxAmount: maxAmount });
});

app.post("/", async (req, res) => {
  const category = req.body.category;
  let url = "";
  if (category === "") {
    url = `${JOKE_URL}/Any`;
  } else {
    url = `${JOKE_URL}/${category}`;
  }
  const config = {
    params: {
      amount: req.body.amount
    }
  };
  const joke = await axios.get(url, config);
  const data = joke.data;
  let result = { categories: categories, maxAmount: maxAmount };
  if (data.error) {
    result.error = data;
  } else {
    result.data = data;
  }
  res.render("index", result);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
