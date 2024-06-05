import toast, { Toaster } from "react-hot-toast"
import { NavbarDemo } from "../Custom/NavBar"
import { DirectionAwareHoverDemo } from "../Custom/BookCard"
import { Link } from "react-router-dom"
import axios from "axios"
import { BASE_URI } from "../Custom/constant"
import React, { useEffect, useState } from "react"
import { PropagateLoader } from "react-spinners"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"


const Books = () => {
    const [books, setBooks] = useState([]);
    const [isLoading , setIsLoading] = useState(false);
    const [user , setSignedInUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const authenticateUser = async () => {
    //   try {
    //     const {data} = await axios.post(BASE_URI + "auth/login" ,{
    //       email : email, 
    //       password : password
    //     });
    //     localStorage.setItem("user", JSON.stringify(data));
    //     toast.success("Successfully authenticated " , {style :  { fontWeight: "bold"}});
    //     setInterval(() => {
    //       navigate("/Books");
    //     }, 2000);
    //     toast.success("Starts ghathering your data ! " , {style :  { fontWeight: "bold"}});
    //   } catch (error) {
    //       console.log(error);
    //       toast.error("Invalid Credentials" , {style :  { fontWeight: "bold"}});
    //   }
    // }

    const sendTopic = async (id: any) => {
      if(user != null ) {
          try {
              const {data} = await axios.post(BASE_URI+"createTopic",{
              bookId: id , userId: user.id
              });
              console.log(data);
            } catch (error) {
              toast.error("we are facing some issue while tracking you !");
          }
      }else {
        toast.error("you should authenticate !");
      }
    }


  const BookFetcher = async () => {
    setIsLoading(true);  
    try {
      const {data} = await axios.get(BASE_URI+"books/getAllBooks");
      setBooks(data);
      toast.success("Data fetched successfully !",  {style: {fontWeight : "bold"}});
      setIsLoading(false);
    } catch (error) {
        toast.error("Error while fetching the data !")
      setIsLoading(false);

    }
  }

  useEffect(() => {
     return (() => {
      BookFetcher();
    })()

  },[axios])

  return (
    <div>

        <NavbarDemo />
        <Toaster />
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

    </div>
  )
}

export default Books