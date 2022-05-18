import React from 'react'
import { useEffect} from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

function News(props){
    const [articles,setArticles]=useState([]);
    const [loading, setLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [totalResults,setTotalResults]=useState(0);
    

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
   
    const updateNews = async() => {
      props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=ff17a4dc7eee4cc6b800af30b5e49d73&page=${page}&pagesize=${props.pageSize}`;
       setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
       props.setProgress(70);
       setArticles(parsedData.articles);
       setLoading(false);
       setTotalResults(parsedData.totalResults)
        props.setProgress(100);
    }
useEffect(()=>{
    updateNews();
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
},[])

    const fetchMoreData = async () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
          const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=ff17a4dc7eee4cc6b800af30b5e49d73&page=${page+1}&pagesize=${props.pageSize}`;
          setPage(page+1)
          let data = await fetch(url);
          let parsedData = await data.json();
          setArticles(articles.concat(parsedData.articles))
          setTotalResults(parsedData.totalResults)
          
      }
    


   
        return (
            <div>
                <h1 className='text-center' style={{ margin: '35px 0', marginTop:'90px'}}>NewsMonkey-Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length!== totalResults}
                    loader={<Spinner />}>
                   <div className="container">
                    <div className='row'>
                        {articles.map((element) => {
                            return (
                                <div className="col-md-4 my-2" key={element.url}>
                                    <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} newsUrl={element.url} imageUrl={element.urlToImage} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            )
                        }
                        )}
                    </div>
                    </div>
                </InfiniteScroll>
              


           
            </div>

        )
    
}
    News.defaultProps = {
        country: "in",
        pageSize: 9,
        category: 'general'
      }
      News.propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
      }


export default News