// site/eleventy.config.js
const { logToConsole } = require("dwkns-eleventy-plugins");
const _ = require("lodash");
const slugify = require("slugify");
const posts = require("./src/_data/posts.js");

const pluralize = require("pluralize");
const util = require("util");

let slugPrefix = "/insights/"; // the prefix for the slug could be articles/ or blog/ etc

/**
 * Returns an array of unique categories from an array of objects that has a key that matches the categoryKey
 * @param {Array} arrayOfObjects // array of objects
 * @param {String} categoryKey // the key to use to get the unique categories
 * @returns {Array} // array of unique categories
 */
const getUniqueCategories = (arrayOftypesOrCategories, istypeOrCategory) => {
  let allValues = arrayOftypesOrCategories.map((item) => {
    return item[istypeOrCategory];
  });
  istypeOrCategory == "type"
    ? allValues.unshift("any") // add 'any' to the beginning of the array
    : allValues.unshift("all"); // add 'all' to the beginning of the array
  let uniqueValues = [...new Set(allValues)];
  return uniqueValues;
};

const createIndexSlugsForChunksOfPosts = (chunks, slug = "") => {
  let indexPageSlugs = chunks.map((chunk, index) => {
    // return the just slug if this is the first page
    // otherwise return the slug and /2/ /3/ etc for the next index pages
    return index == 0 ? slug : `${slug}${index + 1}/`;
  });
  return indexPageSlugs;
};

const getMetaCategories = (uniqueTypes, uniqueCategories) => {
  // create an array of objects that contains all the possible combinations
  // of types and categories allows for 'any' type and 'all' categories
  // creates a pluralized slug for each
  let metaCategories = uniqueTypes.map((currentType) => {
    return uniqueCategories.map((currentCategory) => {
      pluralize.addUncountableRule("all"); // don't pluralize 'all'
      pluralize.addUncountableRule("any"); // on't pluralize 'any'
      const type = currentType.toLowerCase();
      const category = currentCategory.toLowerCase();
      const typePlural = pluralize(type);
      const categoryPlural = pluralize(category);
      const metaCategoryName = `${type}-${category}`;

      let slug = `${type}/${category}/`;

      if (metaCategoryName == "any-all") {
        slug = ``;
      } else if (type == "any") {
        slug = `${category}/`;
      } else if (category == "all") {
        slug = `${type}/`;
      }

      return {
        metaCategoryName: metaCategoryName,
        type: type,
        category: category,
        // typePlural: typePlural,
        // categoryPlural: categoryPlural,
        slug: slugPrefix + slug,
      };
    });
  });
  metaCategories = metaCategories.flat();
  return metaCategories;
};

const createMetaCategoriesCollection = (posts, resultsPerIndexPage = 5) => {
  const getMetaCategoryData = (posts, metaCategory) => {
    postsInThisMetaCategory = posts.filter((post) => {
      if (metaCategory.type == "any" && metaCategory.category == "all") {
        return true;
      }
      if (metaCategory.type == "any") {
        return post.category == metaCategory.category;
      }
      if (metaCategory.category == "all") {
        return post.type == metaCategory.type;
      }
      if (post.metaCategoryName == metaCategory.metaCategoryName) {
        return true;
      }
    });

    let chunks = _.chunk(postsInThisMetaCategory, resultsPerIndexPage);
    let indexPageSlugs = createIndexSlugsForChunksOfPosts(
      chunks,
      metaCategory.slug
    );

    return {
      numberOfPosts: postsInThisMetaCategory.length,
      allPosts: postsInThisMetaCategory,
      chunkedPosts: chunks,
      indexPageSlugs: indexPageSlugs,
      numberOfChunksOfPosts: chunks.length,
    };
  };

  const uniqueTypes = getUniqueCategories(posts, "type"); // get unique types of post
  const uniqueCategories = getUniqueCategories(posts, "category"); // get unique categories of post
  const metaCategories = getMetaCategories(uniqueTypes, uniqueCategories);

  // for each metaCategory Chunk up the posts by
  // the number of results per page we want.
  // Used to create our index pages.
  metaCategories.forEach((metaCategory) => {
    metaCategoryData = getMetaCategoryData(posts, metaCategory);
    metaCategory.allPosts = metaCategoryData.allPosts;
    metaCategory.chunkedPosts = metaCategoryData.chunkedPosts;
    metaCategory.indexPageSlugs = metaCategoryData.indexPageSlugs;
    metaCategory.numberOfChunksOfPosts = metaCategoryData.numberOfChunksOfPosts;
    metaCategory.numberOfPosts = metaCategoryData.numberOfPosts;
  });
  globalMetaCategories = metaCategories;
  return {
    uniqueTypes,
    uniqueCategories,
    metaCategories,
  };
};

const createIndexPages = (metaCategories) => {
  let indexPages = [];

  postsByCategories = metaCategories.map((metaCategory) => {
    let indexPageSlugs = metaCategory.indexPageSlugs;
    let chunkedPosts = metaCategory.chunkedPosts;

    chunkedPosts.forEach((chunkOfPosts, index) => {
      isFirstPage = index == 0 ? true : false;
      isLastPage =
        chunkOfPosts.numberOfPagesOfPosts == index + 1 ? true : false;

      indexPages.push({
        name: metaCategory.metaCategoryName,
        category: metaCategory.category,
        type: metaCategory.type,
        slug: indexPageSlugs[index], // the slug for this page
        totalPages: metaCategory.numberOfChunksOfPosts, // total number of pages of posts
        numberOfPosts: metaCategory.numberOfPosts, // total number of posts in this category
        isFirstPage: isFirstPage, // true if this is first chunk/page of results.
        isLastPage: isLastPage, // true if this is last chunk/page of results.
        currentPage: index + 1, // the current page (useful for UI)
        // contructs the pageslugs needed for pagination controls.
        pageSlugs: {
          all: indexPageSlugs,
          next: indexPageSlugs[index + 1] || null,
          previous: indexPageSlugs[index - 1] || null,
          first: indexPageSlugs[0] || null,
          last: indexPageSlugs[indexPageSlugs.length - 1] || null,
          count: indexPageSlugs.length,
        },

        thisIs: `page ${index + 1} of ${
          metaCategory.numberOfChunksOfPosts
        } in ${metaCategory.metaCategoryName}`,
        posts: chunkOfPosts, // the posts in this chunk
      });

      // console.log(`[ chunkedPosts ]:`, chunkedPosts.length);
    });
  });
  return indexPages;
};

module.exports = (eleventyConfig) => {
  eleventyConfig.addCollection("metaCategoriesCollection", (collectionApi) => {
    // get the posts from posts collection
    const posts = collectionApi.getAll()[0].data.posts;
    return createMetaCategoriesCollection(posts);
  });

  eleventyConfig.addCollection("indexPages", (collectionApi) => {
    const posts = collectionApi.getAll()[0].data.posts;
    metaCategories = createMetaCategoriesCollection(posts).metaCategories;
    return createIndexPages(metaCategories);
  });

  eleventyConfig.addPlugin(logToConsole, {
    logToHtml: true,
    logToConsole: false,
    colorizeConsole: true,
  });

  eleventyConfig.setServerOptions({
    domdiff: false, // reload instead of domdiff
    port: 8080,
    showAllHosts: false,
    showVersion: false,
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
