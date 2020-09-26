import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import {authService} from 'fbase';

function App() {
  const[init, setInit] =useState(false);
  const [userObj,setUserObject] = useState(null);
  useEffect(()=>{
    //로그인 체크 
    // firebase 메서드 유저 상태 체크
    authService.onAuthStateChanged( (user) => {
      if(user){
        setUserObject(user);
      }
      setInit(true);
    })
  },[]);
  return (
    <>
    {init ? (<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> ): ('Initializing....')}
    <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
