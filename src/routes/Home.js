import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";


const Home = ({userObj}) => {
    const [nweets,setNweets] = useState([]);
    useEffect (() =>{
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

    return(
        <div className="container">
            <NweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
}

export default Home;