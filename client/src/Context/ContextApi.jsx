import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

 // eslint-disable-next-line react-refresh/only-export-components
 export const AppContext = createContext();

const AppContextProvider = (props)=>{
    // eslint-disable-next-line react-hooks/immutability
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/authentification');
            if(data.success){
                setIsLoggedin(true);
                getUserDate()
            }
        } catch (error) {
             toast.error(error.response?.data?.message)
        }
    }

    const getUserDate = async()=>{
        try{
          const {data} = await axios.get(backendUrl + '/api/user/data')
          data.success ? setUserData(data.userData) : toast.error(data.message)
        }
        catch(error){
            toast.error(error.response?.data?.message || "Erreur serveur")
        }
    }
    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getAuthState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserDate
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}

        </AppContext.Provider>
    )

}
export default AppContextProvider