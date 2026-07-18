import  { useRef,useContext,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets.js"
import axios from "axios"
import { toast } from "react-toastify"
import { AppContext } from "../Context/ContextApi.jsx"

const EmailVerify = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const {backendUrl,userData, isLoggedin,  getUserDate} = useContext(AppContext);
  // eslint-disable-next-line react-hooks/immutability
  axios.defaults.withCredentials = true;
  // ── Passe au champ suivant automatiquement ──
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

  // ── Soumission du formulaire ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Récupère les 6 chiffres
    const otp = inputRefs.current.map(input => input.value).join('');

    if (otp.length < 6) {
      return toast.error("Veuillez saisir les 6 chiffres");
    }

    try {
      const { data } = await axios.post(
          `${backendUrl}/api/auth/verify-email`,
        { otp },
       
      );

      if (data.success) {
        toast.success("Email vérifié avec succès !");
        navigate('/');
        getUserDate(); // Met à jour les données de l'utilisateur après la vérification
      } else {
        toast.error(data.message || "Code incorrect");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la vérification");
      console.log(error.message);
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

  useEffect(()=>{
      if((isLoggedin && userData && userData.isAccountVerified)){
        navigate('/')
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isLoggedin,userData])

  const handleResend = async () => {
    try {
        const { data } = await axios.post(
            `${backendUrl}/api/auth/resend-otp`,
            { userId: userData._id } // envoie l'id de l'utilisateur
        );
        if (data.success) {
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Erreur lors du renvoi");
    }
};

  return (
    <div className='flex items-center justify-center h-screen px-6 sm:px-0 
       bg-gradient-to-br from-blue-200 to-purple-400'>

      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 cursor-pointer sm:w-32"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 rounded-lg p-8 w-96 text-sm shadow-lg"
      >
        <h1 className='text-2xl font-semibold text-white text-center mb-3'>
          Vérification Email OTP
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
          Vérifier
        </button>

        {/* Lien pour renvoyer le code */}
        <p className="text-center text-white mt-4">
          Vous n'avez pas reçu le code ?{" "}
          <span
            onClick={handleResend}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Renvoyer
          </span>
        </p>
      </form>
    </div>
  );
};

export default EmailVerify;