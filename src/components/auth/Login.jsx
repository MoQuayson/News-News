import axios from 'axios'
import { useState } from 'react'
import '../../assets/css/auth.css'
import logo from '../../assets/images/logo.png'
import {MessageAlert,CsrfField} from '../helpers'

function Login(){
    return (
        <>
        <main>
            <section>
                <FormSection/>
            </section>
        </main>
        
        </>
    )
}


const FormSection = ()=>{
    const [emailInput,setEmailInput] = useState('')
    const [passwordInput,setPasswordInput] = useState('')
    const [emailValErr,setEmailValErr] = useState('')
    const [passwordValErr,setPasswordValErr] = useState('')
    const [message,setMessage] = useState('')
    const [type,setType] = useState('')

    async function handleFormSubmit (){
        let url = 'http://127.0.0.1:8000/api/auth/login';
        //let token = generateCSRFToken()
        await axios.post(url, document.querySelector('#loginForm'), {
            headers: {
              'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            //console.log(response.data.message);
            handleLoginResponse(response.data)
          })
          .catch(function (error) {
            //console.log(error.response);

            if(error.response.status == 422)
            {
                setEmailValErr(error.response.data.errors.email[0])
                setPasswordValErr(error.response.data.errors.password[0])
                setPasswordInput('')
            }
            else if(error.response.status == 500){
                setMessage('Oops. Something went wrong. Try again later')
                setType('fail')
                setPasswordInput('')
            }

        });
    }

    function handleLoginResponse(data){
        //token null i.e unauthenticated
        if(data.token === null)
        {
            setMessage('Invalid email or password')
            setType('fail')
        }
        else{
            window.localStorage.setItem('auth-token',data.token)
            window.location.href = '/feeds'
        }
    }
    

    return (
        <>
        <MessageAlert message={message} type={type}/>
        <div className="card form-card shadow-sm p-3 mb-3">
            <div className="card-body">
                <div className="text-center">
                    <img className="img-fluid logo" src={logo}/>
                </div>
                <h4 className="form-title mb-5 fw-bold">Login to your account</h4>

                <form id='loginForm' onSubmit={(e)=>{e.preventDefault()}}>

                    <CsrfField/>
                    <div className="col-md mb-3">
                        <label className="form-label">Email Address</label>
                        <input type="text" id="email" name="email" className="form-control" placeholder="you@example.com" 
                            value={emailInput} onChange={(e)=>{setEmailInput(e.target.value)}}
                        />
                        <span className="text-danger">{emailValErr}</span>
                    </div>

                    <div className="col-md mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" id="password" name="password" className="form-control" placeholder="Your password" 
                            value={passwordInput} onChange={(e)=>{setPasswordInput(e.target.value)}}  
                        />
                        <span className="text-danger">{passwordValErr}</span>
                    </div>

                    <div className="col-md mb-3 mt-4">
                        <button id="authSubmitBtn" className="btn" onClick={handleFormSubmit}>Sign In</button>
                    </div>
                </form>
            </div>
        </div>
        <div className="col-md text-center">
            <span >Don't have an account yet?  <a href="/auth/register" className="form-link">Sign up</a></span>
        </div>
        </>
    )
}



export default Login;