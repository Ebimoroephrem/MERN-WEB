import  { useNavigate } from "react-router-dom"
import {useState,useRef,useContext} from "react"
import { assets } from "../assets/assets.js"
import { AppContext } from "../Context/ContextApi.jsx"
import { toast } from "react-toastify"
import axios from "axios"
const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail ] = useState('');
  const [newPassword, setNewPassword ] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const inputRefs = useRef([]);


  const {backendUrl} = useContext(AppContext);



  const handleEmailChange = (e)=>{
    setEmail(e.target.value);
  }
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // filtre les lettres
    e.target.value = value;

    if (value.length > 1) return;
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ── Revient au champ précédent sur Backspace ──
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  // ── Coller un code OTP (ex: depuis SMS) ──
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, '');
    paste.split('').slice(0, 6).forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });
    // Focus sur le dernier champ rempli
    const lastIndex = Math.min(paste.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const emailOnSubmit = async (e)=>{
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if(!isEmailSent){
      try{
        const {data} = await axios.post(backendUrl + '/api/auth/send-password-otp', {email})
        data.success? toast.success(data.message) : toast.error(data.message);
         data.success && setIsEmailSent(true)
      } catch (error) {
        toast.error("Erreur d’envoi de réinitialisation du mot de passe email", error);
      }
    }
  }
  // ── Soumettre le code OTP ──
  const otpOnSubmit = async (e)=>{
     e.preventDefault();
     // Récupère la valeur du code OTP à partir des champs d'entrée
     const otpValue = inputRefs.current.map(input => input.value).join('');
     setOtp(otpValue);
     setIsOtpSent(true);
  }
  // ── Soumettre le nouveau mot de passe ──
  const passwordOnSubmit = async (e)=>{
    e.preventDefault();
     try{
      const {data}= await axios.post(backendUrl + '/api/auth/reset-password', {email,otp,newPassword});
      data.success? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/connexion');
     }
     catch(error){
      toast.error("Erreur lors de la soumission du nouveau mot de passe", error);
     }
  }

  return (
    <div className='flex items-center justify-center h-screen px-6 sm:px-0 
       bg-gradient-to-br from-blue-200 to-purple-400' >
        <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt="Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 cursor-pointer sm:w-32"
              />
       {!isEmailSent&&      
      <form onSubmit={emailOnSubmit} className="bg-slate-900 rounded-lg p-8 w-96 text-sm shadow-lg" >
        <h1 className='text-2xl font-semibold text-white text-center mb-3'>
          Réinitialiser le mot de passe
        </h1>
        <p className='text-center mb-6 text-sm text-white'>
          Saisissez votre adresse e-mail 
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-lg bg-[#333A5C]"> 
          <img src={assets.mail_icon} alt="Email" className="w-3 h-3" />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-transparent text-white outline-none" 
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <button className='font-medium w-full py-2.5 rounded-full bg-gradient-to-br
          from-indigo-500 to-indigo-900 cursor-pointer mt-3 text-white text-xl
          hover:opacity-90 transition-opacity'>
          Réinitialiser
        </button>
      </form>
       } 

      {/* otp verification form */}

      {!isOtpSent && isEmailSent  &&
       <form onSubmit={otpOnSubmit}
        
        className="bg-slate-900 rounded-lg p-8 w-96 text-sm shadow-lg"
      >
        <h1 className='text-2xl font-semibold text-white text-center mb-3'>
          Renitialisation Mot de passe
        </h1>
        <p className='text-center mb-6 text-sm text-white'>
          Saisissez le code à 6 chiffres envoyé à votre adresse e-mail
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength='1'
              inputMode="numeric"
              pattern="[0-9]"
              required
              ref={(e) => inputRefs.current[index] = e}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-white text-center rounded-md text-xl 
              bg-[#333A5C] focus:outline-none focus:ring-2 focus:ring-indigo-500 
              transition-all"
            />
          ))}
        </div>

        <button
          type="submit"
          className='font-medium w-full py-2.5 rounded-full bg-gradient-to-br
          from-indigo-500 to-indigo-900 cursor-pointer text-white text-xl
          hover:opacity-90 transition-opacity'
        >
          Soumettre
        </button>
      </form>
      }
      {/* entrer nouveau mot de passe form */}
      {isOtpSent && isEmailSent &&
       <form onSubmit={passwordOnSubmit} className="bg-slate-900 rounded-lg p-8 w-96 text-sm shadow-lg" >
        <h1 className='text-2xl font-semibold text-white text-center mb-3'>
          Soumettre  le nouveau mot de passe
        </h1>
        <p className='text-center mb-6 text-sm text-white'>
          Saisissez votre nouveau mot de passe
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-lg bg-[#333A5C]"> 
          <img src={assets.lock_icon} alt="Password" className="w-3 h-3" />
          <input 
            type="password" 
            placeholder="Nouveau mot de passe" 
            className="w-full bg-transparent text-white outline-none" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button className='font-medium w-full py-2.5 rounded-full bg-gradient-to-br
          from-indigo-500 to-indigo-900 cursor-pointer mt-3 text-white text-xl
          hover:opacity-90 transition-opacity'>
          Valider
        </button>
      </form>
      }
    </div>
  )
}

export default ResetPassword
