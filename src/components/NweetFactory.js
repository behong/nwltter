import React, { useState } from 'react';
import { dbService, storageService } from "fbase";
import {v4 as uuid4} from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const NweetFactory = ({userObj}) => {
    const [nweet,setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }        
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
    const onClearAttachmentClick = () => setAttachment("");

    return(
    <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
            <input onChange={onChange}  value={nweet} type='text' placeholder="what's on your mind" maxLength={120} className="factoryInput__input" /> 
            <input type='submit' value="&rarr;" className="factoryInput__arrow" />
        </div>     
        <label for="attach-file" className="factoryInput__label">
            <span>Add photos</span>
            <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
            id="attach-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ opacity: 0,}}
        />	                       
        {attachment && (
            <div className="factoryForm__attachment">
                <img src={attachment}  style={{ backgroundImage: attachment,}} />
                <div className="factoryForm__clear" onClick={onClearAttachmentClick}>
                <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                </div>  
            </div>
            )
        }
    </form>        
    )
}

export default NweetFactory;