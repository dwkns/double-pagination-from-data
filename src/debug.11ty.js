const util = require("util");

module.exports = class Test {
  data() {
    return {
      permalink: "/debug.json",
    };
  }

  render(data) {
    var { posts, collections } = data;

    // need to destructure data properties since we can't dump entire data obj
    var output = { posts, metaCategories: collections.metaCategories };
    var consoleFriendly = util.inspect(output, false, 4, true);
    var jsonFileFiendly = JSON.stringify(output, null, 2);
    // console.log(`[ DEBUG ]:`, consoleFriendly);
    return jsonFileFiendly;
  }
};

// var output = { dogs, dogsCol: collections.dogsCol };
// var
// return stringify;
a = [
  {
    chunks: {
      metaCategoryName: "any-all",
      posts: [Array],
      chunkedPosts: [Array],
      numberOfPosts: 15,
      numberOfPagesOfPosts: 5,
      indexPageSlugs: [Array],
      identifier: "any-all",
      type: "any",
      category: "all",
    },
    categoryData: {
      metaCategoryName: "any-all",
      type: "any",
      category: "all",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/",
      numberOfPosts: 15,
    },
  },
  {
    chunks: {
      metaCategoryName: "any-rock",
      posts: [Array],
      chunkedPosts: [Array],
      numberOfPosts: 4,
      numberOfPagesOfPosts: 2,
      indexPageSlugs: [Array],
      identifier: "any-rock",
      type: "any",
      category: "rock",
    },
    categoryData: {
      metaCategoryName: "any-rock",
      type: "any",
      category: "rock",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/rock/",
      numberOfPosts: 4,
    },
  },
  {
    chunks: {
      metaCategoryName: "any-paper",
      posts: [Array],
      chunkedPosts: [Array],
      numberOfPosts: 2,
      numberOfPagesOfPosts: 1,
      indexPageSlugs: [Array],
      identifier: "any-paper",
      type: "any",
      category: "paper",
    },
    categoryData: {
      metaCategoryName: "any-paper",
      type: "any",
      category: "paper",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/paper/",
      numberOfPosts: 2,
    },
  },
  {
    chunks: {
      metaCategoryName: "any-sissors",
      posts: [Array],
      chunkedPosts: [Array],
      numberOfPosts: 9,
      numberOfPagesOfPosts: 3,
      indexPageSlugs: [Array],
      identifier: "any-sissors",
      type: "any",
      category: "sissors",
    },
    categoryData: {
      metaCategoryName: "any-sissors",
      type: "any",
      category: "sissors",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/sissors/",
      numberOfPosts: 9,
    },
  },
  {
    chunks: {
      metaCategoryName: "article-all",
      posts: [Array],
      chunkedPosts: [Array],
      numberOfPosts: 10,
      numberOfPagesOfPosts: 4,
      indexPageSlugs: [Array],
      identifier: "article-all",
      type: "article",
      category: "all",
    },
    categoryData: {
      metaCategoryName: "article-all",
      type: "article",
      category: "all",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/article/",
      numberOfPosts: 10,
    },
  },
  {
    chunks: {
      metaCategoryName: "article-rock",
      posts: [],
      chunkedPosts: [],
      numberOfPosts: 0,
      numberOfPagesOfPosts: 0,
      indexPageSlugs: [],
      identifier: "article-rock",
      type: "article",
      category: "rock",
    },
    categoryData: {
      metaCategoryName: "article-rock",
      type: "article",
      category: "rock",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/article/rock/",
      numberOfPosts: 0,
    },
  },
  {
    chunks: {
      metaCategoryName: "article-paper",
      posts: [],
      chunkedPosts: [],
      numberOfPosts: 0,
      numberOfPagesOfPosts: 0,
      indexPageSlugs: [],
      identifier: "article-paper",
      type: "article",
      category: "paper",
    },
    categoryData: {
      metaCategoryName: "article-paper",
      type: "article",
      category: "paper",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/article/paper/",
      numberOfPosts: 0,
    },
  },
  {
    chunks: {
      metaCategoryName: "article-sissors",
      posts: [],
      chunkedPosts: [],
      numberOfPosts: 0,
      numberOfPagesOfPosts: 0,
      indexPageSlugs: [],
      identifier: "article-sissors",
      type: "article",
      category: "sissors",
    },
    categoryData: {
      metaCategoryName: "article-sissors",
      type: "article",
      category: "sissors",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/article/sissors/",
      numberOfPosts: 0,
    },
  },
  {
    chunks: {
      metaCategoryName: "video-all",
      posts: [Array],
      chunkedPosts: [Array],
      numberOfPosts: 5,
      numberOfPagesOfPosts: 2,
      indexPageSlugs: [Array],
      identifier: "video-all",
      type: "video",
      category: "all",
    },
    categoryData: {
      metaCategoryName: "video-all",
      type: "video",
      category: "all",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/video/",
      numberOfPosts: 5,
    },
  },
  {
    chunks: {
      metaCategoryName: "video-rock",
      posts: [],
      chunkedPosts: [],
      numberOfPosts: 0,
      numberOfPagesOfPosts: 0,
      indexPageSlugs: [],
      identifier: "video-rock",
      type: "video",
      category: "rock",
    },
    categoryData: {
      metaCategoryName: "video-rock",
      type: "video",
      category: "rock",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/video/rock/",
      numberOfPosts: 0,
    },
  },
  {
    chunks: {
      metaCategoryName: "video-paper",
      posts: [],
      chunkedPosts: [],
      numberOfPosts: 0,
      numberOfPagesOfPosts: 0,
      indexPageSlugs: [],
      identifier: "video-paper",
      type: "video",
      category: "paper",
    },
    categoryData: {
      metaCategoryName: "video-paper",
      type: "video",
      category: "paper",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/video/paper/",
      numberOfPosts: 0,
    },
  },
  {
    chunks: {
      metaCategoryName: "video-sissors",
      posts: [],
      chunkedPosts: [],
      numberOfPosts: 0,
      numberOfPagesOfPosts: 0,
      indexPageSlugs: [],
      identifier: "video-sissors",
      type: "video",
      category: "sissors",
    },
    categoryData: {
      metaCategoryName: "video-sissors",
      type: "video",
      category: "sissors",
      typePlural: undefined,
      categoryPlural: undefined,
      slug: "/insights/video/sissors/",
      numberOfPosts: 0,
    },
  },
];

console.log(`[ a.length ]:`, a.length);
