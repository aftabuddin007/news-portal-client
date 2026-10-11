
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Login = () => {
    const {register,handleSubmit}=useForm();
const {signInUser}=useAuth()
 const location = useLocation()
  const from = location.state || '/'
const navigate = useNavigate()

const handleLogin=(data)=>{
signInUser(data.email,data.password)
.then(result=>{
  console.log(result.user)
        toast.success('Signin Successful')
navigate(from,{replace:true})
})
.catch(error=>{
  console.log(error.message)
})
}
    return (
       <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
       <h3 className="text-3xl font-bold">Login Page</h3>
      <form onSubmit={handleSubmit(handleLogin)} className="card-body">
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" {...register("email",{required:true})}className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" {...register("password",{required:true,minLength:6})}className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
        <p className="">Have not Account Go for <Link to="/register" className="text-blue-600">Register</Link></p>
      </form>
    </div>
    );
};

export default Login;