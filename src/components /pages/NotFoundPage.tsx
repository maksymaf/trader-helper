import { Link } from "react-router-dom"

export default function NotFoundPage(){
  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-base">
      <div className="text-text">404 Not Found</div>
      <Link to='/' className="text-subtext-0">Redirect to Home Page</Link>
    </div>
  )
}