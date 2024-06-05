import { useEffect, useState } from "react"
import { NavbarDemo } from "./NavBar"
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BASE_URI } from "./constant";
import {Link, useNavigate, useParams} from "react-router-dom";
import { Fade, Zoom } from "react-awesome-reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  SyncLoader } from "react-spinners";
import { DirectionAwareHoverDemo } from "./BookCard";


const BookDetails = () => {
  const [user , setUser] = useState(JSON.parse(localStorage.getItem("user")!));
  const [isLoading , setIsLoading] = useState(false);
  const [isLoadingReco , setIsLoadingReco] = useState(false);
  const [parameter , setParameter] = useState("");
  const [book , setBook] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recomemndedBooks , setRecommended] = useState([].reverse());
  const {id} = useParams();
  const [rating, setRating] = useState(0);
  const [bookLanguage , setBookLanguage] = useState();
  const [bookCountry , setBookCountry] = useState();
  const [bookpages , setbookpages] = useState();
  const navigate = useNavigate();
  console.log(bookCountry);
    console.log(bookLanguage);

  const handleClickRecomendationBaseddOnDataWanted = async () => {
    setIsLoading(true);
    console.log(bookCountry);
    console.log(bookLanguage);
    try {
      await  axios.post(BASE_URI+'tellBookwwanted', {
      userId : user.id,
      bookLanguage : bookLanguage,
      bookCountry : bookCountry,
      bookpages : bookpages
    });

    navigate("/recomendedBooks");
   
    } catch (error) {
      console.log(error);
      toast.error("an error has occured !");
      setIsLoading(false);
    }
  }


  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")!));
    setParameter(id);
    const fetchers = async () =>  {
      setIsLoading(true);
      try {
        const {data} = await axios.get(BASE_URI+"books/getAllBooks");
        data.forEach(element => {
          if(element.id == id) {
            setBook(element);
          }
        });      
        setIsLoading(false);
      } catch (error) {
          console.log(error);
          setIsLoading(false);
      }
    }
    const recommendedBooksFetchers = async () => {
      setIsLoadingReco(true);
      try {
        const {data} = await axios.get(BASE_URI+"kafka-consumer/fetch/message-topic");
        const userId = user.id;

        setRecommended(data.data[userId]);
        console.log(data);      
  
        setIsLoadingReco(false);
      } catch (error) {
          console.log(error);
          setIsLoadingReco(false);
      }
    }
    fetchers();
    recommendedBooksFetchers();
  },[]);
  
  const handleClickRate = async () => {
    setIsLoading(true);
    toast.success("wait we are processing your data to give you recommendation",{style : {fontWeight:"bold"  , animationDuration:"revert-layer"}});
    try { 
        const userId = user.id;
        console.log(rating);
        await axios.post(BASE_URI+'rateBook', {
            userId : userId,
            bookId : id,
            rating : rating
        });

        navigate("/recomendedBooks");
      
    } catch (error) {
        console.log(error);
        toast.error("not send !")
        setIsLoading(false);
    }
  }

  const authenticateUser = async () => {
    try {
      const {data} = await axios.post(BASE_URI + "auth/login" ,{
        email : email, 
        password : password
      });
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Successfully authenticated " , {style :  { fontWeight: "bold"}});
      
      window.location.reload()
   
      toast.success("Starts ghathering your data ! " , {style :  { fontWeight: "bold"}});
    } catch (error) {
        console.log(error);
        toast.error("Invalid Credentials" , {style :  { fontWeight: "bold"}});
    }
  }

  return (
    <div>
        <NavbarDemo />
        <Toaster />

       
              { user == null ? (
                  <div className=" text-white flex flex-col justify-center items-center w-100 h-[100vh]">
                      <h1 className="text-6xl" >You should authenticate to see book details </h1>
                    <Dialog>
                    <DialogTrigger> <Button className="text-black bg-white rounded mt-4" > Click up</Button></DialogTrigger>
                    <DialogContent>
                      <Toaster />
                        <DialogHeader >
                        <DialogTitle ><h1 className="text-white ">Login to acces our System !</h1></DialogTitle>
                        </DialogHeader>
                        <DialogDescription >
                          <Label className=" mb-4 text-white"  > Email</Label>
                          <Input onChange={(e) => setEmail(e.target.value)} value={email} className="mb-4 mt-4 text-white rounded-xl" type="email" placeholder="email"  />
                          <Label className=" mb-4 text-white rounded-xl"  > Password</Label>
                          <Input onChange={(e) => setPassword(e.target.value)} value={password} className=" mb-4 mt-4 text-white rounded-xl" type="password" placeholder="password"  />
                          <Button onClick={authenticateUser} className="bg-white rounded-xl">authenticate  </Button>
                        </DialogDescription>
                    </DialogContent>
                    </Dialog>
                  </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-100 h-full mt-20">
                  <h1 className="bg-white py-3 w-[800px] text-center rounded-xl mt-20 mb-5 font-bold">Book Details</h1>
                  <div className="w-full flex flex-row justify-evenly items-center mt-10">
                      <div className=" border border-2 p-2">
                              <Zoom cascade={true}>
                          <div className="">
                                  <img src={book?.imageLink?.startsWith("h") ? book.imageLink : "/"+ book.imageLink} className="w-[250px]" alt="no image " />
                          </div>
                              </Zoom>
                      </div>
      
                      <div className="flex flex-col justify-center w-50 items-center h-100">
                        <Fade cascade className="w-full" duration={0.2}>
                          <div className="  m-2 m flex flex-row justify-between items-center w-full bg-white text-gray-900  h-full w-[400px] p-4 rounded-xl">
                              <h1 className="font-bold underline">Title</h1>
                              <h2  className="underline">{book.title}</h2>
                          </div>
                          <div className="  m-2 m flex flex-row justify-between  items-center w-full bg-white text-gray-900  h-full w-[400px]  p-4 rounded-xl">
                          <h1 className="font-bold underline">author</h1>
                              <h2 className="underline">{book.author}</h2>
                          </div>
                          <div className=" m-2 m flex flex-row justify-between items-center w-full bg-white text-gray-900  h-full w-[400px]  p-4 rounded-xl">
                          <h1 className="font-bold underline">country</h1>
                              <h2 className="underline">{book.country}</h2>
                          </div>
                          <div className=" m-2 m flex flex-row justify-between items-center w-full bg-white text-gray-900  h-full w-[400px]  p-4 rounded-xl">
                          <h1 className="font-bold underline">pages</h1>
                              <h2 className="underline">{book.pages}</h2>
                          </div>
                          <div className=" m-2 m flex flex-row justify-between items-center w-full bg-white text-gray-900  h-full w-[400px]  p-4 rounded-xl">
                          <h1 className="font-bold underline">year</h1>
                              <h2 className="underline">{book.year}</h2>
                          </div>
                        </Fade>
                          <div className=" m-2 m flex flex-row justify-between items-center w-full  text-gray-900  h-full w-w-[400px]  p-4 rounded-xl">
                            <div className="" > 
                            <Dialog>
                              <DialogTrigger> <Button className="text-black bg-white rounded mt-4" > rate book</Button></DialogTrigger>
                              <DialogContent>
                                  <DialogHeader >
                                  <DialogTitle ><h1 className="text-white ">rate this book to recommend you better </h1></DialogTitle>
                                  </DialogHeader>
                                  <DialogDescription >
                                  <Select  onValueChange={(e :any )=> setRating(e)} >
                                      <SelectTrigger className="w-[180px] text-white rounded-xl w-full">
                                        <SelectValue placeholder="1" />
                                      </SelectTrigger>
                                      <SelectContent >
                                        <SelectItem  value={1} >1</SelectItem>
                                        <SelectItem  value={2} >2</SelectItem>
                                        <SelectItem  value={3} >3</SelectItem>
                                        <SelectItem  value={4} >4</SelectItem>
                                        <SelectItem  value={5} >5</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button onClick={handleClickRate} className="text-black bg-white mt-4 rounded-xl hover:bg-white">
                                      {isLoading === true ? (
                                          
                                          <div className="flex flex-row justify-center items-center">
                                                <SyncLoader
                                                color="black"
                                                height={2}
                                                />
                                          </div>
                                      ) : (
                                        "rate Book"
                                      )}
                                      
                                    </Button>
                                  
                                  </DialogDescription>
                              </DialogContent>
                              </Dialog>
                            </div>
                            <div className="" > 
                            <Dialog>
                      
                                <DialogTrigger> <Button className="text-black bg-white  rounded mt-4" > tell us about</Button></DialogTrigger>
                                <DialogContent>
                                  <Toaster />
                                    <DialogHeader >
                                    <DialogTitle >
                                      <h1 className="text-white ">Give us data about what book you want to read </h1>
                                      <p className="mt-2 text-white font-light text-sm ">we will recommand for you based on the data you provide </p>
                                    </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription >
                                      <Label className="mt-2 mb-2 text-white pb-2"  >Book Language </Label>
                                      <Input type="text" className="mb-4 mt-4 text-white rounded-xl" value={bookLanguage} onChange={(e) => setBookLanguage(e.target.value)}  />
                                      <Label className="mt-2 mb-2 text-white pb-2" >Book country </Label>
                                      <Input type="text" className="mb-4 mt-4 text-white rounded-xl" value={bookCountry} onChange={(e) => setBookCountry(e.target.value)} />
                                      <Label className="mt-2 mb-2 text-white pb-2">Amount of pages </Label>
                                      <Input type="text" className="mb-4 mt-4 text-white rounded-xl"  value={bookpages} onChange={(e) => setbookpages(e.target.value)} />
                                      <Button className="bg-white text-black rounded-xl hover:bg-white" onClick={handleClickRecomendationBaseddOnDataWanted}>get Recommendation</Button>
                                    </DialogDescription>
                                </DialogContent>
                                </Dialog>
                            </div>
                          </div>
                      </div>
                  </div>
                </div>
              )}
            <h1 className="bg-white text-center m-auto py-3 w-[800px] text-center rounded-xl mt-10 mb-5 font-bold">
              {isLoadingReco === true ? "wait our systems are recomending based on your books clicks" :"Recomended Books " }
              
              </h1>
            <div className="flex flex-row justify-center items-center  flex-wrap">
              {
                isLoadingReco === true ? (
                    <SyncLoader color="white" size={30} />
                ) : (
                  
                    
                       recomemndedBooks.reverse().map((book:any) =>  {
                        return (
                              <Link to={`/Books/${book.id}`} key={book.id} onClick={() => sendTopic(book.id)}>
                                  <DirectionAwareHoverDemo rating={book.rating} imageUrl={book?.imageLink?.startsWith("h") ? book.imageLink : "/"+ book.imageLink}  pages={book.pages} languages={book.language} title={book.title}  />
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

export default BookDetails