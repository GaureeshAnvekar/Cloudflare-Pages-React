import React, { useEffect, useState } from "react";

import Post from "./post.js";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const [postCompLst, setPostCompLst] = useState([]);

  const [file, setFile] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [postDetails, setPostDetails] = useState({
    username: "",
    title: "",
    content: "",
    tags: "",
  });
  const [errs, setErrs] = useState({
    userNameErr: false,
    titleErr: false,
    contentErr: false,
    userNameExists: false,
    unauthorized: false,
  });

  //ar file;
  const getPosts = async () => {
    const postsLstData = await fetch("https://my-worker-with-router.ganvekar.workers.dev/posts"); //posts
    const postsLst = await postsLstData.json();
    postsLst.map((post, index) => {
      post.originalPostId = index;
    });
    postsLst.forEach((post, index) => {
      postCompLst.push(
        <div>
          <Post key={index} post={post} postId={post.originalPostId}></Post>
        </div>
      );
    });

    setPosts([...postsLst]);
    setPostCompLst([...postCompLst]);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const submitPost = async (e) => {
    e.preventDefault();

    const endPoint1 = "https://my-worker-with-router.ganvekar.workers.dev/posts";
    const endPoint2 = "https://my-worker-with-router.ganvekar.workers.dev/media";

    try {
      //if media file is present, first send that, then get the unique "key" for that media from the response, then send the json
      //with the "key" info
      if (!file) {
        const body = JSON.stringify(postDetails);

        const res = await axios.post(
          endPoint1,
          body,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("headers");
        console.log(res.headers);

        setErrs({
          ...errs,
          userNameErr: false,
          titleErr: false,
          contentErr: false,
          userNameExists: false,
          unauthorized: false,
        });

        //Now upload any attached media

        getPosts();
        setShowForm(!showForm);
      } else {
        let mediaType = file[0]["type"].split("/")[0];
        const res = await axios.post(
          endPoint2 + "/" + postDetails.username,
          file[0],
          {
            withCredentials: true,
          }
        );
        const mediaKey = res.data.mediaKey;

        //setPostDetails({...postDetails, mediaKey: mediaKey, mediaType: mediaType});

        const body = JSON.stringify({
          ...postDetails,
          mediaKey: mediaKey,
          mediaType: mediaType,
        });

        const res2 = await axios.post(endPoint1, body, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("headers");
        console.log(res2.headers);
        setErrs({
          ...errs,
          userNameErr: false,
          titleErr: false,
          contentErr: false,
          userNameExists: false,
          unauthorized: false,
        });

        //Now upload any attached media

        getPosts();
        setShowForm(!showForm);
      }
    } catch (err) {
      const errors = err.response.data.errors;

      let errType = err.response.data.split(" ")[0];
      if (errType === "Username") {
        setErrs({
          ...errs,
          userNameErr: true,
          titleErr: false,
          contentErr: false,
          userNameExists: false,
          unauthorized: false,
        });
      } else if (errType === "Title") {
        setErrs({
          ...errs,
          titleErr: true,
          userNameErr: false,
          contentErr: false,
          userNameExists: false,
          unauthorized: false,
        });
      } else if (errType === "Content") {
        setErrs({
          ...errs,
          titleErr: false,
          userNameErr: false,
          contentErr: true,
          userNameExists: false,
          unauthorized: false,
        });
      } else if (errType == "Unauthorized") {
        setErrs({
          ...errs,
          titleErr: false,
          userNameErr: false,
          contentErr: false,
          userNameExists: false,
          unauthorized: true,
        });
      } else {
        setErrs({
          ...errs,
          userNameExists: true,
          titleErr: false,
          userNameErr: false,
          contentErr: false,
        });
      }
      //throw (new Error().errors = errors);
    }
  };

  const likesRadioChange = (e) => {
    let sorted = postCompLst.sort((p1, p2) => {
      //console.log(postCompLst[0]["props"]["children"]["props"]["post"]);
      let likes1 = p1.props.children.props.post.likes;
      let likes2 = p2.props.children.props.post.likes;
      if (likes1 === undefined) likes1 = 0;
      if (likes2 === undefined) likes2 = 0;

      if (likes1 == likes2) return 0;
      if (e.target.value === "desc") return likes1 > likes2 ? -1 : 1;
      else return likes1 > likes2 ? 1 : -1;
    });
    setPostCompLst([...sorted]);
  };
  const dislikesRadioChange = (e) => {
    let sorted = postCompLst.sort((p1, p2) => {
      let dislikes1 = p1.props.children.props.post.dislikes;
      let dislikes2 = p2.props.children.props.post.dislikes;
      if (dislikes1 === undefined) dislikes1 = 0;
      if (dislikes2 === undefined) dislikes2 = 0;

      if (dislikes1 == dislikes2) return 0;
      if (e.target.value === "desc") return dislikes1 > dislikes2 ? -1 : 1;
      else return dislikes1 > dislikes2 ? 1 : -1;
    });

    setPostCompLst([...sorted]);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "5px" }}>
        <button
          type=''
          className='btn btn-primary btn-sm'
          onClick={(e) => {
            setShowForm(!showForm);
          }}
          style={{
            marginBottom: "5px",
            width: "200px",
            backgroundColor: "rgb(59, 89, 80)",
            backgroundImage:
              "linear-gradient(rgb(78, 105, 162), rgb(59, 89, 152) 50%)",
          }}
        >
          <b>Create Post</b>
        </button>
        <div>
          <span>Sort by Likes</span>{" "}
          <input
            type='radio'
            name='likes'
            value='asc'
            onChange={likesRadioChange}
          ></input>{" "}
          <span>Asc</span>{" "}
          <input
            type='radio'
            name='likes'
            value='desc'
            onChange={likesRadioChange}
          ></input>{" "}
          <span>Desc</span> <br></br>
          <span>Sort by Dislikes</span>{" "}
          <input
            type='radio'
            name='dislikes'
            value='asc'
            onChange={dislikesRadioChange}
          ></input>{" "}
          <span>Asc</span>{" "}
          <input
            type='radio'
            name='dislikes'
            value='desc'
            onChange={dislikesRadioChange}
          ></input>{" "}
          <span>Desc</span>
        </div>
        {showForm ? (
          <div>
            <form
              class='form'
              onSubmit={(e) => submitPost(e)}
              name='postDetails'
              id='postDetails'
              method='post'
              type='submit'
              enctype='multipart/form-data'
            >
              <div class='form-group'>
                {errs.userNameErr == true ? (
                  <label style={{ color: "red" }}>Username is required!</label>
                ) : null}
                {errs.userNameExists == true ? (
                  <label style={{ color: "red" }}>
                    Username exists. Try a different username.
                  </label>
                ) : null}
                {errs.unauthorized == true ? (
                  <label style={{ color: "red" }}>Unauthorized Access!</label>
                ) : null}
                <div class='form-group input-group'>
                  <input
                    type='text'
                    class='input form-control'
                    placeholder='Enter Username'
                    name='schoolName'
                    id='schoolName'
                    onChange={(e) =>
                      setPostDetails({
                        ...postDetails,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div class='form-group'>
                {errs.titleErr == true ? (
                  <span style={{ color: "red" }}>Title is required!</span>
                ) : null}
                <div class='form-group input-group'>
                  <input
                    type='text'
                    class='input form-control'
                    placeholder='Enter Title'
                    name='schoolName'
                    id='schoolName'
                    onChange={(e) =>
                      setPostDetails({ ...postDetails, title: e.target.value })
                    }
                  />
                </div>
              </div>
              <div class='form-group'>
                {errs.contentErr == true ? (
                  <span style={{ color: "red" }}>Content is required!</span>
                ) : null}
                <div class='form-group input-group'>
                  <textarea
                    type='text'
                    class='input form-control'
                    placeholder='Enter Content'
                    name='schoolName'
                    id='schoolName'
                    style={{ height: "200px" }}
                    onChange={(e) =>
                      setPostDetails({
                        ...postDetails,
                        content: e.target.value,
                      })
                    }
                  />

                  <input
                    id='inputFile'
                    type='file'
                    name='file'
                    accept='image/*,audio/*,video/*'
                    style={{ display: "none" }}
                    onChange={(e) => {
                      let word;
                      let count = e.target.files.length;
                      console.log(count);
                      count > 1 ? (word = "files") : (word = "file");
                      document.getElementById("fileCount").innerHTML =
                        " " + count + " " + word;
                      setFile(e.target.files);
                      //console.log(files[0]);
                    }}
                  ></input>
                </div>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  multiple
                  style={{
                    backgroundColor: "rgb(59, 89, 80)",
                    backgroundImage:
                      "linear-gradient(rgb(78, 105, 162), rgb(59, 89, 152) 50%)",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("inputFile").click();
                  }}
                >
                  <i class='fa fa-paperclip'> </i> Upload Media
                </button>
                <label id='fileCount' style={{ marginLeft: "5px" }}></label>
              </div>
              <div class='form-group'>
                <div class='form-group input-group'>
                  <input
                    type='text'
                    class='input form-control'
                    placeholder='Enter Tags with spaces'
                    name='schoolName'
                    id='schoolName'
                    onChange={(e) => {
                      let lst = e.target.value.split(" ");
                      setPostDetails({ ...postDetails, tags: lst });
                    }}
                  />
                </div>
              </div>
            </form>
            <button
              type='submit'
              form='postDetails'
              className='btn btn-primary btn-sm'
              style={{
                marginBottom: "5px",

                backgroundColor: "rgb(59, 89, 80)",
                backgroundImage:
                  "linear-gradient(rgb(78, 105, 162), rgb(59, 89, 152) 50%)",
              }}
            >
              <b>Submit</b>
            </button>
          </div>
        ) : null}
      </div>

      <div>{postCompLst}</div>

      {/*posts.map((post, index) =>  {
        
         return (
          <div>
            <Post key={post.likes} post={post} postId={post.originalPostId} ></Post>
          </div>)
      })
    */}
    </div>
  );
};

export default Posts;
