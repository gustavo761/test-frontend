
import { NextResponse } from "next/dist/server/web/spec-extension/response";;
// import Cookies from 'js-cookie'
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  let verify = req.cookies.get('jwttoken') || ''
  // const verify = localStorage.getItem('jwttoken')
  console.log('imprimiento cookie', verify)
  let url = req.url || ''

  if (verify && url.includes('/login')) {
    return NextResponse.redirect("http://localhost:3001/");
  }

  if (verify && url.includes('/register')) {
    return NextResponse.redirect("http://localhost:3001/");
  }

  if (!verify && url === "http://localhost:3001/") {
    return NextResponse.redirect("http://localhost:3001/account/login");
  }


}