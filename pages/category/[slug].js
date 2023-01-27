import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { getCategories, getCategoryPost } from '../../services';
import { PostCard, Categories, Loader, NotFoundPage, Button } from '../../components';

const CategoryPost = ({ posts }) => {

  const router = useRouter();

  if (router.isFallback) {
    return <Loader />;
  }

  //not found page
  if (posts.length === 0) {
    return <NotFoundPage />
  }

  //get curent category name
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const getCategoryName = async () => {
      const categories = await getCategories();
      const currentCategory = categories.filter(
        (category) => category.slug === router.query.slug
      );
      setCategoryName(currentCategory[0].name);
    };
    getCategoryName();
  }, [router.query.slug]);

  //view more
  const [limitPost, setLimitPost] = useState(5);
  let showPosts = posts.slice(0, limitPost);

  const [showViewMore, setShowViewMore] = useState(false);
  
  const handleViewMore = () => {
    setLimitPost(limitPost + 5);
    showPosts = posts.slice(0, limitPost);
  }

  useEffect(() => {
    if (posts.length > limitPost) {
      setShowViewMore(true);
    } else {
      setShowViewMore(false);
    }
  }, [limitPost])


  return (
    <div className="container mx-auto px-10 mb-8 min-h-screen">
      <Head>
        <title>{`Chủ đề: ${categoryName}`}</title>
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8 mt-20">
          {showPosts.map((post, index) => (
            <PostCard key={index} post={post.node} />
          ))}
          <div className='float-right'>
            {
              showViewMore &&
              <Button onClick={() => handleViewMore()}>
                  <span className='inline-block'>Xem thêm <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 inline-block"><path fill='#e2e8f0' d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></span>
              </Button>
            }
          </div>
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative lg:sticky top-20">
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CategoryPost;

// Fetch data at build time
export async function getStaticProps({ params }) {
  const posts = await getCategoryPost(params.slug);

  return {
    props: { posts },
  };
}

//get curent category name
export async function getStaticPaths() {
  const categories = await getCategories();
  return {
    paths: categories.map(({ slug }) => ({ params: { slug } })),
    fallback: true,
  };
}