import React, { Component, useContext } from 'react'
import './Login.css'
//import { UserContext } from '../../App'; 
import {UserContext} from '../../Context/UserContext'

 


class Login extends Component {

    static contextType = UserContext;
    constructor(props) {
        super(props)
    
        this.state = {
             email:"",
             password:"",
             error:null
        }

        
        //this.setUser = this.context.setUser;

        // this.state = useContext(UserContext).state;
        // this.dispatch = useContext(UserContext).dispatch;
    }
    
    submithandler = ()=> {

        if(!this.state.email || !this.state.password){
            this.setState({error:"All Field are mandatory"});
            return;
        }
    
        fetch('/signin', {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                email:this.state.email,
                password:this.state.password
            })
        })
        .then(res => res.json())
        .then(data => {
   
            if(data.error) {
                this.setState({error: data.error})
            }
            else {
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                
                // this.dispatch({type: "USER", payload: data.user})
                this.context.setUser(data.user);
                
                this.props.history.push('/');
            }
        
        })
        .catch(err => console.log(err.message))

    }

    onChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            error:null
        })
    }


    render() {
        
        
        let errorComponent=null;

        if(this.state.error){
            errorComponent = <p className="ErrorMessage">{this.state.error}</p>
        }

        return (
            <div className="Login">

                <div className="card">
                    {errorComponent }
                    <h2>Clickza SignIn</h2>
                    <input 
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.onChangeHandler}
                        />
                    <input 
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={(event)=> {this.onChangeHandler(event)}}
                        />
                    <button
                        type="submit"
                        onClick={this.submithandler}>
                            SignIn 
                        </button>
                </div>
            </div>
        )}
}


export default Login
