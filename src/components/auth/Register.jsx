import axios from 'axios'
import { useState } from 'react'
import '../../assets/css/auth.css'
import logo from '../../assets/images/logo.png'
import {MessageAlert,CsrfField, setErrorValueOrNull} from '../helpers'

export default function Register(){
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

    const [nameInput,setNameInput] = useState('')
    const [nameValErr,setNameValErr] = useState('')
    const [pwdConfirmInput,setpwdConfirmInput] = useState('')
    const [pwdConfirmValErr,setpwdConfirmValErr] = useState('')
    const [message,setMessage] = useState('')
    const [type,setType] = useState('')

    async function handleFormSubmit (){
        let url = 'http://127.0.0.1:8000/api/auth/register';
        //let token = generateCSRFToken()
        await axios.post(url, document.querySelector('#registerForm'), {
            headers: {
              'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
            //console.log(response.data.message);
            handleRegisterResponse(response.data)
          })
          .catch(function (error) {
            //console.log(error.response);

            if(error.response.status == 422)
            {
                setNameValErr(setErrorValueOrNull(error.response.data.errors.name))
                setEmailValErr(setErrorValueOrNull(error.response.data.errors.email))
                setPasswordValErr(setErrorValueOrNull(error.response.data.errors.password))
                setpwdConfirmValErr(setErrorValueOrNull(error.response.data.errors.password_confirmation))

                setpwdConfirmInput('')
                setPasswordInput('')
            }
            else if(error.response.status == 500){
                setMessage('Oops. Something went wrong. Try again later')
                setType('fail')
                setPasswordInput('')
                setpwdConfirmInput('')
            }

        });
    }

    function handleRegisterResponse(data){
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
                <div className="text-center">
                    <img className="img-fluid logo" src={logo}/>

                </div>
            <div className="card-body">
                <h4 className="form-title mb-2 fw-bold">Create new account</h4>

                <form id='registerForm' onSubmit={(e)=>{e.preventDefault()}}>

                    <CsrfField/>
                    <div className="col-md mb-3">
                        <label className="form-label">Full Name</label>
                        <input type="text" id="name" name="name" className="form-control" placeholder="Your name here" 
                            value={nameInput} onChange={(e)=>{setNameInput(e.target.value)}}
                        />
                        <span className="text-danger">{nameValErr}</span>
                    </div>

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

                    <div className="col-md mb-3">
                        <label className="form-label">Password Confirmation</label>
                        <input type="password" id="password_confirmation" name="password_confirmation" className="form-control" placeholder="Your password" 
                            value={pwdConfirmInput} onChange={(e)=>{setpwdConfirmInput(e.target.value)}}  
                        />
                        <span className="text-danger">{pwdConfirmValErr}</span>
                    </div>

                    <div className="col-md mb-2">
                        <button id="authSubmitBtn" className="btn" onClick={handleFormSubmit}>Create New Account</button>
                    </div>
                </form>
            </div>
        </div>
        <div className="col-md text-center">
            <span >Already have an account?  <a href="/auth/login" className="form-link">Sign in</a></span>
        </div>
        </>
    )
}

