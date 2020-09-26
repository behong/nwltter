import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({userObj}) => {
    const [nweet,setNweet] = useState("");
    const [nweets,setNweets] = useState([]);
    const getNweets = async () => {
        const dbNweets = await dbService.collection('nweets').get();
        dbNweets.forEach((document) => {
            const nweetObject ={
               ...document.data(),
                id:document.id,
            }
            setNweets( (prev) => [nweetObject, ...prev] );
        });
    };
    useEffect (() =>{
        //getNweets();
        //  읽어오는 다른 방법 .. 실시간 으로 데이터 읽어오기 onSnapshot
        dbService.collection("nweets").onSnapshot((snapshot) =>{
            const nweetArray = snapshot.docs.map((doc)=>({
                id : doc.id,
                ...doc.data(),
            }));
            //console.log(nweetArray);
            setNweets(nweetArray);
        });
    },[])
    //console.log(userObj);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection('nweets').add({
            text:nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        })
        setNweet("");
    }
    const onChange = (event) => {
        const{
            target :{value}
            ,} = event;
            setNweet(value);
    };
    //console.log(nweets);
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange}  value={nweet} type='text' placeholder="what's on your mind" maxLength={120} /> 
                <input type='submit' value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
}

export default Home;