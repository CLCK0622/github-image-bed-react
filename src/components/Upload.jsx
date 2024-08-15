import React, { useState } from "react";
import axios from "axios";

const Upload = ({ token }) => {
  const [repo, setRepo] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRepoChange = (event) => {
    setRepo(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const fileContent = await file.text();
    const content = btoa(fileContent);

    try {
      const response = await axios.put(
        `https://api.github.com/repos/${repo}/contents/${file.name}`,
        {
          message: `Add ${file.name}`,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      setResult(
        `Image uploaded successfully! View Image: ${response.data.content.html_url}`
      );
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
      setResult(`Upload failed! Error messages are printed in console.`);
    }
  };

  return (
    <div>
      <h1>Upload Image to GitHub</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="repo">GitHub Repository (e.g., username/repo):</label>
        <input
          type="text"
          id="repo"
          value={repo}
          onChange={handleRepoChange}
          required
        />
        <label htmlFor="image">Choose an image:</label>
        <input
          type="file"
          id="image"
          onChange={handleFileChange}
          accept="image/*"
          required
        />
        <button type="submit">Upload</button>
      </form>
      <div>{result}</div>
    </div>
  );
};

export default Upload;
