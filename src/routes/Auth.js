import { authService } from "fbase";
import React, { useState } from "react";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) =>{
        //console.log(event.target.name);
        const {target :{name,value}} =event;
        if(name==="email"){
            setEmail(value)
        }else if(name ==="password"){
            setPassword(value)
        }
    };
    const onSubmit = async(event) =>{
        // javascript  에게 내가 제어 할꺼니까 아무것도 하지마..
        // 라는 옵션이  preventDefault
        event.preventDefault();
        try{
            let data;
            if(newAccount){
                //신규 계정 생성 create account
                data = await authService.createUserWithEmailAndPassword(email,password)
            }else{
                // log In
                data = await  authService.signInWithEmailAndPassword(email,password)
            }
            //console.log(data);
        }catch(error){
            setError(error);
        }
    };
    // 전 setNewAccount 데이터
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                <input type="submit" value={newAccount ?'create new Account' : 'Log In'} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount?"Sign In":"Create Account"}</span>
            <div>
                <button>Continue with Google</button>
                <button>Continue with Github</button>
            </div>
        </div>        
    );
};
export default Auth;