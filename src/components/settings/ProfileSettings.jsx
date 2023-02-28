import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { CsrfField, MessageAlert, setErrorValueOrNull, TopBarNav } from "../helpers";
import '../../assets/css/main.css';

export default function ProfileSettings(){
    const {id} = useParams();
    const [user,setUser] = useState('')
    const [preference,setPreference] = useState('')
    const [requested,setRequested] = useState(true)
    const [loading,setLoading]= useState(true)
    const [message,setMessage] = useState('')
    const [type,setType] = useState('')

    useEffect(()=>{
        if(requested)
        {
            getProfileSettings();
        }
    },[])

    async function getProfileSettings(){
        let url = `http://127.0.0.1:8000/api/settings/user/${id}`
        await axios.get(url,{
            headers:{
                'Authorization':`Bearer ${localStorage.getItem('auth-token')}`
            }
        })
        .then(function(response){
            //console.log(response.data)
            setUser(response.data.user)
            setPreference(response.data.preference)

            setLoading(false);
            setRequested(false)
        })
        .catch(function(error){
            setLoading(false);
            setRequested(false)


            if(error.response != null && error.response.status == 401)
            {
                window.location.href = "http://127.0.0.1:3000/auth/login"
            }
            else if(error.response != null && error.response.status === 500)
            {
                setMessage('Oops. Something went wrong. Try again later')
                setType('fail')
            }
        })

    }

    //when user form is sumbited
    async function handleUserFormSubmit (){
        let url = `http://127.0.0.1:8000/api/users/${id}`;

        await axios.put(url, document.querySelector('#userForm'), {
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${localStorage.getItem('auth-token')}`
            }
        })
        .then(function (response) {
            handleUserEditResponse(response.data)
          })
          .catch(function (error) {
            //console.log(error.response);

            if(error.response.status == 422)
            {
                setNameValErr(setErrorValueOrNull(error.response.data.errors.name))
            }
            else if(error.response.status == 500){
                setMessage('Oops. Something went wrong. Try again later')
                setType('fail')
            }
        });
    }

    //response for user submitted
    function handleUserEditResponse(data){
        if(data.status === 200)
        {
            setMessage('User updated')
            setType('success')
            setUser(data.user)
        }
    }
    //when user form is sumbited
    async function handlePreferenceFormSubmit (){
        let url = `http://127.0.0.1:8000/api/feeds-preferences`;

        await axios.post(url, document.querySelector('#preferenceForm'), {
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${localStorage.getItem('auth-token')}`
            }
        })
        .then(function (response) {
            handlePreferenceResponse(response.data)
          })
          .catch(function (error) {
            //console.log(error.response);

            if(error.response.status == 422)
            {
                setNameValErr(setErrorValueOrNull(error.response.data.errors.name))
            }
            else if(error.response.status == 500){
                setMessage('Oops. Something went wrong. Try again later')
                setType('fail')
            }
        });
    }

    //response for preference submitted
    function handlePreferenceResponse(data){
        if(data.status === 200)
        {
            setMessage('User updated')
            setType('success')
            setUser(data.user)
        }
    }

    if(loading)
    {
        return (
            <>
            <TopBarNav user={user}/>
            <div className="container mt-3">
                <MessageAlert message={message} type={type} />
            </div>
            </>
        )
    }
    else{
        return (
            <>
            <TopBarNav user={user}/>
            <div className="container mt-3">
                <div className="d-flex justify-content-between mb-2">
                    <h4>Profile Settings</h4>
                    <a href="/feeds" id="formSubmitBtn" className="btn shadow-sm">View Feeds</a>
                </div>
                <MessageAlert message={message} type={type} />
                <div className="card mt-3 shadow">
                    <div className="card-body">

                        <UserProfileSection user={user} handleUserFormSubmit={handleUserFormSubmit}/>
                        <hr />

                        <PreferenceSection user={user} preference={preference}
                        handlePreferenceFormSubmit={handlePreferenceFormSubmit}/>
                    </div>
                </div>
                
            </div>
            </>
        )
    }
}


const UserProfileSection =(props)=>{
    const{user,handleUserFormSubmit} = props;

    const [nameInput,setNameInput] = useState(user.name)
    const [nameValErr,setNameValErr] = useState('')
    const [emailValErr,setEmailValErr] = useState('')

    return (
        <>

            <form id="userForm" onSubmit={(e)=>{e.preventDefault()}}>
                    <CsrfField/>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <td colSpan="2"><h4>Profile Information</h4></td>
                            </tr>
                            <tr>
                                <td className="cell-title">Full Name</td>
                                <td className="cell-input">
                                    <input className="form-control" id="name" name="name"
                                    value={nameInput} onChange={(e)=>{setNameInput(e.target.value)}} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <span className="text-danger">{nameValErr}</span>
                                </td>
                            </tr>

                            <tr>
                                <td className="cell-title">Email Address</td>
                                <td className="cell-input">
                                    <input className="form-control" id="email" name="email"
                                    value={user.email} disabled/>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <span className="text-danger">{emailValErr}</span>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={2}>
                                    <button id="formSubmitBtn" className="btn shadow-sm float-end mb-3" onClick={handleUserFormSubmit}>Save Changes</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
        </>
    )
}

const PreferenceSection=(props)=>{
    const{user,preference,handlePreferenceFormSubmit,source,sourceValErr,category,categoryValErr} = props;

    return (
        <>
            <form id="preferenceForm" onSubmit={(e)=>{e.preventDefault()}}>
            <h4>Feed Preference</h4>
                <input type="hidden" name="id" defaultValue={user.id} />
                <CsrfField/>
                <div className="col-md mb-5 mt-3">
                    <h6>News Sources</h6>
                    <div className="btn-group w-75" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" name="source" value="News Org" className="btn-check" id="btncheck1" autoComplete="off" defaultChecked={(e)=>{setPreferenceRadValue(preference,'source',e.target.value)}}/>
                        <label className="btn btn-outline-primary" htmlFor="btncheck1">News Org</label>

                        <input type="radio" name="source" value="NY Times" className="btn-check" id="btncheck2" autoComplete="off" defaultChecked={(e)=>{setPreferenceRadValue(preference,'source',e.target.value)}}/>
                        <label className="btn btn-outline-info" htmlFor="btncheck2">NY Times</label>

                        <input type="radio" name="source" value="The Guardian" className="btn-check" id="btncheck3" autoComplete="off" defaultChecked={(e)=>{setPreferenceRadValue(preference,'source',e.target.value)}}/>
                        <label className="btn btn-outline-danger" htmlFor="btncheck3">The Guardian</label>
                    </div>

                    <span className="text-danger">{sourceValErr}</span>
                </div>

                <div className="col-md mb-4">
                    <h6>Categories</h6>
                    <div className="btn-group w-75" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" name="category" value="Sports" className="btn-check" id="btncheck4" autoComplete="off" defaultChecked={(e)=>{setPreferenceRadValue(preference,'category',e.target.value)}}/>
                        <label className="btn btn-outline-primary" htmlFor="btncheck4">Sports</label>

                        <input type="radio" name="category" value="Politics" className="btn-check" id="btncheck5" autoComplete="off" defaultChecked={(e)=>{setPreferenceRadValue(preference,'category',e.target.value)}}/>
                        <label className="btn btn-outline-secondary" htmlFor="btncheck5">Politics</label>

                        <input type="radio" name="category" value="Science" className="btn-check" id="btncheck6" autoComplete="off" defaultChecked={(e)=>{setPreferenceRadValue(preference,'category',e.target.value)}}/>
                        <label className="btn btn-outline-warning" htmlFor="btncheck6">Science</label>

                        <input type="radio" name="category" value="Business" className="btn-check" id="btncheck7" autoComplete="off" defaultChecked={(e)=>{setPreferenceRadValue(preference,'category',e.target.value)}}/>
                        <label className="btn btn-outline-danger" htmlFor="btncheck7">Business</label>
                    </div>
                    <span className="text-danger">{categoryValErr}</span>
                </div>

                <div className="col-md w-75 mb-4">
                    <button id="formSubmitBtn" className="btn float-end" onClick={handlePreferenceFormSubmit}>Save Changes</button>
                </div>

            </form>
        </>
    )
}

function setPreferenceRadValue(preference,type,value){
    console.log(value)
    if(preference == null)
    {
        return false;
    }else{
        if(type == 'source' && preference.source == value)
        {
            return true
        }

        if(type == 'category' && preference.category == value)
        {
            return true
        }

        return false
    }
}