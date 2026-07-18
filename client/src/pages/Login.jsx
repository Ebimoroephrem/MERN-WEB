/* eslint-disable no-undef */
import { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import {  useNavigate } from "react-router-dom";
import {AppContext} from "../Context/ContextApi.jsx"
import axios from 'axios'
import { toast } from "react-toastify";
const Login = () => {
  const [state, setState] = useState("Inscription");
  const navigate = useNavigate();
  const {backendUrl,setIsLoggedin, getUserDate} = useContext(AppContext)
  const [formatData, setFormatData] = useState({
    name:"",
    email:"",
    password:""
  });
  const handleChange = (e)=>{
    const {name,value} = e.target;

    setFormatData((prev)=>({
      ...prev,[name]:value
    }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        axios.defaults.withCredentials = true;

        if (state === "Inscription") {
            // Inscription
            const { data } = await axios.post(backendUrl + '/api/auth/inscription', formatData)
            if (data.success) {
                setIsLoggedin(true);
                getUserDate()
                navigate('/');
            } else {
                toast.error(data.message)
            }

        } else {
            //  Connexion — séparé du if, pas imbriqué
            const { data } = await axios.post(backendUrl + '/api/auth/connexion', formatData)
            if (data.success) {
                setIsLoggedin(true);
                getUserDate();
                navigate('/');
            } else {
                toast.error(data.message)
            }
        }

    } catch (error) {
        toast.error(error.response?.data?.message || "Erreur serveur") //  error.response pas data
    }
}

  return (
    <div className='flex items-center justify-center h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=> navigate('/')} src={assets.logo} alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 cursor-pointer sm:w-32" />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === "Inscription" ? "Créer un compte" : "Connexion"}
        </h2>
        <p className='text-center mb-6 text-sm'>
          {state === "Inscription" ? "Créez votre compte" : "Connectez-vous à votre compte"}
        </p>
          
        <form onSubmit={handleSubmit} >
          {/* Nom — seulement en Inscription */}
          {state === "Inscription" && (
            <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 bg-[#333a5c] rounded-full'>
              <img src={assets.person_icon} alt="icon" />
              <input onChange={handleChange} value={formatData.name} name="name" className='bg-transparent outline-none w-full' type="text" placeholder='Nom complet' required />
            </div>
          )}

          <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 bg-[#333a5c] rounded-full'>
            <img src={assets.mail_icon} alt="icon" />
            <input onChange={handleChange} value={formatData.email} name="email" className='bg-transparent outline-none w-full' type="email" placeholder='Email' required />
          </div>

          <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 bg-[#333a5c] rounded-full'>
            <img src={assets.lock_icon} alt="icon" />
            <input onChange={handleChange} value={formatData.password} name="password" className='bg-transparent outline-none w-full' type="password" placeholder='Mot de passe' required />
          </div>

          {/* Mot de passe oublié — seulement en Connexion */}
          {state === "Connexion" && (
            <p onClick={()=> navigate('/reset-password')} className='text-indigo-500 mb-5 cursor-pointer'>Mot de passe oublié ?</p>
          )}

          <button className='font-medium w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 cursor-pointer text-white'>
            {state}
          </button>
        </form>

        {/* Switcher */}
        <p className='text-center text-xs mt-4'>
          {state === "Inscription"
            ? <>Déjà un compte ? <span onClick={() => setState("Connexion")} className='text-indigo-400 cursor-pointer underline'>Connectez-vous</span></>
            : <>Pas de compte ? <span onClick={() => setState("Inscription")} className='text-indigo-400 cursor-pointer underline'>Inscrivez-vous</span></>
          }
        </p>
      </div>
    </div>
  )
}

export default Login