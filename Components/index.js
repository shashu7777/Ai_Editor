const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const uploadImagePlaceholder = document.getElementById("uploadImagePlaceholder");
const imageInfo = document.getElementById("imageInfo");
const downloadBtn = document.getElementById('downloadBtn');
const radioBtn = document.querySelectorAll('input[name="dimention"]');
const inputContainer = document.getElementById("inputContainer");
const loader = document.getElementById('loader');
const dashedContainer = document.querySelector('.uploadImage-dashedContainer');
const imageMode = document.getElementById('imageMode');


//cross button is created
const crossButton = document.createElement("button");
crossButton.id = "clearImage";
crossButton.className = "clearImageBtn";
crossButton.onclick = clearImage;
const crossIcon = document.createElement("i");
crossIcon.className = "bi bi-x-circle-fill";
crossButton.appendChild(crossIcon);


const arrowdwnldButton = document.createElement("button");
arrowdwnldButton.className = "arrowdwnldButton";
arrowdwnldButton.onclick = downloadImages;
const dwnldIcon = document.createElement("i");
dwnldIcon.className = "bi bi-download";
arrowdwnldButton.appendChild(dwnldIcon);



//varibales 
let image_file = "";
let dimention = "socila media";
let dimentionValue = [];
let type = "";
let result = null;
let imagemode="potrait";


//Uploading the file code
uploadBtn.addEventListener('click', () => {
    imageInput.click();
})

imageInput.addEventListener('change', (event) => {
    image_file = event.target.files[0];
    if (image_file) {
       
        downloadBtn.disabled = true;
        uploadImagePlaceholder.style.display = 'none';
        imageInfo.style.display = 'flex';
        const imageNameSpan = document.createElement('span');
        imageNameSpan.id = "imageName";
        imageNameSpan.textContent = image_file.name;
        imageInfo.appendChild(imageNameSpan);
        imageInfo.appendChild(crossButton);

        const reader = new FileReader();
        reader.readAsDataURL(image_file); // Convert to base64
        reader.onloadend = () => {
            base64Image = reader.result; // The base64 string is stored here
            
        };

    }
    else {
        console.log("error uploading the image");
    }
})

imageMode.addEventListener("change", function () {
    imagemode = imageMode.value;
   
});

// clearing the image code
function clearImage() {
    imageInput.value = "";
    imageInfo.textContent = "";
    imageInfo.style.display = 'none';
    uploadImagePlaceholder.style.display = 'block';
    image_file = "";
    base64Image = "";
    downloadBtn.disabled = true;
}

//radio button code
radioBtn.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        const val = event.target.value;
        dimention = val;

        if (dimention === "others") {
            inputContainer.style.display = 'flex';
            imageMode.style.display = "none";
            
        }
        else {
            
            document.getElementById("height").value = '0';
            document.getElementById("width").value = '0';
            imageMode.style.display="block";
            inputContainer.style.display = 'none';
        }
    });
});

//Resize button code
async function resizeImage() {
    if (!image_file) {
        alert("Please upload an image first!"); 
        return;
    }
    
    if (dimention === "others") {
   
        dimentionValue = [];
        let height = document.getElementById("height").value;
        let width = document.getElementById("width").value;
        if (height==="0" || width==="0")
        {
            alert("Please enter the pixels properly");
            return;
        }
        dimentionValue.push([width, height]);
    }
    else {
        dimentionValue = [];
        if(imagemode==="potrait")
        {
         
            dimentionValue.push([1080, 1350], [628, 1200], [1080, 1350],[627,1200]);

        }
        else if (imagemode === "landscape") {
            dimentionValue.push([1080, 560], [1200, 628], [1600,900],[1200,627]);

        }
        else{
            
            dimentionValue.push([1080, 1080], [1200, 1200], [1080, 1080],[1080,1080]);
        }

    }

    console.log(dimentionValue);
    // Send Base64 image to the backend
    try {
        imageInfo.textContent = "";
        loader.style.display = 'block';
        const response = await fetch('http://127.0.0.1:5000/resize-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_base64: base64Image,
                dimentionVal: dimentionValue,
            })
        });

        result = await response.json();
        console.log(result);

        if (response.ok) {
            downloadBtn.disabled = false;
            loader.style.display = 'none';

            for (let i in result) {
                    const resizedBase64ImageUrl = result[i];
                    const imageDiv = document.createElement('div');

                    // Create an image element
                    const imageElement = document.createElement('img');
                    imageElement.src = resizedBase64ImageUrl;
                    imageElement.alt = "Resized Image";

                    const fileName=document.createElement('p');
                    fileName.className="imageNamePara";
                    fileName.textContent=`${i}.png`;
                    fileName.style.textAlign = "center";

                    // Set the width and height to match the dimensions of the resized image
                    imageElement.style.width = "220px";
                    imageElement.style.height = "220px";

                    // Append the image to the container
                    imageDiv.appendChild(imageElement);
                    imageDiv.appendChild(fileName);
                    imageInfo.appendChild(imageDiv);


                    imageElement.addEventListener('click', function () {
                    const modalImage = document.getElementById('modalImage');
                    const imageModalLabel = document.getElementById("imageModalLabel");
                    imageModalLabel.textContent = `${i}.png`;
                    modalImage.src = resizedBase64ImageUrl; // Set the image inside the modal
                    const imageModal = new bootstrap.Modal(document.getElementById('imageModal')); // Initialize the modal
                    imageModal.show(); // Show the modal
                });
                
            }

            imageInfo.appendChild(arrowdwnldButton);
            imageInfo.style.gap = '10px'; 
           

        } else {
            alert(result.error);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

//code for download
function downloadImages() {
    for (let [key, base64Image] of Object.entries(result)) {
            const fileName = key;
            // Create a temporary link element for each image
            const a = document.createElement('a');
            a.href = base64Image; 
            a.download = fileName; 
            a.style.display = 'none';
            document.body.appendChild(a); 
            a.click();
            document.body.removeChild(a); 
    }
}
