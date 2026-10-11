import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Register = () => {
    const {register,handleSubmit}=useForm();
const {registerUser,updateUserProfile}=useAuth()
const navigate = useNavigate()
const from = location.state || '/'

const handleRegistration=(data)=>{
registerUser(data.email,data.password)
 updateUserProfile(data.name, null)
.then(result=>{
     toast.success('Signup Successful')
      navigate(from, { replace: true })
  console.log(result.user)
})
.catch(error=>{
  console.log(error.message)
})
}

    return (
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                   <h3 className="text-3xl font-bold">Signup Page</h3>

      <form onSubmit={handleSubmit(handleRegistration)} className="card-body">
        <fieldset className="fieldset">
          <label className="label">Name</label>
          <input type="text" {...register("name",{required:true})}className="input" placeholder="Name" />
          <label className="label">Email</label>
          <input type="email" {...register("email",{required:true})}className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" {...register("password",{required:true,minLength:6})}className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Register</button>
        </fieldset>
        <p className="">Have  Account Go for <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
    );
};

export default Register;