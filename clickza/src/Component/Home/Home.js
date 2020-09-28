import React, { Component, createContext } from 'react'
import './Home.css';

import { UserContext } from '../../Context/UserContext';
import RedHeart from '@material-ui/icons/Favorite';
import BorderHeart from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import SendIcon from '@material-ui/icons/Send';

class Home extends Component {

    static contextType = UserContext;
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            comment: ""
        }

    }

    componentDidMount() {
        console.log(this.context.user);
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then((res) => res.json())
            .then(result => {

                this.setState({ data: result.posts });
            })
            .catch(error => {
                console.log(error)
            })
    }


    makeComment = (text, postId) => {
        if (text) {
            fetch('/comment', {
                method: "put",
                headers: {
                    "content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    postId: postId,
                    text: text
                })
            })
                .then(res => res.json())
                .then(result => {

                    const newData = this.state.data.map(item => {
                        if (item._id === result._id) {
                            return result
                        }
                        else {
                            return item
                        }
                    })

                    this.setState({ data: newData })
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }


    likeDislikeHandle = (postId, isLike) => {

        let api_url = "/like";
        if (!isLike) {
            api_url = "/unlike"
        }
        fetch(api_url, {
            method: "put",
            headers: {
                "content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId
            })


        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = this.state.data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                console.log(newData)
                this.setState({ data: newData })

            })
            .catch(err => {
                console.log(err);
            })
    }


    deleteHandle = (postId) => {

        fetch('/delete/' + postId, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                let newData = this.state.data.filter(item => {
                    return item._id !== result._id
                })

                this.setState({ data: newData })
            })
    }



    render() {

        return (
            <div className="Home">
                {
                    this.state.data.map(item => {
                        console.log(item)
                        return (
                            <div className="home__card" key={item._id}>

                                <h5>

                                    <Link style={{ textDecoration: "none" }}
                                        to={item.postedBy._id !== this.context.user._id ? "/profile/" + item.postedBy._id : "/profile"} >

                                        <Avatar style={{ width: "30px", height: "30px", display: "inline-flex", marginRight: "10px", verticalAlign: "middle" }}
                                            src={item.postedBy.profilePic}>
                                            {item.postedBy.name.substr(0, 1)}
                                        </Avatar>{item.postedBy.name}
                                    </Link>
                                    {item.postedBy._id === this.context.user._id ?
                                        (<DeleteIcon className="delete__Icon"
                                            onClick={() => this.deleteHandle(item._id)} />) :
                                        null
                                    }
                                </h5>
                                <div className="card__image">
                                    <img className="images"
                                        src={item.photo}
                                        alt="" />
                                </div>
                                <div className="card__content">
                                    <div style={{ display: "flex" }}>
                                        {
                                            item.likes.includes(this.context ? this.context.user._id : "") ?
                                                (<RedHeart className="icon" onClick={() => { this.likeDislikeHandle(item._id, false) }} />) :
                                                (<BorderHeart style={{ color: "lightslategray" }} onClick={() => { this.likeDislikeHandle(item._id, true) }} />)
                                        }

                                        <p style={{ paddingLeft: "10px", color: "lightslategray", fontWeight: 600 }}>
                                            {item.likes.length} likes
                                        </p>
                                    </div>


                                    <p style={{ fontSize: "16px" }}>{item.title}</p>
                                    <p>{item.body}</p>
                                    <hr className="hr_line" />
                                    {
                                        item.comments.map(record => {
                                            return (
                                                <p>
                                                    <span style={{ fontWeight: 700 }}>{record.postedBy.name}: </span>
                                                    {record.text}
                                                </p>
                                            )
                                        })
                                    }
                                    <form className="form__comment"
                                        onSubmit={event => {
                                            event.preventDefault()
                                            this.setState({ comment: event.target.value })
                                            this.makeComment(event.target[0].value, item._id)
                                            event.target[0].value = "";

                                        }}>



                                        <input type="text"
                                            value={this.state.comment}
                                            placeholder="Add a comment..!!"
                                            onChange={(ev) => { this.setState({ comment: ev.target.value }) }} />
                                        <SendIcon
                                            className="send__icon"
                                            onClick={() => {
                                                this.makeComment(this.state.comment, item._id);
                                                this.setState({ comment: "" })
                                            }
                                            }
                                        />
                                    </form>

                                </div>
                            </div>
                        )
                    })

                }

            </div>
        )
    }
}


export default Home

