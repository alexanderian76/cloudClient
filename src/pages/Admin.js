import { set } from "mobx";
import React, { useContext, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { Context } from "../index";
import {createDir, getDirs, getFiles, loadFile, uploadFile} from "../http/userAPI"
import { observer } from "mobx-react-lite";

function AdminComp() {
  const {directory} = useContext(Context)

  const [files, setFiles] = useState('')
  const [filesDownloaded, setFilesDownloaded] = useState('')
  const [dir, setDir] = useState('')
  const [dirs, setDirs] = useState('')
  

  function UploadFiles(files, path) {
    console.log(path)
    uploadFile(files, path)
  }

  async function GetFiles() {
    let load = await getFiles(directory.Dir)
    setFilesDownloaded(load)
    console.log(load)
  }

  async function LoadFile(fileName) {
    let load = await loadFile(fileName)
    
    console.log(load)
  }
  async function CreateDir(dirName) {
    directory.setDir(dirName + '/')
    console.log(directory.Dir)
    let load = await createDir(dirName)
  }

  async function GetDirs(dirName) {
    
    
    let load = await getDirs(dirName)
    setDirs(load)
    console.log(load)
  }

  return (
    <Container className="d-flex flex-column">
      <div><header>{directory.Dir}</header><Button className="mt-2" variant='outline-success' onClick={() => {
        let tmpDir = directory.Dir.split('/')
        console.log(tmpDir)
        tmpDir.pop()
        tmpDir.pop()
        directory.setDir(tmpDir.join('/') + '/');
      }}>Back</Button></div>
        <Form className="mt-3" onSubmit={ e => {e.preventDefault(); UploadFiles(files, directory.Dir); setFiles(""); document.getElementById('input_id').value = ""}} >
            
            <Form.Control id="input_id" type="file" multiple="multiple" onChange={e => {
              let arr = []
              for(let i = 0; i < e.target.files.length; i++) {
                arr.push(e.target.files[i])
              }
              setFiles(arr)
            }} placeholder='Choose files'/>
            <Button className="mt-2" type="submit" variant='outline-success' >Upload</Button>
            </Form>
            <div>{filesDownloaded == '' ? '' : filesDownloaded.map((file) => <div key={file}><div id={file} style={{cursor: 'pointer', color: 'green'}} onClick={() => LoadFile(file)}>{file}</div><a id={file + '_id'}>Load</a></div>)}</div>
            <Button className="mt-2" variant='outline-success' onClick={GetFiles}>Download</Button>
            <input onChange={e => setDir(e.target.value)}/>
            <Button className="mt-2" variant='outline-success' onClick={() => CreateDir(directory.Dir + dir)}>Create Dir</Button>

            <div>{dirs == '' ? '' : dirs.map((d) => <div key={d.path}><div id={d.path} style={{cursor: 'pointer', color: 'red'}} onClick={() => {directory.setDir(d.path); setDir(d)}}>{d.name}</div><a id={d.path + '_id'}>Dir</a></div>)}</div>
            <Button className="mt-2" variant='outline-success' onClick={() => GetDirs(directory.Dir)}>Get Dirs</Button>
    </Container>
  );
}

const Admin = observer(AdminComp)

export default Admin;
