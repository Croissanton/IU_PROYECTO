import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const PostCard = ({
  id,
  title,
  text,
  upvotes,
  downvotes,
  author,
  date,
  res_num,
  view_num,
  lm_author,
  lm_date,
  onPostClick,
}) => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario")) || undefined;
  const [postUpvotes, setPostUpvotes] = useState(upvotes);
  const [postDownvotes, setPostDownvotes] = useState(downvotes);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    if (usuario) {
      if (usuario.upPosts.includes(id)) {
        setUserVote("upvote");
      } else if (usuario.downPosts.includes(id)) {
        setUserVote("downvote");
      }
    }
  }, [id, usuario]);

  const updateLocalStorage = (newUpvotes, newDownvotes) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex !== -1) {
      posts[postIndex].upvotes = newUpvotes;
      posts[postIndex].downvotes = newDownvotes;
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  };

  const handleUpvote = (e) => {
    e.stopPropagation();
    let newUpvotes = postUpvotes;
    let newDownvotes = postDownvotes;

    if (userVote === "upvote") {
      newUpvotes -= 1;
      setUserVote(null);
      usuario.upPosts = usuario.upPosts.filter((postId) => postId !== id);
    } else if (userVote === "downvote") {
      newDownvotes -= 1;
      newUpvotes += 1;
      setUserVote("upvote");
      usuario.downPosts = usuario.downPosts.filter((postId) => postId !== id);
      usuario.upPosts.push(id);
    } else {
      newUpvotes += 1;
      setUserVote("upvote");
      usuario.upPosts.push(id);
    }

    setPostUpvotes(newUpvotes);
    setPostDownvotes(newDownvotes);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem(
      "usuarios",
      JSON.stringify(
        JSON.parse(localStorage.getItem("usuarios")).map((u) =>
          u.username === usuario.username ? usuario : u
        )
      )
    );
    updateLocalStorage(newUpvotes, newDownvotes);
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    let newUpvotes = postUpvotes;
    let newDownvotes = postDownvotes;

    if (userVote === "downvote") {
      newDownvotes -= 1;
      setUserVote(null);
      usuario.downPosts = usuario.downPosts.filter((postId) => postId !== id);
    } else if (userVote === "upvote") {
      newUpvotes -= 1;
      newDownvotes += 1;
      setUserVote("downvote");
      usuario.upPosts = usuario.upPosts.filter((postId) => postId !== id);
      usuario.downPosts.push(id);
    } else {
      newDownvotes += 1;
      setUserVote("downvote");
      usuario.downPosts.push(id);
    }

    setPostUpvotes(newUpvotes);
    setPostDownvotes(newDownvotes);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem(
      "usuarios",
      JSON.stringify(
        JSON.parse(localStorage.getItem("usuarios")).map((u) =>
          u.username === usuario.username ? usuario : u
        )
      )
    );
    updateLocalStorage(newUpvotes, newDownvotes);
  };

  const handleClick = () => {
    if (onPostClick) {
      onPostClick(id);
      navigate(`/post/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="custom-link mb-2 mx-0 mt-0 p-0"
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <Container className="border border-dark-subtle bg-light">
        <Row className="custom-link-container">
          <Col className="p-3">
            <Row>
              <span
                className="h4"
                style={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {title}
              </span>
            </Row>
            <Row>
              <p
                style={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {text}
              </p>
            </Row>
            <Row onClick={(e) => e.stopPropagation()}>
              <Col>
                <span> Creador: </span>
                <NavLink className="custom-text-link" to={`/profile/${author}`}>
                  <span>{author}</span>
                </NavLink>
              </Col>
            </Row>
            <Row>
              <p>Fecha de creación: {date}</p>
            </Row>
            <Row>
              <Col>
                <span> Votos positivos: {postUpvotes} </span>
                <Button
                  aria-label="Upvote"
                  className={`btn ${userVote === "upvote" ? "btn-success" : "btn-primary"}`}
                  onClick={handleUpvote}
                  style={{ margin: "5px" }}
                >
                  +
                </Button>
              </Col>
              <Col>
                <span> Votos negativos: {postDownvotes} </span>
                <Button
                  aria-label="Downvote"
                  className={`btn ${userVote === "downvote" ? "btn-danger" : "btn-primary"}`}
                  onClick={handleDownvote}
                  style={{ margin: "5px" }}
                >
                  -
                </Button>
              </Col>
            </Row>
          </Col>
          <Col className="p-3">
            <Row>
              <Col className="m-auto">
                <span className="h5">Respuestas</span>
                <p>{res_num}</p>
              </Col>
              <Col className="m-auto">
                <span className="h5">Número de visualizaciones</span>
                <p>{view_num}</p>
              </Col>
              <Col className="m-auto">
                <Row>
                  <p>Último mensaje por:</p>
                </Row>
                <Row>
                  <NavLink
                    className="custom-text-link"
                    to={`/profile/${lm_author}`
                  }>
                    <span>{lm_author}</span>
                  </NavLink>
                </Row>
                <Row>
                  <p>Fecha del último mensaje:</p>
                </Row>
                <Row>
                  <p>{lm_date}</p>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostCard;
