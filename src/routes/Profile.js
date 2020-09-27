import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
 
export default ({refreshUser, userObj }) => {
    const histoy = useHistory();
    const [newDisplayName,setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut()
        histoy.push('/');
    };

    const onChange = (event) =>{
        const{
            target:{ value},
        } = event;
        setNewDisplayName(value);
    };
    
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
          await userObj.updateProfile({
            displayName: newDisplayName,
          });
          refreshUser();
        }
      };    

    return(
        <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display Name" onChange={onChange}  value={newDisplayName} />
            <input type="submit" value="upload Profile" />
        </form>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    );
};