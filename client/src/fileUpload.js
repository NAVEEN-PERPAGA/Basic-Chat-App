import React, {Component, useState} from 'react'
import axios from 'axios'

export default class FileUpload extends Component {

    constructor(props) {
        super(props)
        this.state = {
            imageBase64 : null,
            selectedFile: null
        }
    }

    // const [imageBase64, setBase64] = useState(null)
    // const [selectedFile, setSelectedFile] = useState(null)

    onFileChange = (e) => {
        this.getBase64(e.target.files[0], (result) => {
            this.setState({imageBase64: result})
            console.log(result)
        })
        console.log(e.target.files[0])
        this.setState({selectedFile: e.target.files[0]})
    }

    getBase64 = (file, cb) => {
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

    onFileUpload = (e) => {
        // e.preventDefault() 
        console.log(typeof this.state.selectedFile)  

        const data = {file: this.state.selectedFile}

        const formData = new FormData()
        formData.append('image', "Hello")

        // axios({
        //     method: 'post',
        //     url: 'http://localhost:5000/image',
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     data: formData
        // })
        axios.post('http://localhost:5000/image/', data)
            .then(() => alert('Image Posted Successfully '))
            .catch(err => console.log(err))

        // console.log(formData)
        for (var [key, value] of formData.entries()) { 
            console.log(key, value);
           }
    }

    render()  {
        
        return (
        <>
            <div>
                <input
                    type="file"
                    name="image"
                    onChange={this.onFileChange}
                />
                {/* <button onClick={this.onFileUpload}>
                    Upload
                </button> */}

                <form onSubmit={this.onFileUpload}>
                    <input type="submit" value="POST" className="btn btn-primary" />
                </form>
            </div>
        </>
    )
            }
}