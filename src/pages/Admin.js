import { set } from "mobx";
import React, { useContext, useEffect, useState } from "react";
import { Container, Button, Form, Card, CardGroup, Row, Col } from "react-bootstrap";
import { Context } from "../index";
import {createDir, getDirs, getFiles, loadFile, removeDir, uploadFile} from "../http/userAPI"
import { observer } from "mobx-react-lite";
import { $authHost } from "../http";
import { wait } from "@testing-library/user-event/dist/utils";

function AdminComp() {
 // const {directory} = useContext(Context)

  const [files, setFiles] = useState('')
  const [filesDownloaded, setFilesDownloaded] = useState('')
  const [dir, setDir] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  

  const [directory, setDirectoryState] = useState('/uploads/')

  function setDirectory(dirName) {
    localStorage.setItem('directory', dirName)
    setDirectoryState(dirName)
    GetDirs(localStorage.getItem('directory'))
    GetFiles(localStorage.getItem('directory'))
    
  }
  

  const [dirs, setDirs] = useState('')
  

  async function UploadFiles(files, path) {
    setIsLoading(true)
    console.log(path)
   // const sleep = ms => new Promise(r => setTimeout(r, ms));
   // await sleep(3000)
    await uploadFile(files, path)
    
    setDirectory(directory)
    setIsLoading(false)
    console.log("LOADED")
  }

  async function GetFiles(dirName) {
    
    let load = await getFiles(dirName)
    
    if(load.toString() != filesDownloaded.toString()) {
      setFilesDownloaded(load)
    }
      

    console.log(filesDownloaded)
    console.log(load)

    
    
  }

  async function LoadFile(fileName) {
    let load = await loadFile(directory + fileName)
    
    console.log(load)
  }
  async function CreateDir(dirName) {
    //directory.setDir(dirName + '/')
    if(dirName == directory) return;
    console.log(directory)
    let load = await createDir(dirName)
    //setDirectory(dirName + '/')
    setDirectory(directory)
  }

  async function GetDirs(dirName) {
    
    
    let load = await getDirs(dirName)
    setDirs(load)
    console.log(load)
  }

  function RemoveDir(dirName) {
    removeDir(dirName).then(() => {
      console.log('123')
      setDirectory(directory)
     })
  }

  useEffect(() =>{
    //setDirectory(directory)
    for(let i = 0; i < filesDownloaded.length; i++) {
      loadFile(directory + filesDownloaded[i])
      console.log(directory + filesDownloaded[i])
    };
    
    if(localStorage.getItem('directory')){
        setDirectory(localStorage.getItem('directory'))
        
    }
    else {
      GetDirs(directory)
      GetFiles(directory)
      
    }
    
  }, [filesDownloaded])

  return (
    <>
    <div>{ isLoading ? 
        <div style={{width : window.innerWidth, height: window.innerHeight, position: "absolute", backgroundColor: 'gray', display: 'flex'}}><span className="loader"></span></div> : ""
      }</div>
    <Container className="" >
      
      <header>{directory}</header>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}><Button style={{marginTop: 10}} className="" variant='outline-success' onClick={() => {
        let tmpDir = directory.split('/')
        console.log(tmpDir)
        tmpDir.pop()
        tmpDir.pop()
       // directory.setDir(tmpDir.join('/') + '/');
       if(tmpDir.length > 1)
       setDirectory(tmpDir.join('/') + '/');
      }}>Back</Button>
             <a style={{display: 'flex', marginTop: 10}}> <input id="dir_input" style={{marginLeft: 10, marginRight: 10, marginTop: 5}} onChange={e => setDir(e.target.value)}/>
            <Button style={{marginLeft: 10}} className="" variant='outline-success' onClick={() => {
              console.log('dir')
              console.log(dir)
              if(dir != '' && dir != null)
                CreateDir(directory + dir)
              document.getElementById('dir_input').value = ''
              setDir('')
              }}>Create Dir</Button>
            </a>
            </div>
            
        <Form className="mt-3" onSubmit={ e => {e.preventDefault(); UploadFiles(files, directory); setFiles(""); document.getElementById('input_id').value = ""}} >
            
          <Form.Control style={{display: 'inline-block', width: '50%'}} id="input_id" type="file" multiple="multiple" onChange={e => {
              let arr = []
              for(let i = 0; i < e.target.files.length; i++) {
                arr.push(e.target.files[i])
              }
              setFiles(arr)
            }} placeholder='Choose files'/>
            <Button style={{marginLeft: 10, marginTop: -4}} className="" type="submit" variant='outline-success' >Upload</Button>
            
            </Form>
            <Row xs={1} md={3} className="mt-2">{filesDownloaded == '' ? '' : filesDownloaded.map((file) => 
            
            <Card key={file} className="mb-2"><div id={file} style={{cursor: '', color: 'green', backgroundColor: ''}} onClick={() => /*LoadFile(file)*/''}>{file}</div><a id={file + '_id'} style={{paddingLeft: 0}}>Load</a></Card>
            
            )}
            </Row>
          { /* <Button className="mt-2" variant='outline-success' onClick={GetFiles}>Download</Button>*/}
            

            <div>{dirs == '' ? '' : dirs.map((d) => <div key={d.path} style={{display: 'flex'}}><div id={d.path} style={{cursor: 'pointer', color: 'blueviolet'}} onClick={() => {setDirectory(d.path);}}>{d.name}</div>
            <a id={d.path + '_id'} style={{paddingLeft: 10, cursor: 'pointer', color: 'red'}} onClick={() => RemoveDir(d.path)}>Delete folder</a>
            </div>)}
            </div>
          { /* <Button className="mt-2" variant='outline-success' onClick={() => GetDirs(directory)}>Get Dirs</Button> */}
    

          
    </Container>
    </>
  );
}

const Admin = observer(AdminComp)

export default Admin;
