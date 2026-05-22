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
    <div className="flex flex-col items-center">
      <h1>Login</h1>
      <input type="email" name="email" onChange={handleChange} placeholder="your email"/>
      <input type="password" name="password" onChange={handleChange} placeholder="your password"/>

      <button onClick={handleLogin}>login</button>
    </div>
  )
}