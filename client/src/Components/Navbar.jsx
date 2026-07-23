import { useContext } from 'react';
import {assets} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/ContextApi.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const {backendUrl, setUserData,userData,setIsLoggedin} = useContext(AppContext);

  const sendVerificationOtp = async ()=>{
    try{
        axios.defaults.withCredentials = true;

        const {data} = await axios.post(backendUrl +  '/api/auth/verification-otp');
        if (data.success) {
            toast.success(data.message || "Code de vérification envoyé !");
            navigate('/email-verify');
        } else {
            toast.error(data.message || "Échec de l'envoi");
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Une erreur est survenue";
        toast.error(message);
    }
  }

  const logout = async ()=>{
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + '/api/auth/deconnexion');
     if (data.success) {
        setIsLoggedin(false);
        setUserData(null);           // null est plus explicite que false
        toast.success("Déconnexion réussie");
        navigate('/');
      } else {
        toast.error(data.message || "Échec de la déconnexion");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Une erreur est survenue";
      toast.error(errorMessage);
    }
    
  }
  return (
    <div className= ' w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0' >

      <img src={assets.logo} alt="Logo" className='w-28 sm:32' />
      {userData? 
          <div className=' w-10 h-10 flex justify-center cursor-pointer items-center rounded-full bg-black text-white relative group' >
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-50 text-black rounded pt-10' >
                <ul className='list-none m-0 p-2  bg-gray-100 text-sm' >
                  { userData &&  !userData.isAccountVerified && 
                   <li className='py-1 px-2 bg-gray-200 cursor-pointer' onClick={sendVerificationOtp}  >Verification email</li>
                   }
                 
                  <li onClick={logout} className='py-1 px-2 bg-gray-200 cursor-pointer' >Deconnexion </li>
                </ul>
            </div>
          </div> 
          :<button onClick={() => navigate('/Connexion')}
          className = 'flex items-center gap-2 border border-gray-500 text-gray-800 rounded-full px-6 py-2 hover: bg-gray-100 transition-all cursor-pointer ' > Connexion <img src={assets.arrow_icon} /> </button>
      }

      
    </div>
  )
}

export default Navbar
