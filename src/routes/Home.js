import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = () => {
    const [nweet,setNweet] = useState("");
    const [nweets,setNweets] = useState([]);
    const getNweets = async () => {
        const dbNweets = await dbService.collection('nweets').get();
        dbNweets.forEach((document) => console.log(document.data()))
    };
    useEffect (() =>{
        getNweets();
    },[])
    
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection('nweets').add({
            nweet:nweet,
            createdAt: Date.now(),
        })
        setNweet("");
    }
    const onChange = (event) => {
        const{
            target :{value}
            ,} = event;
            setNweet(value);
    };
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange}  value={nweet} type='text' placeholder="what's on your mind" maxLength={120} /> 
                <input type='submit' value="Nweet" />
            </form>
        </div>
    );
}

export default Home;