import { Router } from "@reach/router";

import Posts from "./components/posts";
import Post from "./components/post";

function App() {
  return (
    <div
      className='row'
      style={{
        backgroundColor: "rgb(223, 224, 228)",
      }}
    >
      <div className="col-lg-6 offset-lg-3" style={{backgroundColor: "hsla(0,0%,100%,.8)", border: "2 solid #e5e6e9"}}>
      <Router>
        <Posts path='/' />
        <Post path='/posts/:id' />
      </Router>
      </div>
    </div>
  );
}

export default App;
