import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import {v4 as uuid4} from 'uuid';

const Home = ({userObj}) => {
    const [nweet,setNweet] = useState("");
    const [nweets,setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    /*
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
    */
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
        let attachmentUrl ="";
        if( attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`);
            const response = await attachmentRef.putString(attachment,'data_url');
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetObj = {
            text:nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        await dbService.collection('nweets').add(nweetObj);
        setNweet("");
        setAttachment("");
        /*
        await dbService.collection('nweets').add({
            text:nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        })
        setNweet("");
        */
    }
    const onChange = (event) => {
        const{
            target :{value}
            ,} = event;
            setNweet(value);
    };
    const onFileChange = (event) =>{
        //console.log(event.target.files)
        const {
            target:{files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        //파일 읽는 이벤트가 끝날때...
        reader.onloadend = (finishedEvent) =>{
            const{
                currentTarget :{result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachmentClick = () => setAttachment(null)
    //console.log(nweets);
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange}  value={nweet} type='text' placeholder="what's on your mind" maxLength={120} /> 
                <input type='file' accept='image/*' onChange={onFileChange}/>
                <input type='submit' value="Nweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width='50px' height='50px' />
                        <button onClick={onClearAttachmentClick}>Clear</button>
                    </div>
                    )
                }
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