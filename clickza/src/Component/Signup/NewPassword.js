import React, { useState, } from 'react'

//import { UserContext } from '../../App'; 
import {UserContext} from '../../Context/UserContext'
import { Link, useHistory, useParams} from 'react-router-dom';

 


function NewPassword(){

    
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const {token} = useParams()
    const history = useHistory();

    let submithandler = ()=> {

        if(!password){
            setError({error:"All Field are mandatory"});
            return;
        }
    
        fetch('/newpassword', {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        })
        .then(res => res.json())
        .then(data => {
   
            if(data) {
                
                setError(data.error)
            }
            else {
                console.log(history)
               history.push('/signin');
            }
        
        })
        .catch(err => console.log(err.message))

    }


        
        let errorComponent=null;

        if(error){
            errorComponent = <p className="ErrorMessage">{error}</p>
        }

        return (
            <div className="Login">

                <div className="card">
                    {errorComponent }
                    <h2>New Password</h2>
                    
                    <input 
                        type="password"
                        name="password"
                        placeholder="Enter new Password"
                        value={password}
                        onChange={(event)=> {setPassword(event.target.value)}}
                        />
                    <button
                        type="submit"
                        onClick={submithandler}>
                            Update Password 
                        </button>
                </div>
            </div>
        )
}


export default NewPassword
