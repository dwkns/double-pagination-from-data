const slugify = require("slugify");
const data = [
  {
    title: "post 1",
    type: "article",
    category: "rock",
    content: "<p>some content</p>",
  },
  {
    title: "post 2",
    type: "video",
    category: "rock",
    content: "<p>some content</p>",
  },
  {
    title: "post 3",
    type: "video",
    category: "rock",
    content: "<p>some content</p>",
  },
  {
    title: "post 4",
    type: "article",
    category: "rock",
    content: "<p>some content</p>",
  },
  {
    title: "post 5",
    type: "article",
    category: "paper",
    content: "<p>some content</p>",
  },
  {
    title: "post 6",
    type: "article",
    category: "paper",
    content: "<p>some content</p>",
  },
  {
    title: "post 7",
    type: "article",
    category: "sissors",
    content: "<p>some content</p>",
  },
  {
    title: "post 8",
    type: "article",
    category: "sissors",
    content: "<p>some content</p>",
  },
  {
    title: "post 9",
    type: "article",
    category: "sissors",
    content: "<p>some content</p>",
  },
  {
    title: "post 10",
    type: "article",
    category: "sissors",
    content: "<p>some content</p>",
  },
  {
    title: "post 11",
    type: "article",
    category: "sissors",
    content: "<p>some content</p>",
  },
  {
    title: "post 12",
    type: "article",
    category: "sissors",
    content: "<p>some content</p>",
  },
  {
    title: "post 13",
    type: "video",
    category: "sissors",
    content: "<p>some content</p>",
  },
  {
    title: "post 14",
    type: "video",
    category: "sissors",
    content: "<p>some content</p>",
  },
  {
    title: "post 15",
    type: "video",
    category: "sissors",
    content: "<p>some content</p>",
  },
];

const getStats = () => {
  let allPosts = 0;
  let videos = 0;
  let articles = 0;
  let rock = 0;
  let paper = 0;
  let sissors = 0;
  let videoPaper = 0;
  let articlePaper = 0;
  let videoSissors = 0;
  let articleSissors = 0;
  let videoRock = 0;
  let articleRock = 0;

  data.map((post) => {
    allPosts++;
    if (post.type === "article") {
      articles++;
    }

    if (post.type === "video") {
      videos++;
    }

    if (post.category === "rock") {
      if (post.type === "video") {
        videoRock++;
      } else if (post.type === "article") {
        articleRock++;
      }
      rock++;
    }

    if (post.category === "paper") {
      if (post.type === "video") {
        videoPaper++;
      } else if (post.type === "article") {
        articlePaper++;
      }
      paper++;
    }

    if (post.category === "sissors") {
      if (post.type === "video") {
        videoSissors++;
      } else if (post.type === "article") {
        articleSissors++;
      }
      sissors++;
    }
  });
  return {
    allPosts,
    rock,
    paper,
    sissors,
    articles,
    articleRock,
    articlePaper,
    articleSissors,
    videos,
    videoRock,
    videoPaper,
    videoSissors,
  };
};

const slugPrefix = "/insights/";
const posts = data.map((post, index) => {
  const opts = { lower: true };
  const prefix = slugify(slugPrefix, opts);
  const title = slugify(post.title, opts);
  const metaCategory = `${post.type.toLowerCase()}-${post.category.toLowerCase()}`;
  // check data and complain if there are dublicate slugs

  return {
    ...post,
    identifier: metaCategory,
    metaCategoryName: metaCategory,
    slug: `/${prefix}/${title}/`,
  };
});

// console.log(`[ getStats() ]:`, getStats());
module.exports = posts;
