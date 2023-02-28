import logo from '../assets/images/logo.png'

export const MessageAlert = (props)=>{
    const {message,type} = props;

    if (type === 'success'){
        return (
            <>
            <div className="alert alert-success alert-dismissible fade show shadow-sm mb-3 text"  role="alert">
            <span className="badge rounded-pill bg-success py-1 fw-bold me-2">success</span>
            {message}
            <button id="close" type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            </>
        )
    }
    else if (type === 'fail'){
        return (
            <>
            <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-3 text" role="alert">
            <span className="badge rounded-pill bg-danger py-1 fw-bold me-2">error</span>
            {message}
            <button id="close" type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            </>
        )
    }
    else if (type === 'info'){
        return (
            <>
            <div className="alert alert-info alert-dismissible fade show shadow-sm mb-3 text" role="alert">
            <span className="badge rounded-pill bg-primary py-1 fw-bold me-2">info</span>
            {message}
            <button id="close" type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            </>
        )
    }
}

export const generateCSRFToken=()=>{
    return crypto.randomUUID()
}

export const CsrfField=()=>{
    return <input type={'hidden'} id='_token' name='_token' defaultValue={generateCSRFToken()}/>
}

export const TextTruncate=(props)=>{
    const {text,truncateValue} = props;
    if(text == null)
    {
        return '';
    }
    else if(text.length > truncateValue)
    {
        return text.slice(0, truncateValue - 3)// + "...";
    }
    else{
        return text;
    }
}

export function setErrorValueOrNull(value){
    return value != null?value[0]:null
}

export const TopBarNav=(props)=>{
    const {user} = props

    return (
        <>
        <nav id="nav" className="navbar navbar-expand-lg bg-white sticky-top shadow-sm">
            <div className="container">
                <a className="navbar-brand align-middle" href="/">
                    <img className="img-fluid logo" src={logo}/>
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-lg-3 d-flex  me-auto mb-2 mb-lg-0">
                    </ul>

                    <div className="dropdown">
                        <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {user.name} 
                            <i className="bi bi-chevron-down ms-1"></i>
                        </a>
                        <ul className="dropdown-menu p-2">
                            <li>
                                <a className="dropdown-item" href={`/settings/user/${user.id}`}><i
                                className="bi bi-person-gear me-1"></i>User Settings</a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/auth/sign-out"><i
                                className="bi bi-box-arrow-right me-1"></i>Sign-out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
        </>
    )
}