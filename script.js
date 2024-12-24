const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dcjdqtlvw/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "user-image";

const uploadForm = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const uploadButton = document.getElementById("upload-button");
const uploadProgress = document.getElementById("upload-progress");
const gallery = document.getElementById("gallery");

let images = JSON.parse(localStorage.getItem("gallery")) || [];

function displayImages() {
  gallery.innerHTML = "";
  images.forEach((imageUrl, index) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = `Gallery image ${index + 1}`;
    img.loading = "lazy";

    galleryItem.appendChild(img);
    gallery.appendChild(galleryItem);
  });
}

displayImages();

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    uploadButton.disabled = true;
    uploadProgress.style.display = "block";

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        images.unshift(data.secure_url);
        localStorage.setItem("gallery", JSON.stringify(images));
        displayImages();
        uploadForm.reset();
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      uploadButton.disabled = false;
      uploadProgress.style.display = "none";
      uploadProgress.querySelector(".progress").style.width = "0%";
    }
  } else {
    alert("Please select an image to upload.");
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    fileInput.nextElementSibling.textContent = fileName;
  } else {
    fileInput.nextElementSibling.textContent = "Choose an image";
  }
});
