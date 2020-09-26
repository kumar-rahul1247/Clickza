import React, { useEffect, useState, useContext } from 'react'
// import './UserProfile.css'
import { UserContext } from '../../Context/UserContext';
import { useParams } from 'react-router-dom';

function UserProfile() {
    console.log("START")
    const [userProfile, setUserProfile] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const { userid } = useParams();
  


    useEffect(() => {
        console.log("Effect---")
        console.log(user)
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                setUserProfile(result);
                console.log("Terrinlr")
            })

    }, [])

    const followUserHandler = () => {

        fetch('/follow', {
            method: "put",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                followId: userid
            })
        
        })
        .then( res => res.json())
        .then( data => {
            
            
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
           
            setUserProfile({
                ...userProfile,
                user: {
                    ...userProfile.user,
                    followers: [...userProfile.user.followers, data._id]
                }
            });
            console.log(userProfile)
            console.log("After..")
        })
    }

    const unfollowUserHandler = () => {

        fetch('/unfollow', {
            method: "put",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                followId: userid
            })
        
        })
        .then( res => res.json())
        .then( data => {
            
            let newfollower = userProfile.user.followers.filter( item => {
                return item !== data._id
            })
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
           
            setUserProfile({
                ...userProfile,
                user: {
                    ...userProfile.user,
                    followers: newfollower
                }
            });
            console.log(userProfile)
            console.log("After..")
        })
    }

    return (
        <>
            {!userProfile ? <h2 style ={{textDecoration:"none", margin: "150px auto"}}> Loading.....!! </h2> : (

                <div className="profile__container">
                    <div className="profile__upper">
                        <div className="profile__image">
                            <img className="image"
                                src="https://images.unsplash.com/photo-1590217283222-063e4fa266c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                                alt="RK"
                            />
                        </div>

                        <div className="profile__content">
                            
                            <h2>{userProfile && userProfile.user.name}</h2>
                            <h4 style={{fontWeight: 500, fontSize: "16px"}}>{userProfile && userProfile.user.email}</h4>
                            
                            <div className="profile__summary">
                                <h5>{userProfile && userProfile.post.length} posts</h5>
                                <h5>{userProfile.user.followers.length} followers</h5>
                                <h5>{userProfile.user.followings.length} following</h5>
                            </div>
                            {
                                userProfile && userProfile.user.followers.includes(user._id) ?
                                <button className="unfollow__user" onClick={unfollowUserHandler}>UNFOLLOW</button> :
                                <button className="follow__user" onClick={followUserHandler}>FOLLOW</button>
                            }
                            
                        </div>
                    </div>
                    <div className="profile__gallery">
                        {
                            userProfile && userProfile.post.map(item => (
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

export default UserProfile
