import { useRouter } from "next/router"
import { useEffect } from "react"


export const Layout = ({children}: any) => {
  const router = useRouter()
  useEffect(() => {
    // verificar si existe un token guardado
    // const token = localStorage.getItem('jwttoken')
    // if(token) router.push('/')
  }, [])
  return (
    <div className="col-md6 offset-md-3 mt-5">
      {children}
    </div>
  )
}