import React, {useState, useEffect} from 'react'
import './Create.css'

import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function Create(props) {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage]= useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if(imageUrl){
            postData();
        }

    },[imageUrl] )

    let onUploadHandler = () => {
        console.log(title, body, image)
        if(!title || !body || !image){

            return setError("All fields are mandotry")
        }

        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset","clickza");
        data.append("cloud_name", "reyhul")
        
        fetch('	https://api.cloudinary.com/v1_1/reyhul/image/upload', {
            method: "post",
            body: data
    })
        .then( res => res.json())
        .then(data => {
            setImageUrl(data.url);
            
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const postData = () => {
        console.log("Here",title,body,imageUrl)
        fetch('/createpost', {
            method: "post",
            headers:{
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:imageUrl
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.error) {
                setError({error: data.error})
            }
            else {
                props.history.push('/');
            }
        
        })
        .catch(err => console.log(err.message))

    }
    
    return (
        <div>
            <div className="create__card">
                <h2>Post</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={(event)=> setTitle(event.target.value)}
                />

                <input
                    type="text"
                    name="desc"
                    placeholder="Description"
                    onChange={(event)=> setBody(event.target.value)}
                />
                <div className="upload__button">
                    <label htmlFor="uploadImg" className="upload__label ">Upload Image</label>
                    <input
                        id="uploadImg"
                        type="file"
                        name="file"
                        onChange= {(event) => setImage(event.target.files[0])}
                    />
                    <AddPhotoAlternateIcon className="addImage"/>
                </div>

                <button 
                    type="submit" 
                    className="uploadButton"
                    onClick={onUploadHandler}
                    >
                    Submit Post <CloudUploadIcon className="uploadIcon" />
                </button>




            </div>
        </div>
    )
}

export default Create
