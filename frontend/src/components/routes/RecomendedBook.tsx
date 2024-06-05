import { useEffect, useState } from "react"
import { NavbarDemo } from "../Custom/NavBar"
import {PuffLoader} from "react-spinners";
import axios from "axios";
import { BASE_URI } from "../Custom/constant";
import { Link } from "react-router-dom";
import { DirectionAwareHoverDemo } from "../Custom/BookCard";
import { TextGenerateEffect } from "../ui/text-generate-effect";

const RecomendedBook = () => {
  const [isLoading, setIsloading ] = useState(false);
  const [books,setBooks] = useState([]);
  const [user , setSignedInUser] = useState(JSON.parse(localStorage.getItem("user")));
  const fetchers = async  () => {
    setIsloading(true);

    try {
        const {data} = await axios.get(BASE_URI+"kafka-consumer/fetchDataRate/rate-topic");
        const userId = user.id;

        setBooks(data.data[userId]);
        setIsloading(false);
    } catch (error) { 
        console.log(error);
        setIsloading(false);
    }
  }

  useEffect(() => {
    fetchers();
  },[]);

   return (
    <div className="h-full">
        <NavbarDemo />

           <div className="mt-20 text-center flex flex-col justify-center items-center">
            {isLoading === true ? (
                <TextGenerateEffect className="mt-20" words={"Here is your recomended books based on your rating , trust us we will provide for u :)"} />

            ) : (
              <TextGenerateEffect className="mt-20" words={"Enjoy discovering "} />
            )}

           </div>
            {
              isLoading === false ? (
                <div className="flex flex-row justify-center items-center flex-wrap">
                
                 { books.map((book:any) =>  {
                    return (
                          <Link to={`/Books/${book.id}`} key={book.id} onClick={() => sendTopic(book.id)}>
                              <DirectionAwareHoverDemo rating={book.rating} imageUrl={book.imageLink}  pages={book.pages} languages={book.language} title={book.title}  />
                          </Link>
                        )  
                    })}

                    
                </div>
                    ) 
          : (
            <div className="flex flex-col justify-center items-center h-[100vh]">
                  <PuffLoader
                    color="#ffffff"
                    size={200}
                  />
              </div>
          )
        }




    </div>
  )
}

export default RecomendedBook