// site/eleventy.config.js
const { logToConsole } = require("dwkns-eleventy-plugins");
const _ = require("lodash");
const slugify = require("slugify");
const util = require("util");
let data = [
  {
    title: "post 1",
    country: "US",
    slug: "us/post-1/",
  },
  {
    title: "post 2",
    country: "US",
    slug: "us/post-2/",
  },
  {
    title: "post 3",
    country: "US",
    slug: "us/post-3/",
  },
  {
    title: "post 4",
    country: "US",
    slug: "us/post-4/",
  },
  {
    title: "post 5",
    country: "US",
    slug: "us/post-5/",
  },
  {
    title: "post 6",
    country: "GB",
    slug: "gb/post-6/",
  },
  {
    title: "post 7",
    country: "GB",
    slug: "gb/post-7/",
  },
  {
    title: "post 8",
    country: "GB",
    slug: "gb/post-8/",
  },
  {
    title: "post 9",
    country: "GB",
    slug: "gb/post-9/",
  },
  {
    title: "post 10",
    country: "GB",
    slug: "gb/post-10/",
  },
  {
    title: "post 11",
    country: "GB",
    slug: "gb/post-11/",
  },
  {
    title: "post 12",
    country: "GB",
    slug: "gb/post-12/",
  },
  {
    title: "post 13",
    country: "GB",
    slug: "gb/post-13/",
  },
  {
    title: "post 14",
    country: "GB",
    slug: "gb/post-14/",
  },
];
module.exports = (eleventyConfig) => {
  // Add a collection of all the posts
  eleventyConfig.addCollection("allPosts", (collection) => {
    return data;
  });

  // Add a collection of all the posts sorted by category
  eleventyConfig.addCollection("postsByCategories", (collection) => {
    let numberOfresultsPerPage = 3; // number of results per page
    let uniqueCategories = ["GB", "US"]; // array of unique categories

    let postsByCategories = [];
    let pageDataForAllCategories = [];
    let categoryData = [];

    // loop over the unique categories
    uniqueCategories.forEach((categoryName) => {
      let allPostinCurrentCategory = [];
      data.forEach((post) => {
        if (post.country == categoryName) {
          allPostinCurrentCategory.push(post);
        }
      });

      // chunk up all the posts in this category by the number of results/page we want.
      let chunks = _.chunk(allPostinCurrentCategory, numberOfresultsPerPage);

      // create a slug for the category
      let slug = `/${slugify(categoryName, { lower: true })}`;

      // create an array of pageSlugs for each chunk of posts
      let pageSlugs = [];
      for (let i = 0; i < chunks.length; i++) {
        let thisSlug = `${slug}`;
        // If there is more than one page of results.
        if (i > 0) {
          thisSlug = `${slug}/${i + 1}`;
        }
        pageSlugs.push(`${thisSlug}`);
      }

      // // construct an simple categoryData object to be passed to page to make UI easier.
      categoryData.push({
        name: categoryName,
        slug: slug,
        numberOfPosts: allPostinCurrentCategory.length,
      });

      pageDataForAllCategories.push({
        categoryName: categoryName,
        posts: allPostinCurrentCategory,
        categoryData: categoryData,
        chunkedPosts: chunks,
        numberOfPosts: allPostinCurrentCategory.length,
        numberOfPagesOfPosts: chunks.length,
        pageSlugs: pageSlugs,
      });
    });

    // console.log(`[ categoryData ]:`, categoryData);

    // create an array containing all the posts and pagination data in postsByCategories
    pageDataForAllCategories.forEach((category) => {
      let thisCategoriesPageSlugs = category.pageSlugs;

      // loop each of the chunked posts
      category.chunkedPosts.forEach((posts, index) => {
        // set some properties useful in the UI
        isFirstPage = index == 0 ? true : false;
        isLastPage = category.numberOfPagesOfPosts == index + 1 ? true : false;

        // contruct the pagination object and add to blogPostsByCategories Arrau
        postsByCategories.push({
          categoryName: category.categoryName,

          // contructs the pageslugs needed for pagination controls.
          pageSlugs: {
            all: thisCategoriesPageSlugs,
            next: thisCategoriesPageSlugs[index + 1] || null,
            previous: thisCategoriesPageSlugs[index - 1] || null,
            first: thisCategoriesPageSlugs[0] || null,
            last:
              thisCategoriesPageSlugs[thisCategoriesPageSlugs.length - 1] ||
              null,
            count: thisCategoriesPageSlugs.length,
          },
          slug: thisCategoriesPageSlugs[index],
          totalPages: category.numberOfPagesOfPosts, // total number of pages of posts
          numberOfPosts: category.numberOfPosts, // total number of posts in this category
          isFirstPage: isFirstPage, // true if this is first chunk/page of results.
          isLastPage: isLastPage, // true if this is last chunk/page of results.
          currentPage: index + 1, // the current page (useful for UI)
          posts: posts, // the posts in this chunk
          categoryData,
        });
      });
    });
    console.log(
      `[ postsByCategories ]:`,
      util.inspect(postsByCategories, true, 6, true)
    );
    return postsByCategories;
  });

  eleventyConfig.addPlugin(logToConsole, {
    logToHtml: true,
    logToConsole: false,
    colorizeConsole: true,
  });
  return {
    dir: {
      input: "src",
      output: "dist",
      layouts: "_layouts",
      data: "_data",
    },
  };
};
