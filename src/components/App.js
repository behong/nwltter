import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import {authService} from 'fbase';

function App() {
  const[init, setInit] =useState(false);
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  useEffect(()=>{
    //로그인 체크 
    // firebase 메서드 유저 상태 체크
    authService.onAuthStateChanged( (user) => {
      if(user){
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  },[]);
  return (
    <>
    {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing....'}
    </>
  );
}

export default App;
