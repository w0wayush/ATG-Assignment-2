import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { REACT_APP_BASE_URL } from "../config";
import { useRecoilValue } from "recoil";
import { userId } from "../store/selectors/user";

const CreatePost = ({ show, handleClose }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const currentUserId = useRecoilValue(userId);
  const [error, setError] = useState("");

  const handleCreatePost = async () => {
    try {
      const postData = {
        title,
        description,
        imageLink,
        isPublic,
      };

      const response = await axios.post(
        `${REACT_APP_BASE_URL}/api/posts/create/${currentUserId}`,
        postData
      );

      console.log("Post created:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again."); // Handle error state or display error message to user
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-black text-white"
      >
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-pattern p-4">
        <form>
          <div className="form-check flex items-center justify-center mr-10">
            <div className="flex checkbox-wrapper-8">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                id="public"
                className="tgl tgl-skewed"
              />
              <label
                htmlFor="public"
                data-tg-on="Public Post"
                data-tg-off="Private Post"
                className="tgl-btn"
              ></label>
            </div>
          </div>
          <div className="mb-3 mt-6">
            <input
              placeholder="Title of Post"
              className="input form-control"
              type="text"
              id="postTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            {/* <label htmlFor="postDescription" className="form-label">
              Description
            </label> */}
            <textarea
              placeholder="Description of Post"
              className="input form-control"
              type="text"
              id="postDescription"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            {/* <label htmlFor="postImageLink" className="form-label">
              Image Link
            </label> */}
            <input
              placeholder="Image Link"
              className="input form-control "
              type="text"
              id="postImageLink"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            />
          </div>
        </form>
        {error && <p className="text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer className="bg-black flex justify-center">
        <button className="create-post" onClick={handleCreatePost}>
          {" "}
          I'M READY
        </button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePost;
