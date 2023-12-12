import React from "react"
import {Header} from "../components/Header"
import { Outlet } from "react-router-dom"

export function DefautLayout(){
return(
  <div>
    <Header/>
    <Outlet/>
  </div>
)
}