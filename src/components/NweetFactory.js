import React, { useState } from 'react';
import { dbService, storageService } from "fbase";
import {v4 as uuid4} from 'uuid';


const NweetFactory = ({userObj}) => {
    const [nweet,setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

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

    return(
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
    )
}

export default NweetFactory;