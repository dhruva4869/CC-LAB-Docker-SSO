import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { useAuth0 } from "@auth0/auth0-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
const customMaterialDark = {
  ...materialDark,
  'span.token': {
    color: '#fff', // Set the text color to white
  },
};




function singleBook () {

    const [data, setData] = useState([]);
    const [outputCode, setOutputCode] = useState([]);
    const { user, isAuthenticated, isLoading } = useAuth0();

    const [visibleCode, setIsVisibleCode] = useState(false);
    const [visibleEditorial, setVisibleEditorial] = useState(false);

    const toggleVisibility = () => {
      setIsVisibleCode(!visibleCode);
    }

    const toggleVisibilityEditorial = () => {
      setVisibleEditorial(!visibleEditorial);
    }

    const generateMockupCode = (inputCode) => {
      const lines = inputCode.split("\n");
      const formattedCode = lines.map(
        (line, index) => <pre key={index + 1} data-prefix={index + 1}>{line}</pre>
      );
  
      return (
        <>
        <br />
        <button className="btn btn-outline btn-info p-4 m-4 font-bold" onClick={toggleVisibility}>
          {visibleCode ? "Hide Content" : "Show content"}
        </button>
        {visibleCode && 
        (<div className="mockup-code my-6">
          
          <p className='py-4 text-lg whitespace-pre-line bg-inherit text-white'>
          
            {formattedCode}
          </p>
        </div>)}
        </>
      );
    };


  


    const urlSlug = useParams(); // ye path mai konse parameters hai. konse path mai?
    const baseUrl = `https://backend-codehelper-trial.onrender.com/api/books/${urlSlug.slug}`;


    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await fetch(baseUrl);
                if(!response.ok) {
                    throw new Error("Error fetching book");
                }

                const jsonData = await response.json();
                setData(jsonData);
                
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    function StarRating({ num }) {
        const stars = [];
        for(let i = 0; i < num; ++i) {
            stars.push(<span key={i}>⭐</span>)
        }
        return <div>Rating: {stars}</div>
    }


    return (
        <main className="py-7 mx-auto relative ">
        
        <div className="col-1 rounded-xl items-center justify-evenly text-center">
        
            <img className="mx-auto py-12 min-h-36 min-w-36 content-center items-center justify-center" src={`http://localhost:8000/uploads/${data?.thumbnail}`}
            alt={data?.title} />
            {isAuthenticated && <Link to={`/editproblem/${data.slug}`} className="text-xl">✏️Edit</Link>} <br/><br/>
            <Link to="/problems">🔙 Books </Link>
        </div>
        <div className="py-10 ">
         
    
        
          
        <br />
        <div className=" items-center p-5 mx-auto overflow-auto">
          <div className="px-10">
            <h1 className="text-3xl font-serif text-pretty text-amber-200">{data?.title}</h1> <br />


            <div className="description-box whitespace-pre-line text-lg text-orange-400 font-serif">
            <button className="btn btn-outline btn-info p-4 m-4 font-bold" onClick={toggleVisibilityEditorial}>
              {visibleEditorial ? "Hide Editorial" : "Show Editorial"}
            </button>
            
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      
                      <SyntaxHighlighter
                        style={customMaterialDark}
                        language={match[1]}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        {...props}
                      />
                    ) : (
                      
                      generateMockupCode(children)
                      // <code className={className} style={{color:"white"}} {...props}>
                      //   {children}
                      // </code>
                    );
                  },
                  strong: ({ node, ...props }) => <strong style={{ fontWeight: 'bold' }} {...props} />,
                }}
              >
                {visibleEditorial && data?.description}
              </ReactMarkdown>
            </div>
            






            {/* <p className="text-lg font-mono whitespace-pre-line">{data?.description}</p><br /> */}





            <br />
            <span className="text-lg font-serif text-slate-200"><StarRating num={data?.stars} /> </span> <br />
    
            <p className="text-lg font-serif text-slate-200">Category</p>
            <ul className="font-serif text-pretty text-amber-200 text-lg">
              {data?.category?.map((item, index)=> (
                <li key={index}>{item.charAt(0).toUpperCase()+item.substr(1)}</li>
              ))}
            </ul>
            {/* <h1>{user.name}</h1> */}
          </div>
        </div>
        </div>
        </main>
      );

}

export default singleBook;
