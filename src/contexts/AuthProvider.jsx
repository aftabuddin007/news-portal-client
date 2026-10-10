// import React from 'react';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase.init';
import { AuthContexts } from './AuthContext';
import {  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
const AuthProvider = ({children}) => {

     const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

const registerUser = (email,password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)

}
const signInUser=(email,password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)

}
const logOut = async () => {
    setLoading(true)
    return signOut(auth)
  }
   const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    })
  }


useEffect(()=>{
const unsubscribe = onAuthStateChanged(auth, async currentUser =>{
    // console.log(currentUser?.email)
    setUser(currentUser)
      setLoading(false)
})
return ()=>{
    return unsubscribe()
}
},[])

    const authInfo = {
        registerUser,signInUser,logOut,user, setUser,loading,updateUserProfile

}
    return (
        <AuthContexts value={authInfo}>
{children}
        </AuthContexts>
);
};

export default AuthProvider