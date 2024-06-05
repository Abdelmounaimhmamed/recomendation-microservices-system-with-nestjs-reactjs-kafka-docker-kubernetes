"use client";
import  { useEffect, useState } from "react";
import { Menu, MenuItem } from "../ui/navbar-menu";
import { cn } from "../../utils/cn";
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
import { toast ,Toaster } from  "react-hot-toast";
import axios from "axios";
import { Button } from "../ui/button";
import { BASE_URI } from "./constant";
import { useNavigate } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/poppover"
import { Link } from "react-router-dom";

import { SyncLoader } from "react-spinners";


export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center ">
      <Navbar className="top-2" />
    </div>
  );
}


function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loggedIn , setIsLoggedIn] = useState();
  const [user , setUser] = useState(JSON.parse(localStorage.getItem("user")!));
  const [email, setEmail] = useState(user?.email);
  const [username, setUsername] = useState(user?.username);
  const [password , setPassword] = useState("");
  const [isLoading , setIsLoading] = useState(false);
  const [isProfileChanged , setProfileChanged] = useState(false);
  const [oldEmailSearch , setOldEmail] = useState();
  const [bookName , setBookName] = useState();
  const [bookImage , setBookImage ] = useState();
  const [bookPageNum , setBookNumPage] = useState();
  const [bookRate , setBookRate] = useState();
  const [bookCountry , setBookCountry] = useState();
  const [bookAuthor , setBookAuthor] = useState();
  const [bookYear , setBookYear] = useState();
  const [bookLanguage , setbookLanguage] = useState();

  const createBook = async () => {
    try {
      const {data} = await axios.post(BASE_URI+"books/createBook/"+user.id,{
        author : bookAuthor,
        country :  bookCountry,
        imageLink:  bookImage,
        language : bookLanguage,
        pages :  bookPageNum,
        title : bookName,
        year : bookYear,
        rating : bookRate
      });
      toast.success("book created successfully !" , {style : {fontWeight: "bolder"}});
    } catch (error) {
        console.log(error);
        toast.error("error while creating the book , check out the console  !",{style : {fontWeight : "bold"}});
    }
  }

 
  useEffect(() => {
    const findOut = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user != null) {
          setIsLoggedIn(true)
          setUser(user);
        }else {
          setIsLoggedIn(false);
        }
    }
    findOut();
    
  },[]) 
  const authenticateUser = async () => {
    try {
      const {data} = await axios.post(BASE_URI + "auth/login" ,{
        email : email, 
        password : password
      });
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Successfully authenticated " , {style :  { fontWeight: "bold"}});
      setInterval(() => {
        navigate("/Books");
      }, 2000);
      toast.success("Starts ghathering your data ! " , {style :  { fontWeight: "bold"}});
    } catch (error) {
        console.log(error);
        toast.error("Invalid Credentials" , {style :  { fontWeight: "bold"}});
    }
  }

  const updateProfile = async () => {
    try {
      setIsLoading(true);
      setProfileChanged(false);
      const {data} = await axios.post(BASE_URI+"updateProfile/"+email, {
        email : email , username: username
      });
      setUser(data);
      localStorage.setItem("user" , JSON.stringify(data));
      setIsLoading(false);
      setProfileChanged(true);

    } catch (error) {
        console.log(error);
        toast.error("error while updating ur profile !" , {style : {fontWeight : "bolder"}});
        setIsLoading(false);
    }
  }
  const registerUser = async () =>  {
    try {
      const {data} = await axios.post(BASE_URI+"auth/register" , {
        email : email, 
        password : password,
        username : username
      })
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("we are gathering your data !  " , {style :  { fontWeight: "bold"}});
      setInterval(() => {
      }, 2000)
      toast.success("successfulley registered " , {style :  { fontWeight: "bold"}});
    } catch (error) {
        console.log(error);
        toast.error("Invalid Credentials" , {style :  { fontWeight: "bold"}});
    }
  }
  const handleLogOut = () => {
    localStorage.setItem("user",null);
    toast.success("Successfully logged out ", {style :  { fontWeight: "bold"}});
    setIsLoggedIn(false);
    navigate("/");
  }

  function getInitials(name ){
    const parts = name.split(' ');
    if (parts?.length < 2) {
      throw new Error("Name must contain at least two parts");
    }
    const firstChar = parts[0].charAt(0).toUpperCase();
    const lastChar = parts[1]?.charAt(parts[1].length - 1).toUpperCase();
    return firstChar + lastChar;
  }


  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <h1>Booking System</h1>
        <Link to={"/"} >
          <MenuItem setActive={setActive} active={active} item="Home">
          
          </MenuItem>
        </Link>
        
        <Link to="/Authors">
          <MenuItem setActive={setActive} active={active} item="Authors">
            
          </MenuItem>
        </Link>
        <Link to="/Books">
        <MenuItem setActive={setActive} active={active} item="Books">
          
        </MenuItem>

        </Link>
        {
          loggedIn === false ?  (
            <>

              <Dialog>
              <DialogTrigger>
            
                  <MenuItem setActive={setActive} active={active} item="Login">
                  </MenuItem>
              

              </DialogTrigger>
              <DialogContent>
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
            
              <Dialog>
                <DialogTrigger>
                    <MenuItem setActive={setActive} active={active} item="Register">
                    </MenuItem>                
                </DialogTrigger>
              <DialogContent>
                  <DialogHeader >
                  <DialogTitle ><h1 className="text-white ">Login to acces our System !</h1></DialogTitle>
                  </DialogHeader>
                  <DialogDescription >
                  <Label className=" mb-4 text-white"  > Username</Label>
                    <Input  onChange={(e) => setUsername(e.target.value)} value={username} className="mb-4 mt-4 text-white rounded-xl" type="text" placeholder="username"  />
                    <Label className=" mb-4 text-white"  > Email</Label>
                    <Input onChange={(e) => setEmail(e.target.value)} value={email}  className="mb-4 mt-4 text-white rounded-xl" type="email" placeholder="user@develus.ma"  />
                    <Label className=" mb-4 text-white rounded-xl"  > Password</Label>
                    <Input onChange={(e) => setPassword(e.target.value)} value={password}  className=" mb-4 mt-4 text-white rounded-xl" type="password" placeholder="password"  />
                    <Button onClick={registerUser} className="bg-white rounded-xl">sign up </Button>
                  </DialogDescription>
              </DialogContent>
              </Dialog>
            </>

          ) : (
            
              <Popover>
              <PopoverTrigger className="text-black  bg-white rounded-full  px-2 py-2">{getInitials(user?.username || "default chihaja" )}</PopoverTrigger>
              <PopoverContent>

              <Dialog>
                <DialogTrigger>
                         <Button className=" m-2 rounded bg-white text-black " to="/profile" >Profile</Button>
                </DialogTrigger>
                  <DialogContent>
                    <>
                        <DialogHeader >
                        <DialogTitle ><h1 className="text-white "> Update your profile ! </h1></DialogTitle>
                        </DialogHeader>
                        <DialogDescription >
                        <Label className=" mb-4 text-white"  > Username</Label>
                          <Input  onChange={(e) => setUsername(e.target.value)} value={username} className="mb-4 mt-4 text-white rounded-xl" type="text" placeholder="username"  />
                          <Label className=" mb-4 text-white"  > Email</Label>
                          <Input onChange={(e) => setEmail(e.target.value)} value={email}  className="mb-4 mt-4 text-white rounded-xl" type="email" placeholder="user@develus.ma"  />
                          <Button onClick={updateProfile} className="bg-white rounded-xl">
                            {isLoading == true ? (
                              <SyncLoader size={10} color="black" />
                            ) : (
                              "update profile"
                            )}
                          </Button>
                        </DialogDescription>
                    </>

                    
                  </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                <DialogTrigger>
                   <Button className=" m-2 rounded bg-white text-black" >Create Books</Button>
                </DialogTrigger>
                  <DialogContent>
                      <DialogHeader >
                      <DialogTitle ><h1 className="text-white ">Create a book </h1></DialogTitle>
                      </DialogHeader>
                      <DialogDescription >
                        <Label className=" mb-2 text-white"  > BookName</Label>
                        <Input  onChange={(e) => setBookName(e.target.value)} value={bookName} className="mb-4 text-white rounded-xl" type="text" placeholder=""  />
                        <Label className=" mb-2 text-white"  > bookImage</Label>
                        <Input onChange={(e) => setBookImage(e.target.value)} value={bookImage}  className="mb-4  text-white rounded-xl"   />
                        <Label className=" mb-2 text-white"  > bookNumPage</Label>
                        <Input onChange={(e) => setBookNumPage(e.target.value)} value={bookPageNum}  className="mb-4  text-white rounded-xl"   />
                        <Label className=" mb-2 text-white rounded-xl"  > BookRate</Label>
                        <Input onChange={(e) => setBookRate(e.target.value)} value={bookRate}  className=" mb-4  text-white rounded-xl" />
                        <Label className=" mb-2 text-white rounded-xl"  > bookCountry</Label>

                        <Input onChange={(e) => setBookCountry(e.target.value)} value={bookCountry}  className=" mb-4  text-white rounded-xl"  />
                        <Label className=" mb-2 text-white rounded-xl"  > bookAuthor</Label>

                        <Input onChange={(e) => setBookAuthor(e.target.value)} value={bookAuthor}  className=" mb-4  text-white rounded-xl"  />
                        <Label className=" mb-2 text-white rounded-xl"  > bookYear</Label>

                        <Input onChange={(e) => setBookYear(e.target.value)} value={bookYear}  className=" mb-4  text-white rounded-xl"  />

                        <Button onClick={createBook} className="bg-white rounded-xl">Create Book </Button>
                      </DialogDescription>
                  </DialogContent>
                  </Dialog>
                <Button className=" m-2 rounded bg-white text-black" >
                  <Link className=" m-2 rounded bg-white text-black" to="/benimBooklar/" >Your Books </Link>
                </Button>
                <Button className=" m-2 bg-white text-black" >
                    <div className=" m-2 cursor-pointer bg-white text-black" onClick={handleLogOut}>Logout</div>
                </Button>
              </PopoverContent>
            </Popover>

          )

        }
               

             
      </Menu>
    </div>
  );
}
