import React, { useState} from 'react'
import axios from 'axios'

export const FileUploadFunction = () => {

    const [imageBase64, setBase64] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [imageurl, setImageUrl] = useState(null)

    const onFileChange = (e) => {
        getBase64(e.target.files[0], (result) => {
            setBase64(result)
        })
        setSelectedFile(e.target.files[0])
        console.log(e.target.files[0])
        const url = URL.createObjectURL(e.target.files[0])
        setImageUrl(url)
    }

    const getBase64 = (file, cb) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        // reader.readAsArrayBuffer(file)
        reader.onload = function() {
            cb(reader.result)
        }
        reader.onerror = function(error) {
            console.log('Error: ', error)
        }
      }

    const onFileUpload = (e) => {
        // e.preventDefault() 
        // const data = {file: imageBase64}

        console.log(selectedFile)  

        const formData = new FormData()
        formData.append('image', imageurl)

        // axios({
        //     method: 'post',
        //     url: 'http://localhost:5000/image',
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     data: formData
        // })
        axios.post('http://localhost:5000/image/', formData)
            .then(() => alert('Image Posted Successfully '))
            .catch(err => console.log(err))

        // console.log(formData)
        // for (var [key, value] of formData.entries()) { 
        //     console.log(key, value);
        //    }
    }
        
        return (
        <>
            <div>
            {imageurl}
                <input
                    type="file"
                    name="image"
                    onChange={onFileChange}
                />
                {/* <button onClick={onFileUpload}>
                    Upload
                </button> */}

                <form onSubmit={onFileUpload} encType="multipart/form-data">
                    <input type="submit" value="POST" className="btn btn-primary" />
                </form>
                <img src={imageurl} style={{height: "200px", width: "200px"}}/>
            </div>
        </>
    )
}