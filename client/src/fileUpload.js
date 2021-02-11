import React, {useState} from 'react'
import axios from 'axios'

export const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null)

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    // console.log(selectedFile)

    const onFileUpload = (e) => {
        const formData = new FormData()

        formData.append(
            'image',
            selectedFile
        )

        axios.post('http://localhost:5000/image', formData)
            .then(res => alert('Image Posted Successfully '))
            .catch(err => console.log(err))

        // console.log(formData)
    }

    return (
        <>
            <div>
                <input
                    type="file"
                    onChange={onFileChange}
                />
                <button onClick={onFileUpload}>
                    Upload
                </button>
            </div>
        </>
    )
}