import React, {useContext} from 'react'
import './Header.css'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../../Context/UserContext';

function Header(props) {
    const { user, setUser} = useContext(UserContext);
    const history = useHistory();
    

    let logoutHandler =() => {
        localStorage.clear();
        setUser(null);
        history.push('/signin');

    }

    let navLink = null;

    if(user){
        navLink = [
            <li><Link className="Navigate" to="/profile">Profile</Link></li>,
            <li><Link className="Navigate" to="/create">Create</Link></li>,
            <li><Link className="Navigate" to="/subspost">My Following Post</Link></li>,
            <li>
                <button className="Logout_Button"
                    onClick={logoutHandler}>Logout</button>
            </li>
        ]
    }
    else {
        navLink = [
            <li><Link className="Navigate" to="/signin">SignIn</Link></li>,
            <li><Link className="Navigate" to="/signup">SignUp</Link></li>
                    
        ]
    }

    return (
        <nav className="Header">
            <Link  to= {user ? "/" : "/signin"}><h1>Clickza</h1></Link>
            <div className="Header__right">
                <ul>
                   {navLink} 
                </ul>
            </div>  
        </nav>
    )
}

export default Header
