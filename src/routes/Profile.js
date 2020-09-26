import Navigation from "components/Navigation";
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default ({userObj}) => {
    const histoy = useHistory();
    const [newDisplayName,setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut()
        histoy.push('/');
    };

    const getMyNweets = async () =>{
        const nweets = await    dbService.collection("nweets")
                                        .where("creatorId","==", userObj.uid)
                                        .orderBy("createdAt")
                                        .get();
        console.log(nweets.docs.map( (doc) => doc.data() ));
    };

    useEffect(()=>{
        getMyNweets();
    },[]);
    const onChange = (event) =>{
        const{
            target:{ value},
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) =>{
        event.preventDefault();
        if( userObj.displayName !== newDisplayName){
            userObj.updateProfile({displayName:newDisplayName});
        }
    }
    return(
        <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display Name" onChange={onChange}  value={newDisplayName} />
            <input type="submit" value="upload Profile" />
        </form>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    )
};