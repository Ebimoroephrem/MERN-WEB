import { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { AppContext } from '../Context/ContextApi.jsx'

const Header = () => {
  const  {userData} = useContext(AppContext);
  return (
    <div className ='flex flex-col items-center mt-20 px-4 text-center' >
      <img src={assets.header_img} alt= "header"
        className = 'w-36 h-36 rounded-full mb-6' />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2' >
            Bonjour, suis {userData ?  userData.name :'developpeur web'}  <img className='w-8 aspect-square' src={assets.hand_wave} />
        </h1>
        <h2 className= 'text-3xl font-semibold sm:text-5xl mb-4' >
            Bienvenue sur mon portfolio
        </h2>
        <p className='text-gray-600 max-w-md mb-8' > je suis un developpeur web et mobile, mes projets sur mon portfolio vont vous demontrer mes competences </p>
         <button className='border border-gray-500 px-8 py-2.5 hover:bg-gray-100 rounded-full transition-all cursor-pointer' >
            Voir mes projets
         </button>
    </div>
  )
}

export default Header
