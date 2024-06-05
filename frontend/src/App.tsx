
import { useEffect, useState } from 'react'
import './App.css'
import { Hero } from './components/Custom/Hero'
import { FlipWordsDemo } from './components/Custom/flipfy'
import { BentoGridDemo } from './components/Custom/griders'
import { BASE_URI } from './components/Custom/constant'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { PropagateLoader } from 'react-spinners'
import { Link } from 'react-router-dom'
import { DirectionAwareHoverDemo } from './components/Custom/BookCard'


function App() {

  const [books, setBooks] = useState([]);
  const [isLoading , setisloading] = useState(false);

  const BookFetcher = async () => {
    setisloading(true);  
    try {
      const sevenData = [];
      const {data} = await axios.get(BASE_URI+"books/getAllBooks");
      console.log(data);
      setBooks(data.slice(0,7));
      console.log(data);
      toast.success("Data fetched successfully !",  {style: {fontWeight : "bold"}});
      setisloading(false);
    } catch (error) {
        toast.error("Error while fetching the data !");
        setisloading(false);
    }
  }

  useEffect(() => {
     return (() => {
      BookFetcher();
    })()
  },[]);


  return (
    <div className='bg-black'>
      <Hero />
      <Toaster />
      <h1 className='text-6xl text-white text-center mt-5 '>Books </h1>
      <div className="flex flex-row justify-center items-center  flex-wrap">
            {isLoading ?  (
              <div className="absolute top-80 ">

                <PropagateLoader
                color="#ffffff"
                size={35}
              />
              </div>
            ) : (
               books.map((book:any) =>  {
                console.log(book.rating);
                return (
                      <Link to={`/Books/${book.id}`} key={book.id} onClick={() => sendTopic(book.id)}>
                          <DirectionAwareHoverDemo rating={book.rating} imageUrl={book.imageLink}  pages={book.pages} languages={book.language} title={book.title}  />
                      </Link>
                    )  
                }
               )
              
            )
  }
                
         
        </div>
      <FlipWordsDemo />

    </div>
    
      
  )
}

export default App
