import React, { useState, useEffect } from 'react'
import './Signup.css'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

function Signup(props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [picurl, setPicurl] = useState("");


    useEffect(() => {

        if(picurl){
            console.log("I am Again Effect")
            console.log(picurl)
            registerSignupDetail();
        }
                
    }, [picurl])


    let submithandler = () => {
        console.log(" i am clicked called")
        if (!email || !password || !name) {
            setError("All Field are mandatory");
            return;
        }

        if(profilePic){
            uploadProfilePic()
        }
        else{
            registerSignupDetail();
        }

        
    }

    let registerSignupDetail = () => {
        fetch('/signup', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                name,
                profilePic: picurl
            })
        })
            .then(res => res.json())
            .then(data => {

                if (data.error) {
                    setError(data.error)
                }
                else {
                    props.history.push('/signin');
                }
            })
            .catch(err => console.log(err.message))
    }


    let uploadProfilePic = () => {
        console.log("I am Upload")
        console.log(profilePic)
        const data = new FormData();
        data.append("file", profilePic);
        data.append("upload_preset","clickza");
        data.append("cloud_name", "reyhul")
        
        fetch('	https://api.cloudinary.com/v1_1/reyhul/image/upload', {
            method: "post",
            body: data
    })
        .then( res => res.json())
        .then(data => {

            setPicurl(data.url);
            
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        })
    }



    return (
        <div className="Login">
            <div className="card">
                {error ? <p className='ErrorMessage'>{error}</p> : null}
                <h2>Clickza SignUp</h2>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setError(null);
                    }
                    }
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        setError(null);
                    }}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                        setError(null);
                    }}
                />

                <div className="upload__button">
                    <label htmlFor="uploadImg" className="upload__label ">Profile Pic</label>
                    <input
                        id="uploadImg"
                        type="file"
                        name="file"
                        onChange={(event) => setProfilePic(event.target.files[0])}
                    />
                    <AddPhotoAlternateIcon className="addImage" />
                </div>
                <button
                    type="submit"
                    onClick={submithandler}>
                    SignUp
                        </button>
            </div>
        </div>
    )
}

export default Signup






