import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import Books from './components/routes/Books.tsx';
import Authors from './components/routes/Authors.tsx';
import BookDetails from './components/Custom/BookDetails.tsx';
import RecomendedBook from './components/routes/RecomendedBook.tsx';
import BenimBooklarem from './components/routes/BenimBooklarem.tsx';


const router = createBrowserRouter([
  {
    path:"/",
    element: <App />
  },
  {
    path: "/Books",
    element: <Books />
  },
  { 
    path: "/Authors",
    element: <Authors />
  },
  {
    path: "/Books/:id",
    element: <BookDetails />
  },
  {
    path: "/recomendedBooks",
    element: <RecomendedBook />
  },{
    path : "benimBooklar",
    element : <BenimBooklarem />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
