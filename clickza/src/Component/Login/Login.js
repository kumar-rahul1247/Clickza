import React, { Component, useContext } from 'react'
import './Login.css'
//import { UserContext } from '../../App'; 
import { UserContext } from '../../Context/UserContext'
import Spinner from '../Spinner/spinner';



class Login extends Component {

    static contextType = UserContext;
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            error: null,
            isLoading: false
        }


        //this.setUser = this.context.setUser;

        // this.state = useContext(UserContext).state;
        // this.dispatch = useContext(UserContext).dispatch;
    }

    submithandler = (event) => {

        event.preventDefault();
        if (!this.state.email || !this.state.password) {
            this.setState({ error: "All Field are mandatory" });
            return;
        }

        this.setState({ isLoading: true });
        fetch('/signin', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(res => res.json())
            .then(data => {

                this.setState({ isLoading: false });
                if (data.error) {
                    this.setState({ error: data.error })
                }
                else {
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    // this.dispatch({type: "USER", payload: data.user})
                    this.context.setUser(data.user);

                    this.props.history.push('/');
                }

            })
            .catch(err => {

                this.setState({ error: "Something went Wrong..!! Please try after somtime.", isLoading: false })
                console.log(err.message)
            })

    }

    onChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        })
    }


    render() {


        let errorComponent = null;

        if (this.state.error) {
            errorComponent = <p className="ErrorMessage">{this.state.error}</p>
        }

        return (
            <div className="Login">


                <form className="card" onSubmit={(event)=>this.submithandler(event)}>
                    {errorComponent}
                    <h2 >Clickza SignIn</h2>
                    {
                        this.state.isLoading ? <Spinner /> : <>
                            <input
                                type="email"
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
                                onChange={(event) => { this.onChangeHandler(event) }}
                            />
                            <button
                                type="submit">
                                SignIn
                        </button>
                        </>
                    }
                </form>
                    )
                

            </div>
        )
    }
}


export default Login
