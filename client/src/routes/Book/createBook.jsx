import React, { useState } from "react";
import NoImageSelected from "../../assets/lc.png";
import { useAuth0 } from "@auth0/auth0-react";

function CreateBook() {
  const { user, isAuthenticated } = useAuth0();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState(NoImageSelected);

  const createBook = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("stars", stars);
    formData.append("description", description);
    formData.append("category", categories);
    formData.append("thumbnail", thumbnail);
    formData.append("username", user.name); // Use user.name directly

    try {
      const response = await fetch("https://backend-codehelper-trial.onrender.com/api/books", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setSlug("");
        setStars(0); // Reset stars to default value
        setDescription("");
        setCategories([]);
        setThumbnail(null);
        setSubmitted(true);
      } else {
        console.log("Failed to submit data.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = (e) => {
    setCategories(e.target.value.split(",").map((category) => category.trim()));
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setThumbnail(e.target.files[0]);
    }
  };

  return (
    <div>
      {submitted ? (
        <p className="text-xl text-white">Data submitted successfully!</p>
      ) : (
        <form className="p-10 " onSubmit={createBook}>
          <h1 className="text-center text-3xl my-10 text-white font-bold">Create Book</h1>
          <div className="col-1 rounded-xl items-center justify-evenly text-center">
            <span className="text-white text-lg">Upload Thumbnail</span>
            <img src={image} alt="preview image" className="mx-auto w-96 items-center justify-center m-3 rounded-xl text-center " />
            <input
              onChange={onImageChange}
              type="file"
              accept="image/gif, image/jpeg, image/png"
            />
          </div>
          <div className="col-2 rounded-xl text-white p-2">
            <div>
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-md input input-bordered input-primary w-full"
              />
            </div>

            <div>
              <label>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="rounded-md input input-bordered input-primary w-full"
              />
            </div>

            <div>
              <label>Stars</label>
              <input
                type="text"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                className="rounded-md input input-bordered input-primary w-full"
              />
            </div>

            <label>Description</label>
            <div className="mockup-code">
              <textarea
                rows="4"
                cols="50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-md input input-bordered input-primary w-full max-h-96"
              />
            </div>

            <div>
              <label>Categories (comma-separated)</label>
              <input
                type="text"
                value={categories}
                onChange={handleCategoryChange}
                className="rounded-md input input-bordered input-primary w-full"
              />
            </div>

            <div>
              <label>Username</label>
              <input
                type="text"
                value={user.name}
                readOnly={true}
                className="rounded-md input input-bordered input-primary w-full"
              />
            </div>

            <button className="btn glass">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateBook;
