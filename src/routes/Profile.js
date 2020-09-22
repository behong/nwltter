import Navigation from "components/Navigation";
import { authService } from "fbase";
import React from "react";
import { useHistory } from "react-router-dom";

export default () => {
    const histoy = useHistory();
    const onLogOutClick = () => {
        authService.signOut()
        histoy.push('/');
    };
    return(
        <>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    )
};