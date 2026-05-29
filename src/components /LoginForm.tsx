import { useState } from "react"

interface User{
  _id?: String,
  username?: String,
  email: String,
  password: String,
}

export default function LoginForm() {
  
  const [credentials, setCredentials] = useState<User>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value, 
    })
  }

  const handleLogin = async () => {
    try{
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success === true){
        localStorage.setItem('accessToken', result.response.accessToken);
      } 

    }catch(error){
      console.error(error);
    }
  }
  
  return (
<div className="min-h-screen flex flex-col items-center justify-center font-sans">
  <div className="flex flex-col border border-neutral-200 rounded-2xl max-w-md w-[95%] p-8 sm:p-10 shadow-sm gap-6">
    
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight text-text">Login</h1>
    </div>

    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text">Email</label>
        <input 
          type="email" 
          name="email" 
          onChange={handleChange} 
          placeholder="your email"
          className="w-full px-3.5 py-2 border border-neutral-300 rounded-lg outline-none transition focus:border-overlay-0 focus:ring-1 focus:border-overlay-0"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text">Password</label>
        <input 
          type="password" 
          name="password" 
          onChange={handleChange} 
          placeholder="your password"
          className="w-full px-3.5 py-2 border border-neutral-300 rounded-lg outline-none transition focus:border-overlay-0 focus:ring-1 focus:border-overlay-0"
        />
      </div>
    </div>

    <button 
      onClick={handleLogin}
      className="w-full py-2.5 px-4 font-semibold border border-overlay-0 rounded-lg transition active:scale-[0.98] text-text cursor-pointer"
    >
      Login
    </button>
    
  </div>
</div>
  )
}