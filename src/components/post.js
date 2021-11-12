import React, { useEffect, useState, useRef } from "react";
import { Link } from "@reach/router";
import axios from "axios";

const Post = (props) => {
  const [post, setPost] = useState({});
  const [isMediaThere, setIsMediaThere] = useState(false);
  const [mediaType, setMediaType] = useState(null);
  const [mediaObj, setMediaObj] = useState(null);
  const [localLikes, setLocalLikes] = useState(0);
  const [localDislikes, setLocalDislikes] = useState(0);
  const [commentErr, setCommentErr] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [currComments, setCurrComments] = useState([]);

  const comment = useRef(null);

  const typedArrayToURL = (typedArray, mimeType) => {
    return URL.createObjectURL(
      new Blob([typedArray.buffer], { type: mimeType })
    );
  };

  const submitComment = async (e) => {
    e.preventDefault();

    if (comment.current.value !== "") {
      let comm = comment.current.value;
      currComments.push(comm);
      setCurrComments(currComments);
      const endPoint = "https://my-worker-with-router.ganvekar.workers.dev/submitComment/" + props.postId;
      const body = JSON.stringify(comm);

      const res = await axios.put(endPoint, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCommentErr(false);
      setShowCommentBox(false);
    } else {
      setCommentErr(true);
    }
    /*
    e.preventDefault
    const endPoint1 = "http://127.0.0.1:8787/post";
    const endPoint2 = "http://127.0.0.1:8787/media";

    try {
      //if media file is present, first send that, then get the unique "key" for that media from the response, then send the json
      //with the "key" info
      if (!file) {
        const body = JSON.stringify(postDetails);

        const res = await axios.post(endPoint1, body, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setErrs({
          ...errs,
          userNameErr: false,
          titleErr: false,
          contentErr: false,
        });

        //Now upload any attached media

        getPosts();
        setShowForm(!showForm);
      } else {
        let mediaType = file[0]["type"].split("/")[0];
        const res = await axios.post(endPoint2, file[0]);
        const mediaKey = res.data.mediaKey;

        //setPostDetails({...postDetails, mediaKey: mediaKey, mediaType: mediaType});

        const body = JSON.stringify({
          ...postDetails,
          mediaKey: mediaKey,
          mediaType: mediaType,
        });

        const res2 = await axios.post(endPoint1, body, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setErrs({
          ...errs,
          userNameErr: false,
          titleErr: false,
          contentErr: false,
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
        });
      } else if (errType === "Title") {
        setErrs({
          ...errs,
          titleErr: true,
          userNameErr: false,
          contentErr: false,
        });
      } else {
        setErrs({
          ...errs,
          contentErr: true,
          titleErr: false,
          userNameErr: false,
        });
      }
      //throw (new Error().errors = errors);
    }
    */
  };

  function upChangeToBlack(e) {
    //e.target.style.background = 'black';
    e.target.innerHTML = "&#xf164;";
  }

  function upChangeToWhite(e) {
    //e.target.style.background = 'black';
    e.target.innerHTML = "&#xf087;";
  }

  function downChangeToBlack(e) {
    //e.target.style.background = 'black';
    e.target.innerHTML = "&#xf165;";
  }

  function downChangeToWhite(e) {
    //e.target.style.background = 'black';
    e.target.innerHTML = "&#xf088;";
  }

  const getMedia = async (props) => {
    let mediaKey = props.post.mediaKey;

    const res = await axios.get("https://my-worker-with-router.ganvekar.workers.dev/getMedia/" + mediaKey, {
      responseType: "arraybuffer",
    });

    //console.log(res.data);
    let objectURL = URL.createObjectURL(
      new Blob([res.data], { type: props.post.mediaType + "/*" })
    );
    //console.log((Buffer.from(res.data,"binary")).buffer);
    setIsMediaThere(true);
    setMediaType(props.post.mediaType);
    /*
    var imageBase64Str = Buffer.from(
      res.data,
      "binary"
    ).toString("base64");*/
    //setMediaObj(imageBase64Str);
    setMediaObj(objectURL);
  };

  useEffect(() => {
    console.log(props.post.comments);
    if (props.post.mediaType) {
      getMedia(props);
    }

    setPost(props.post);
  }, []);

  if (!Object.keys(post).length) return <div />;

  return (
    <div
      style={{
        backgroundColor: "white",
        margin: "10px",
        borderRadius: "10px",
        border: "2px solid #e5e6e9",
        padding: "5px",
      }}
    >
      <h3>
        <b>{post.title}</b>
      </h3>
      <p>
        <b>
          <i>{post.username}</i>
        </b>
      </p>
      <p>
        <em>Published {new Date(post.date).toLocaleString("en-US")}</em>
        {post.tags !== undefined && post.tags !== ""
          ? post.tags.map((tag) => (
              <span>
                <a href='' style={{ fontSize: "14px" }}>
                  {" "}
                  {"  "} {"#" + tag}
                </a>
              </span>
            ))
          : null}
      </p>
      <p>{post.content}</p>
      {isMediaThere ? (
        mediaType === "image" ? (
          <a href={mediaObj}>
          <img
            width='100%'
            height='100%'
            object-fit='contain'
            src={/*"data:image/jpeg;base64, " +*/ mediaObj}
          />
          </a>
        ) : mediaType === "video" ? (
          <video width='100%' height='100%' object-fit='contain' controls>
            <source src={mediaObj}></source>
          </video>
        ) : (
          <audio width='100%' height='100%' object-fit='contain' controls>
            <source src={mediaObj}></source>
          </audio>
        )
      ) : null}
      <p>
        <a
          href='#'
          onClick={async (e) => {
            e.preventDefault();
            if (localLikes != 1) {
              setLocalLikes(localLikes + 1);
              //console.log(props.postId);

              if (localDislikes > 0) {
                setLocalDislikes(localDislikes - 1);
                const res = await axios.put(
                  "https://my-worker-with-router.ganvekar.workers.dev/dislikesDecrement/" + props.postId
                );
              }
              const res = await axios.put(
                "https://my-worker-with-router.ganvekar.workers.dev/likesIncrement/" + props.postId
              );
            }
          }}
          style={{ color: "black" }}
        >
          <i
            style={{ fontSize: "24px" }}
            onMouseOver={upChangeToBlack}
            onMouseOut={upChangeToWhite}
            className='fa'
          >
            &#xf087;
          </i>
        </a>
        <span>
          {post.hasOwnProperty("likes")
            ? post.likes + localLikes
            : 0 + localLikes}
        </span>{" "}
        <a
          href='#'
          onClick={async (e) => {
            e.preventDefault();
            if (localDislikes != 1) {
              setLocalDislikes(localDislikes + 1);

              if (localLikes > 0) {
                setLocalLikes(localLikes - 1);
                const res = await axios.put(
                  "https://my-worker-with-router.ganvekar.workers.dev/likesDecrement/" + props.postId
                );
              }
              const res = await axios.put(
                "https://my-worker-with-router.ganvekar.workers.dev/dislikesIncrement/" + props.postId
              );
            }
            console.log(localDislikes);
          }}
          style={{ color: "black" }}
        >
          <i
            style={{ fontSize: "24px" }}
            onMouseOver={downChangeToBlack}
            onMouseOut={downChangeToWhite}
            className='fa'
          >
            &#xf088;
          </i>
        </a>
        <span>
          {post.hasOwnProperty("dislikes")
            ? post.dislikes + localDislikes
            : 0 + localDislikes}
        </span>
      </p>
      <div>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setShowCommentBox(!showCommentBox);
          }}
          style={{
            fontSize: "14px",
            color: "#007bff",
            textDecoration: "underline",
          }}
        >
          Add Comment
        </a>{" "}
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setShowAllComments(!showAllComments);
          }}
          style={{
            fontSize: "14px",
            color: "#007bff",
            textDecoration: "underline",
          }}
        >
          View Comments
        </a>
      </div>
      {showCommentBox ? (
        <div>
          <form
            class='form'
            onSubmit={(e) => submitComment(e)}
            name='postDetails'
            id='postDetails'
            method='post'
            type='submit'
            enctype='multipart/form-data'
          >
            <div class='form-group'>
              {commentErr ? (
                <span style={{ color: "red" }}>Enter a comment!</span>
              ) : null}

              <div class='form-group input-group'>
                <textarea
                  type='text'
                  class='input form-control'
                  placeholder='Enter a comment'
                  name='comment'
                  ref={comment}
                  form='postDetails'
                  style={{ height: "200px" }}
                />
              </div>
              <button
                type='submit'
                form='postDetails'
                className='btn btn-primary btn-sm'
                multiple
                style={{
                  backgroundColor: "rgb(59, 89, 80)",
                  backgroundImage:
                    "linear-gradient(rgb(78, 105, 162), rgb(59, 89, 152) 50%)",
                }}
              >
                <i> </i> Submit
              </button>
            </div>
          </form>
        </div>
      ) : null}
      {showAllComments ? (
        <div>
          {" "}
          {post.comments === undefined
            ? null
            : post.comments.map((comm) => {
                return (
                  <p style={{ fontSize: "14px" }}>
                    {typeof comm === "string" ? comm : ""}
                  </p>
                );
              })}
          {currComments.map((comm) => {
            return (
              <p style={{ fontSize: "14px" }}>
                {typeof comm === "string" ? comm : ""}
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Post;
