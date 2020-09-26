import React, { useEffect, useState, useContext } from 'react'
import './Profile.css'
import { UserContext } from '../../Context/UserContext';
import NoPic from '../../StaticImage/noProfilePic.jpg'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

function Profile() {

    const [myphoto, setMyPhoto] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [profilePic, setProfilePic] = useState(null);
    const [picurl, setPicurl] = useState("");

    useEffect(() => {
        console.log("I am Use" + user)

        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                console.log(user)
                setMyPhoto(result.mypost)
            })

    }, [])


    useEffect(() => {

        console.log("FIle At Cloud")
        if(profilePic){
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
                console.log("FIle At URL")
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
        }

    },[profilePic])


    useEffect(() => {
        console.log("FIle At Mongo")
        if(picurl){
            fetch('/updatepic', {
                method: "put",
                headers: {
                    "Authorization": "Bearer "+localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    profilePic: picurl
                })

            })
            .then( res => res.json())
            .then( data => {
                console.log("FIle At Inside Mongo")
                console.log(data)
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data))
            })
            .catch( err=> {
                console.log(err)
            })
        }
    }, [picurl])


    return (

        <>
            {
                !user ? <h2 style={{ textDecoration: "none", margin: "150px auto" }}> Loading.....!! </h2> : (

                    <div className="profile__container">
                        <div className="profile__upper">
                            <div className="profile__image">
                                {
                                    user && user.profilePic ? ( 
                                        <img className="image"
                                            src={user && user.profilePic}
                                            alt="RK"
                                        />
                                    ) : (
                                            <img className="image"
                                                src={NoPic}
                                                alt="RK"
                                            />
                                        )



                                }
                                <label htmlFor="profileDP"><PhotoCameraIcon className="profileChange__icon"/></label>
           
                                <input type="file" id="profileDP" accept="image/png, image/jpeg" style={{display: "none"}}
                                    onChange={(event) => {
                                            console.log(event.target.files[0])
                                            setProfilePic(event.target.files[0])
                                            //event.target.files[0]="";
                                    }}/>
                            </div>

                            <div className="profile__content">
                                <h2>{user ? user.name : null}</h2>
                                <h4 style={{ fontWeight: 500, fontSize: "16px" }}>{user && user.email}</h4>
                                <div className="profile__summary">
                                    <h5>{myphoto.length} posts</h5>
                                    <h5>{user.followers.length} followers</h5>
                                    <h5>{user.followings.length} following</h5>
                                </div>
                            </div>
                        </div>
                        <div className="profile__gallery">
                            {
                                myphoto.map(item => (
                                    <img
                                        className="item"
                                        key={item._id}
                                        src={item.photo}
                                        alt="Ocean" />
                                ))
                            }

                            {/* <img  className="item" src="https://images.unsplash.com/photo-1572276643543-90ec6f977376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                <img  className="item" src="https://images.unsplash.com/photo-1567267020524-07219c353d4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                <img  className="item" src="https://images.unsplash.com/photo-1568207182762-8838beec7dca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                <img  className="item" src="https://images.unsplash.com/photo-1578553951253-48c6eb50ae41?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                <img  className="item" src="https://images.unsplash.com/photo-1549276755-bdd15cddcfbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                <img  className="item" src="https://images.unsplash.com/photo-1596126753378-b077b0913842?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/> */}
                        </div>
                    </div>
                )}
        </>
    )
}

export default Profile
