// site/eleventy.config.js
const { logToConsole } = require("dwkns-eleventy-plugins");
const _ = require("lodash");
const slugify = require("slugify");
const util = require("util");
const data = require("./src/_data/data.js");

let slugPrefix = "articles/"; // the prefix for the slug could be articles/ or blog/ etc

/**
 * Returns an array of unique categories from an array of objects that has a key that matches the categoryKey
 * @param {Array} arrayOfObjects // array of objects
 * @param {String} categoryKey // the key to use to get the unique categories
 * @returns {Array} // array of unique categories
 */
const getUniqueCategories = (arrayOfObjects, categoryKey) => {
  return [...new Set(arrayOfObjects.map((item) => item[categoryKey]))];
};

module.exports = (eleventyConfig) => {
  let categoryData = [];

  // Add a collection of all the posts
  eleventyConfig.addCollection("allPosts", (collection) => {
    // create a slug for each post
    data.forEach((post) => {
      const opts = { lower: true };
      const prefix = slugify(slugPrefix, opts);
      const title = slugify(post.title, opts);
      post.slug = `/${prefix}/${title}/`;
      post.typeAndCategory = `${post.type.toLowerCase()}-${post.category.toLowerCase()}`;
    });
    return data;
  });

  const createIndexSlugsForChunksOfPosts = (chunks, slug = "") => {
    let indexPageSlugs = chunks.map((chunk, index) => {
      // return the just slug if this is the first page
      // otherwise return the slug and /2/ /3/ etc for the next index pages
      return index == 0 ? slug : `${slug}${index + 1}/`;
    });
    return indexPageSlugs;
  };

  function chunkPostsByTypeAndCategory(
    posts,
    typesAndCategories,
    resultsPerIndexPage = 3
  ) {
    pageDataForAllCategories = typesAndCategories.map((categoryName) => {
      const typeOrCategoryFromTypeAndCategory = (typeAndCategory) => {
        // accepts type-category or any-category or type-all
        if (typeAndCategory.startsWith("any-")) {
          return typeAndCategory.slice("any-".length);
        }
        if (typeAndCategory.endsWith("-all")) {
          return typeAndCategory.slice(0, -"-all".length);
        }
        return typeAndCategory;
      };

      // filter out all the posts that match the current category
      // or if the current category is 'all' then return all the posts
      const postsInThisCategory = posts.filter((post, index) => {
        console.log(`[ categoryName ]:`, categoryName);
        let typeOrCategory = typeOrCategoryFromTypeAndCategory(categoryName);

        if (
          post.typeAndCategory == categoryName ||
          categoryName == "any-all" ||
          typeOrCategory == post.category ||
          typeOrCategory == post.type
        ) {
          return true;
        }
      });

      console.log(`[ posts in ${categoryName}]:`, postsInThisCategory.length);

      // use lodash to chunk up all the posts in this category by the number of results/page we want.
      let chunks = _.chunk(postsInThisCategory, resultsPerIndexPage);

      // Filter the categoryName from the slug if the category is 'all'
      let baseSlug =
        categoryName == "any-all"
          ? `/${slugPrefix}`
          : `/${slugPrefix}${slugify(categoryName, { lower: true })}/`;

      let indexPageSlugs = createIndexSlugsForChunksOfPosts(chunks, baseSlug);

      // construct an simple categoryData object to be passed to page to make UI easier.
      categoryData.push({
        name: categoryName,
        slug: baseSlug,
        numberOfPosts: postsInThisCategory.length,
      });

      return {
        categoryName: categoryName,
        posts: postsInThisCategory,
        categoryData: categoryData,
        chunkedPosts: chunks,
        numberOfPosts: postsInThisCategory.length,
        numberOfPagesOfPosts: chunks.length,
        indexPageSlugs: indexPageSlugs,
      };
    });
    return pageDataForAllCategories;
  }

  const getAllTypesAndCategories = (posts) => {
    let uniqueTypes = getUniqueCategories(posts, "type"); // get unique types of post
    uniqueTypes.push("any"); // allow for 'any' type of post

    let uniqueCategories = getUniqueCategories(posts, "category"); // get unique categories of post
    uniqueCategories.push("all"); // allow for 'all' categories of post

    // get all type-category combinations
    allTypesAndCategories = uniqueTypes.map((type) => {
      return uniqueCategories.map((category) => {
        return `${type.toLowerCase()}-${category.toLowerCase()}`;
      });
    });

    allTypesAndCategoriesObj = uniqueTypes.map((type) => {
      return uniqueCategories.map((category) => {
        currentType = type.toLowerCase();
        currentCategory = category.toLowerCase();
        key = `${currentType}-${currentCategory}`;
        let obj = {};

        obj[key] = {
          type: currentType,
          category: currentCategory,
        };
        console.log(`[ obj ]:`, obj);
        return obj;
      });
    });

    //return a flattend array of all the type-category combinations
    return {
      array: allTypesAndCategories.flat(),
      object: allTypesAndCategoriesObj,
    };
  };

  eleventyConfig.addCollection("postsByCategories", (collection) => {
    everything = getAllTypesAndCategories(data);
    allTypesAndCategories = everything.array;

    console.log(`[ everything ]:`, everything.object);

    let postsByCategories = [];
    let pageDataForAllCategories = chunkPostsByTypeAndCategory(
      (posts = data),
      (typesAndCategories = everything.array),
      (resultsPerIndexPage = 3)
    );

    // console.log(`[ pageDataForAllCategories ]:`, pageDataForAllCategories);

    // create an array containing all the posts and pagination data in postsByCategories
    pageDataForAllCategories.forEach((category) => {
      let thisCategoriesPageSlugs = category.indexPageSlugs;

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
    // console.log(
    //   `[ postsByCategories ]:`,
    //   util.inspect(postsByCategories, true, 6, true)
    // );
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
