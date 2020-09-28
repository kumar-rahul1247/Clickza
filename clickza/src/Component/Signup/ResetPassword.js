import React, { useState, useEffect } from 'react'
import './Signup.css'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';



function Signup(props) {

    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);

    let resetHandler = () => {

        console.log(" I am Reset called")
        if (!email) {
            setError("Please Provide Email Address");
            return;
        }

        fetch('/reset', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
                
            })
        })
            .then(res => res.json())
            .then(data =>{

                if (data.error) {
                    setError(data.error)
                }
                else {
                    props.history.push('/signin');
                }
            })
            .catch(err => console.log(err.message))

       
    }
 
    return (
        <div className="Login">
            <div className="card">
                {error ? <p className='ErrorMessage'>{error}</p> : null}
                
                <h2 style={{width:"fit-content"}}>Reset Password</h2>
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


                <button
                    type="submit"
                    onClick={resetHandler}>
                    Reset Password
                        </button>
            </div>
        </div>
    )
}

export default Signup






