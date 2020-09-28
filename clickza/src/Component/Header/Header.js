import React, { useContext, useState } from 'react'
import './Header.css'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';




function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


function Header(props) {
    const { user, setUser } = useContext(UserContext);
    const history = useHistory();
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchedUser, setSearchedUser] = useState("");

    let logoutHandler = () => {
        localStorage.clear();
        setUser(null);
        history.push('/signin');

    }

    let navLink = null;

    if (user) {
        navLink = [
            <SearchIcon key="search" onClick={() => setOpen(true)} className="search__icon" />,
            <li key="1"><Link className="Navigate" to="/profile">Profile</Link></li>,
            <li key="2"><Link className="Navigate" to="/create">Create</Link></li>,
            <li key="3"><Link className="Navigate" to="/subspost">My Following Post</Link></li>,
            <li key="4">
                <button className="Logout_Button"
                    onClick={logoutHandler}>Logout</button>
            </li>
        ]
    }
    else {
        navLink = [
            <li key="5"><Link className="Navigate" to="/signin">SignIn</Link></li>,
            <li key="6"><Link className="Navigate" to="/signup">SignUp</Link></li>

        ]
    }

    let fetchUser = (value) => {
        setSearch(value);

        fetch('/searchuser', {
            method: "post",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: value
            })
        })
        .then( res => res.json())
        .then( users => {
            console.log(users.user)

            setSearchedUser(users.user)

        })
        .catch( err => {
            console.log(err)
        })
    }

    return (
        <nav className="Header">
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <center><h4>Searched User</h4></center>
                    <div style={{display:"flex", alignItems:  "center", marginBottom: "20px"}}>
                    <SearchIcon/>
                        <input
                            className="search__input"
                            placeholder="Search"
                            type="text"
                            value={search}
                            onChange={(e) => fetchUser(e.target.value)}
                        />


                    </div>

                    <div className="searched__content">
                        {
                            searchedUser===""? <h5>No Search Yet..!!</h5> :
                            searchedUser.length>0 ? (
                                searchedUser.map( item =>  (
                                        <Link style={{textDecoration:"none", color:"black"}}
                                            to={item._id!==user._id?`/profile/${item._id}`:"/profile"}
                                            onClick={ () => {setOpen(false)}}>
                                            <h5 key={item._id}>{item.email}</h5>
                                        </Link>
                                    )
                                )
                            ) : (<h5>No user Found</h5>)
                            
                            
                        }
                        
                        
                 
                    </div>

                </div>
            </Modal>
            <Link to={user ? "/" : "/signin"}><h1>Clickza</h1></Link>
            <div className="Header__right">
                <ul>
                    {navLink}
                </ul>
            </div>
        </nav>
    )
}

export default Header
