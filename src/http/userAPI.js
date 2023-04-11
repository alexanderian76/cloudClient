import { $authHost, $host } from "./index";
import jwt_decode from 'jwt-decode'
import { Buffer } from "buffer";


export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', {email, password, role: 'ADMIN'})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}


export const check = async () => {
    //console.log(process.env.REACT_APP_API_URL)
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}


export const uploadFile = async (files, path) => {

    let formData = new FormData()
    for(let i = 0; i < files.length; i++) {
        formData.append('filedata', files[i])
    }
    

    const config = {
        onUploadProgress: progressEvent => console.log(progressEvent.loaded)
    }
    const {data} = await $authHost.post('api/user/upload?path=' + path, formData, config)
    //localStorage.setItem('token', data.token)
    return data;
    //return jwt_decode(data.token)
}


export const getFiles = async (path) => {

    
    
    const {data} = await $authHost.get('api/user/get_files?path=' + path)
    //localStorage.setItem('token', data.token)
    return data;
    //return jwt_decode(data.token)
}

export const getDirs = async (dirName) => {

    

    const {data} = await $authHost.get('api/user/get_dirs?dirName=' + dirName)
    //localStorage.setItem('token', data.token)
    return data;
    //return jwt_decode(data.token)
}


export const loadFile = async (fileName) => {

    let file = fileName.split('/').pop()
    let a = document.getElementById(file + '_id')
    a.innerHTML = ''
    fetch(process.env.REACT_APP_API_URL + 'api/user/load_file' + '?fileName=' + fileName, {
        method : 'GET',
        headers : {
            'authorization': `Bearer ${localStorage.getItem('token')}`
        }
        
        }
    )
    .then(response => {
        console.log(response)
        return response.text()
    }) // Gets the response and returns it as a blob
    .then(blob => {
        console.log(blob)

        //window.open('http://localhost:5000/api/user/load?token=' + blob, '_blank')
        // Here's where you get access to the blob
        // And you can use it for whatever you want
        // Like calling ref().put(blob)

        // Here, I use it to make an image appear on the page
        let ext = fileName.split('.').pop()
        if(ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'bmp' || ext == 'gif') {
            
            a.setAttribute('style', 'text-align: center;')
            let myImage = new Image();
            myImage.src = process.env.REACT_APP_API_URL + 'api/user/load?token=' + blob;
            myImage.setAttribute('style', 'width: 70px; height: 70px; object-fit: cover; cursor: pointer;')
            myImage.setAttribute('download', fileName)
            a.appendChild(myImage)
           /* */
        }
        else if(ext == "mp3" || ext == "m4a") {
            a.setAttribute('style', 'text-align: center;')
            //let audio = new Audio(process.env.REACT_APP_API_URL + 'api/user/load?token=' + blob)
           // audio.src = process.env.REACT_APP_API_URL + 'api/user/load?token=' + blob;
          //  audio.setAttribute('style', 'width: 70px; height: 70px; object-fit: cover; cursor: pointer;')
            //a.appendChild(`<div style="color: red" onClick="${() => audio.play()}">Play</div>`)
           // a.appendChild(audio)
            a.innerHTML = `<audio
            controls
            src="${process.env.REACT_APP_API_URL + 'api/user/load?token=' + blob}">
            <a href="${process.env.REACT_APP_API_URL + 'api/user/load?token=' + blob}">
                Download audio
            </a>
        </audio>`
        return;
        }
        else{
            a.setAttribute('class', 'btn btn-success')

            //a.setAttribute('style', 'cursor: pointer; text-align: center; color: blueviolet; height: 100%;')
            a.innerHTML = `Загрузить файл`
        }
       // a.innerHTML = `Загрузить файл<div id="${file + "_blob"}">${blob}</div>`
       a.onclick = () => {
        window.open(process.env.REACT_APP_API_URL + 'api/user/load?token=' + blob, '_blank')
       }
       // a.setAttribute('href', 'http://localhost:5000/api/user/load?token=' + blob)
       // a.setAttribute('download', fileName)
        // document.getElementById(fileName + '_id').appendChild(myImage)
    });
    return;
    //return jwt_decode(data.token)
}



export const createDir = async (name) => {

    

    const {data} = await $authHost.post('api/user/create_dir', {name})
    //localStorage.setItem('token', data.token)
    return;
    //return jwt_decode(data.token)
}



export const removeDir = (dirName) => {

    let ds = new Promise(async function(resolve, reject) {
        let {data} = $authHost.post('api/user/remove', {dirName}).then(() => resolve('123'))
        
    })
    
    //const {data} = await $authHost.post('api/user/remove', {dirName})
    
    
    //localStorage.setItem('token', data.token)
    return  ds;
    //return jwt_decode(data.token)
}