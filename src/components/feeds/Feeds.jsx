import axios from "axios"
import { useEffect, useState } from "react"
import '../../assets/css/main.css'
import { MessageAlert, TextTruncate, TopBarNav } from "../helpers"


export default function Feeds(){
    const [data,setData] = useState([])
    const [NYTArticles,setNYTArticles] = useState([])
    const [newsApiArticles,setNewsApiArticles] = useState([])
    const [requested,setRequested] = useState(true)
    const [user,setUser] = useState('')
    const [loading,setLoading]= useState(true)
    const [message,setMessage] = useState('')
    const [type,setType] = useState('')
    const [search,setSearch]=useState('')
    const [source,setSource]=useState('')
    const [category,setCategory]=useState('')

    useEffect(()=>{
        if(requested)
        {
            getArticles();
        }
    },[])
    async function getArticles(){
        setLoading(true);
        let url = 'http://127.0.0.1:8000/api/feeds';
        await axios.get(url,{
            headers:{
                'Authorization':`Bearer ${localStorage.getItem('auth-token')}`
            }
        })
        .then(function(response){
            //console.log(response.data)
            setUser(response.data.user)
            setNYTArticles(response.data.ny_times_articles)
            setNewsApiArticles(response.data.news_api_articles)

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
                console.log("response2")
            }
        })

    }

    async function handlePersonalizedFeeds(){
        setLoading(true);
        let url = 'http://127.0.0.1:8000/api/feeds/preference';
            await axios.get(url,{
                headers:{
                    'Authorization':`Bearer ${localStorage.getItem('auth-token')}`
                }
            })
            .then(function(response){
                //console.log(response.data)
                setUser(response.data.user)
                setNYTArticles(response.data.ny_times_articles)
                setNewsApiArticles(response.data.news_api_articles)
    
                setLoading(false);
                //setRequested(false)
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

    async function handleFeedsSearch()
    {
        let url = 'http://127.0.0.1:8000/api/feeds/search';
        setLoading(true)
        //let token = generateCSRFToken()
        await axios.get(url,{
            params:{
                source: source,
                category:category,
                search:search
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${localStorage.getItem('auth-token')}`,
            }
        })
        .then((response)=>{
            setUser(response.data.user)
            setNYTArticles(response.data.ny_times_articles)
            setNewsApiArticles(response.data.news_api_articles)

            setLoading(false);
            //setRequested(false)
        })

        .catch((error)=>{
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

    const handleSearchOptions=(e,type)=>{
        if(type == 'source')
        {
            if(e.target.checked == true){
                setSource( e.target.value)
                
            }
            else{
                setSource(null)
            }
        }
        else if(type == 'category')
        {
            if(e.target.checked == true){
                setCategory(e.target.value)
                
            }
            else{
                setCategory(null)
            }
        }

        else if(type == 'source')
        {
            setSearch(e.target.value)
        }
    }

    function handleFeedsSwitch(value){
        if(value == 'all')
        {
            getArticles()
        }else{
            handlePersonalizedFeeds()
        }
    }

    

    if(loading){
        return (
            <>
            <div className="container">
                <TopBarNav user={user}/>
            <MessageAlert type={''} message={''}/>
                <LoadingScreen/>
            </div>
            </>
        )
    }
    else{
        return (
            <>
            <TopBarNav user={user}/>
            <div className="container">
            <MessageAlert type={type} message={message}/>
            <MenuSection handleAllFeeds={getArticles} handlePersonalizedFeeds={handlePersonalizedFeeds} handleFeedsSwitch={handleFeedsSwitch}/>
            <FeedsSection nytArticles={NYTArticles} newsApiArticles={newsApiArticles}/>
            <FeedsSearchModal handleFeedsSearch={handleFeedsSearch} handleSearchOptions= {handleSearchOptions}/>
            </div>
            </>
        )
    }
}

const LoadingScreen=()=>{
    let num = [1,2,3,4,5] //10;
    return (
        <>
        <div className="row row-cols-lg-3 row-cols-md-2 g-3">
        {
            num.map((item,index)=>(
                <div className="col" key={index}>
                    <div  className="card article-card shadow border-0 mb-3" style={{'height':'100%'}}>
                        <div className="card-body">
                            <div className="row" style={{'lineHeight':'5px'}}>
                                <img className="mb-3 bg-secondary" width={100} height={150}/>

                                <div className="article-title placeholder-glow mb-2">
                                    <span className="placeholder col-12 h-25"></span>
                                </div>
                                <span className="article-description placeholder-glow mb-2">
                                    <span className="placeholder col-12 h-50"></span>
                                </span>

                                <span className="placeholder-glow">
                                    <span className="placeholder col-12"></span>
                                </span>

                            </div>
                        </div>
                    </div>
                </div>
            ))

        }
        </div>

        </>
    )
}

const ArticleView = (props)=>{
    const {article} = props;

    return (
        <div className="card article-card shadow border-0 mb-3" style={{'height':'100%'}} onClick={()=>{window.open(article.url,'_blank')}}>
            <div className="card-body">
               <div className="row" style={{'lineHeight':'20px'}}>
                    {
                        article.image != null?
                        <img className="mb-3" src={article.image} width={200} height={250}/>:
                        <img className="mb-3 bg-secondary" width={200} height={250}/>
                    }

                    <div className="article-title mb-3">{article.title}</div>
                    <span className="article-description mb-3">
                        <TextTruncate text={article.description} truncateValue={150}/>
                        <a className="article-link ms-1" href={article.url} target={'_blank'}>read more</a>
                    </span>


                    <div className="d-flex justify-content-between">
                        <span className="text-danger fw-bold">{article.source}</span>
                        <span className="text-secondary">{article.published_date}</span>
                    </div>
               </div>
            </div>
        </div>
    )
}

const FeedsSection = (props)=>{
    const {nytArticles,newsApiArticles} = props;
    
    //empty articles
    if(nytArticles.length < 1 && newsApiArticles.length < 1)
    {
        return <h4>Empty Feed</h4>
    }else{
        //if NYTimes Articles not empty but open org is
        if(!nytArticles.length < 1 && newsApiArticles.length < 1)
        {
            return (
                <>
                <div className="row row-cols-lg-3 row-cols-md-2 g-3">
                    {
                        nytArticles.map((item,index)=>(
                            <div key={index} className="col-md">
                                <ArticleView article={item}/>
                            </div>
                        ))
                    }
                </div>
                </>
            )
        }
        else if(nytArticles.length < 1 && !newsApiArticles.length < 1)
        {
            return (
                <>
                <div className="row row-cols-lg-3 row-cols-md-2 g-3">
                    
                    {
                        newsApiArticles.map((item,index)=>(
                            <div key={index} className="col-md">
                                <ArticleView article={item}/>
                            </div>
                        ))
                    }
                </div>
                </>
            )
        }
        else{
            return (
                <>
                <div className="row row-cols-lg-3 row-cols-md-2 g-3">
                    {
                        nytArticles.map((item,index)=>(
                            <div key={index} className="col-md">
                                <ArticleView article={item}/>
                            </div>
                        ))
                    }
                    {
                        newsApiArticles.map((item,index)=>(
                            <div key={index} className="col-md">
                                <ArticleView article={item}/>
                            </div>
                        ))
                    }
                </div>
                </>
            )
        }
    }


    
}

const MenuSection =(props)=>{
    const [value, setValue] = useState(null);
    const [checked, setChecked] = useState(true);
    const{handleAllFeeds,handlePersonalizedFeeds,handleFeedsSwitch} = props
    return (
        <>
        <div className="pt-3">
            <div className="row">
                <div className="col-md-4 mb-3">

                <div className="btn-group shadow-sm" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" className="btn-check" value={'all'} name="btnradio" id="btnradio1" autoComplete="off"  defaultChecked={checked} onClick={(e)=>{handleFeedsSwitch(e.target.value)}}/>
                    <label className="btn btn-outline-primary" htmlFor="btnradio1">All Feeds</label>

                    <input type="radio" className="btn-check" value={'pers'} name="btnradio" id="btnradio2" autoComplete="off" onClick={(e)=>{handleFeedsSwitch(e.target.value)}}/>
                    <label className="btn btn-outline-primary" htmlFor="btnradio2"  >Personalized Feeds</label>
                </div>
                </div>


                <div className="col-md-8 mb-3">
                    <button className="btn btn-primary float-end shadow"
                    data-bs-toggle="modal" data-bs-target="#feedsSearchModal">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

const FeedsSearchModal=(props)=>{
    const {handleFeedsSearch,handleSearchOptions} = props;
    return (
        <>
        <div className="modal fade" id="feedsSearchModal" tabIndex="-1" aria-labelledby="feedsSearchModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="feedsSearchModalLabel">Search Articles</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form id="articleSearchForm" onSubmit={(e)=>{e.preventDefault()}}>
                    <div className="col-md mb-5">
                        <label htmlFor="" className="form-label">Search</label>
                        <input type={'text'} className="form-control" placeholder="ex. superman" onChange={(e)=>{handleSearchOptions(e,'search')}}/>
                        <hr />
                    </div>

                    <div className="col-md mb-4">
                        <div htmlFor="" className="form-label">Sources</div>
                        <div className="btn-group w-100" role="group" aria-label="Basic checkbox toggle button group">
                            <input type="radio" name="sources[]" value="News Org" className="btn-check" id="btncheck1" 
                            autoComplete="off" onChange={(e)=>{handleSearchOptions(e,'source')}}/>
                            <label className="btn btn-outline-primary" htmlFor="btncheck1">News Org</label>

                            <input type="radio" name="sources[]" value="NY Times" className="btn-check" id="btncheck2" autoComplete="off" onChange={(e)=>{handleSearchOptions(e,'source')}}/>
                            <label className="btn btn-outline-info" htmlFor="btncheck2">NY Times</label>

                            <input type="radio" name="sources[]" value="The Guardian" className="btn-check" id="btncheck3" autoComplete="off" onChange={(e)=>{handleSearchOptions(e,'source')}}/>
                            <label className="btn btn-outline-danger" htmlFor="btncheck3">The Guardian</label>
                        </div>
                    </div>

                    <div className="col-md mb-4">
                        <div htmlFor="" className="form-label">Categories</div>
                        <div className="btn-group w-100" role="group" aria-label="Basic checkbox toggle button group">
                            <input type="radio" name="categories[]" value="sport" className="btn-check" id="btncheck4" 
                            autoComplete="off" onChange={(e)=>{handleSearchOptions(e,'category')}}/>
                            <label className="btn btn-outline-primary" htmlFor="btncheck4">Sports</label>

                            <input type="radio" name="categories[]" value="politics" className="btn-check" id="btncheck5" 
                            autoComplete="off" onChange={(e)=>{handleSearchOptions(e,'category')}}/>
                            <label className="btn btn-outline-secondary" htmlFor="btncheck5">Politics</label>

                            <input type="radio" name="categories[]" value="science" className="btn-check" id="btncheck6" 
                            autoComplete="off" onChange={(e)=>{handleSearchOptions(e,'category')}}/>
                            <label className="btn btn-outline-warning" htmlFor="btncheck6">Science</label>

                            <input type="radio" name="categories[]" value="business" className="btn-check" id="btncheck7" 
                            autoComplete="off" onChange={(e)=>{handleSearchOptions(e,'category')}}/>
                            <label className="btn btn-outline-danger" htmlFor="btncheck7">Business</label>
                        </div>
                    </div>

                    <hr />
                    <div className="col-md mb-1">
                        <div className="d-flex justify-content-end">
                            <button id="formSubmitBtn" className="btn me-1 shandow-sm" data-bs-dismiss="modal" onClick={handleFeedsSearch}>Search</button>
                            <button type="button" className="btn btn-danger shandow-sm" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
           
            </div>
        </div>
        </div>

        </>
    )
}