import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";

import { getContent, listContents } from "./utils/rest";
import { getAccount } from "./utils/wallet";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [content, setContent] = useState(null);
  const [contentUri, setContentUri] = useState("");
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [contentsList, setContentList] = useState([]);

  useEffect(() => {
    (async () => {
      const account = await getAccount();
      setAccount(JSON.stringify(account));
      setContentList(await listContents());
    })();
  }, []);

  
  useEffect(() => {
    (async () => {
      const { uri, error } = await getContent(content);
      console.log('Getting content', content);
      if (uri) {
        console.log(uri);
      }
      if (error) {
        // alert(error);
        setContentUri("");
      } else {
        setContentUri(uri);
      }
    })();
  }, [content]);

  const onGetContent = async () => {
    try {
      setLoading(true);
      const { uri, error } = await getContent(content);
      if (error) {
        // alert(error);
        setContentUri('');
      } else {
        setContentUri(uri);
      }
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleItemClick = async (item) => {
    setContent(item);
    if (!(accessToken && accessToken.length>0)) {
      setContentUri("")
      alert('Looks like either you are disconnected or connected with a wallet that does not contain a Fanstop NFT!')
    }
  }

  return (
    <div className="h-100">
      <Navbar
        account={account}
        setAccount={setAccount}
        contentUri={contentUri}
        setContentUri={setContentUri}
        error={error}
        setError={setError}
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        onGetContent={onGetContent}
      />
      <div className="d-flex flex-column justify-content-center h-100">
        {/* <div className="mt-4"> */}
          {(() => {
            let table;
            if (contentsList && contentsList.length > 0) {
              console.log('printing contentsList...')
              console.log(contentsList);
              return (
                <div>
                  <section className="intro">
                    <div className="mask d-flex align-middle align-items-center h-100">
                      <div className="container">
                        <div className="row justify-content-center">
                          <div className="col-12">
                            <div className="card">
                              <div className="card-body p-0">
                                <center>
                                  {
                                    contentUri && contentUri.length>0
                                    ?
                                    (<img src={contentUri} alt="loading..." height="400px"/>)
                                    :
                                    (
                                      <div style={{ height: "400px", paddingTop: "100px"}}>
                                        <p className="fw-normal" >
                                          Please connect your wallet and if you have one of the Fanstop NFTs in them, then only you would be able to view my content!
                                          <br></br>
                                          The content are stored on IPFS and you can't access them even if I make their CIDs public!
                                          <br></br>
                                          So, get a Fanstop NFT now to watch my NFT-exclusive content!
                                        </p>
                                        <p className="fw-bolder">
                                          If you are a judge/panelist of Data Dao Hackathon, then please follow this instructions <a href='https://github.com/ankitshubham97/fanstop#data-dao-hackathon-2022'>here</a>!
                                        </p>
                                        <p className="fw-bolder">
                                          <a href='https://fanstop-frontend.vercel.app/admin'>Link to admin interface</a>!
                                        </p>
                                       
                                      </div>
                                    )
                                  }
                                </center>
                                
                                <div className="table-responsive table-scroll m-2" data-mdb-perfect-scrollbar="true" style={{position: "relative", height: "400px"}}>
                                  <table className="table table-striped mb-0">
                                    <thead style={{backgroundColor: "#002d72"}}>
                                      <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">CID</th>
                                        <th scope="col"></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {contentsList.map(item => {
                                        return (
                                          <tr key={item.cid}>
                                            <td>{ String(item.name).split('encrypted_')[1] }</td>
                                            <td>{ item.cid }</td>
                                            <td><button className={accessToken && accessToken.length > 0 ? "btn btn-outline-success": "btn btn-outline-danger"} onClick={()=> handleItemClick(item.name)}>View</button></td>
                                            {/* <td>{ item.content_type }</td>
                                            <td>{ item.size }</td>
                                            <td>{ item.created_at }</td> */}
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              );
            }
            // if (accessToken) {
            //   return <img src={content} alt="loading..." />
            // }
            return (
              <div></div>
            );
          })()}
          
        {/* </div> */}
      </div>
    </div>
  );
};

export default App;
