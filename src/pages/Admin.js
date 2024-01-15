import { set } from "mobx";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Container, Button, Form, Card, CardGroup, Row, Col, Alert, Table } from "react-bootstrap";
import { Context } from "../index";
import {createDir, getDirs, getFiles, loadFile, removeDir, uploadFile} from "../http/userAPI"
import { observer } from "mobx-react-lite";
import { $authHost } from "../http";
import { wait } from "@testing-library/user-event/dist/utils";
import { getFileExtension } from "../utils/utils";

function AdminComp() {
 // const {directory} = useContext(Context)
  const {user} = useContext(Context)
  const [files, setFiles] = useState('')
  const [filesDownloaded, setFilesDownloaded] = useState('')
  const [dir, setDir] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const formRef = useRef()

  const [directory, setDirectoryState] = useState('/' + user.User.email + '/')

  async function setDirectory(dirName) {
    localStorage.setItem('directory', dirName)
    setDirectoryState(dirName)
    await GetDirs(localStorage.getItem('directory'))
    await GetFiles(localStorage.getItem('directory'))
  }
  

  const [dirs, setDirs] = useState('')
  

  async function UploadFiles(files, path) {
    if(files != null && files.length > 0) {
      setIsLoading(true)
      console.log(path)
      // const sleep = ms => new Promise(r => setTimeout(r, ms));
      // await sleep(3000)
      await uploadFile(files, path)

      setDirectory(directory)
      setIsLoading(false)
      console.log("LOADED")
    }
    else {
      alert("Please choose files to load")
    }
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
    //setDirectory(directory)
	GetDirs(directory)
  }

  async function GetDirs(dirName) {
    
    
    let load = await getDirs(dirName)
    setDirs(load)
    console.log(load)
  }

  function RemoveDir(dirName) {
    removeDir(dirName).then(() => {
      console.log('123')
      //setDirectory(directory)
	  GetDirs(directory)
     })
  }

  useEffect(() =>{
    //setDirectory(directory)
    console.log(user)
    for(let i = 0; i < filesDownloaded.length; i++) {
      loadFile(directory + filesDownloaded[i])
      console.log(directory + filesDownloaded[i])
    };
    
    if(isFirstLoad) {
      setDirectory(directory)
		/*if(localStorage.getItem('directory')){
			setDirectory(localStorage.getItem('directory'))
		}
		else {
		GetDirs(directory)
		GetFiles(directory)
		}*/
    
		setIsFirstLoad(false)
	}

  }, [filesDownloaded])

  return (
    <>
    <div>{ isLoading ? 
        <div style={{width : window.innerWidth, height: window.innerHeight, position: "absolute", backgroundColor: 'gray', display: 'flex'}}><span className="loader"></span></div> : ""
      }</div>
    <Container className="" style={{border: 'solid', borderWidth: 0.1, borderRadius: 5, borderColor: 'gray', marginTop: 5, backgroundColor: '#2e2e2e', color: 'white'}}>
      <div style={{border: 'solid', padding: 10, borderRadius: 10, borderWidth: 2, borderColor: 'darkgreen', marginTop: 10, backgroundColor: '#1a1a1a'}}>
      <div style={{display: 'inline', paddingBottom: 0, overflow: 'hidden'}}>
      <Button size="sm" style={{marginBottom: 25, display: 'inline'}} className="" variant='outline-success' onClick={() => {
        let tmpDir = directory.split('/')
        console.log(tmpDir)
        tmpDir.pop()
        tmpDir.pop()
       // directory.setDir(tmpDir.join('/') + '/');
       if(tmpDir.length > 1)
       setDirectory(tmpDir.join('/') + '/');
      }}>Назад</Button>
      <div id="label" className="no-scroll" style={{ display:'inline-block', overflowX: 'scroll', boxSizing: 'content-box',  overflowY: 'hidden', whiteSpace: 'nowrap', width: window.innerWidth / 3, fontSize: 13, border: 'solid', marginLeft: 5, marginBottom: 1, borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "green", opacity: 0.8 }}>Текущее местоположение: {directory}</div>
      
      <Button id="log_out" style={{marginTop: 0, float: 'right'}} size="sm" className="" variant='outline-success' onClick={() => {
        localStorage.setItem('token', null)
        user.setUser(null)
      user.setIsAuth(false)
      }}>Выход</Button>
      </div>
      <br/>
      <div style={{display: 'inline'}}>
             <a style={{ marginTop: 0 }}> <input id="dir_input" placeholder="Введите название папки" style={{padding: 3, borderRadius: 7, borderWidth: 0, marginLeft: 0, marginRight: 10, marginTop: 5, width: window.innerWidth / 2.5}} onChange={e => setDir(e.target.value)}/>
            <Button size="sm" style={{marginTop: -3}} className="" variant='outline-success' onClick={() => {
              console.log('dir')
              console.log(dir)
              if(dir != '' && dir != null)
                CreateDir(directory + dir)
              document.getElementById('dir_input').value = ''
              setDir('')
              }}>Создать папку</Button>


            </a>
            
            
      
            </div>
            
        <Form  className="mt-3" onSubmit={ e => {e.preventDefault(); UploadFiles(files, directory); setFiles(""); document.getElementById('input_id').value = ""}} >
            
          <Form.Control ref={formRef} size="sm" style={{display: 'inline-block', width: '50%'}} id="input_id" type="file" multiple="multiple" onChange={e => {
              let arr = []
              for(let i = 0; i < e.target.files.length; i++) {
                arr.push(e.target.files[i])
              }
              setFiles(arr)
            }} placeholder='Choose files'/>
            <Button size="sm" style={{marginLeft: 10, marginBottom: 2, height: 30}} className="" type="submit" variant='outline-success' >Загрузить</Button>
            <Button size="sm" style={{marginLeft: 10, marginBottom: 2, height: 30}} className="" onClick={ () => {formRef.current.value=[]; setFiles(""); console.log(formRef.current);}} variant='outline-success' >Очистить</Button>
            </Form>
            </div> 
            <Row xs={1} md={3} className="mt-2">{filesDownloaded == '' ? '' : filesDownloaded.map((file) => 
            
            	<Card key={file} className="m-2" style={{maxWidth: (window.innerWidth > 285 ? 285 : window.innerWidth), height: 100, maxHeight: 100, backgroundColor: '#5af1', border: 'solid', borderColor: 'green', borderWidth: 1}}>
					<div id={file} 
						style={{cursor: '', color: 'green', backgroundColor: '', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: 50}} 
						onClick={() => /*LoadFile(file)*/''}>
							{file}
					</div>
					<a id={file + '_id'} style={{paddingLeft: 0}}>
						Загрузить
					</a> 
				</Card>
            
            )}
            </Row>
          { /* <Button className="mt-2" variant='outline-success' onClick={GetFiles}>Download</Button>*/}
            

            <table style={{width: 280}}><tbody><tr><th>Папка</th><th style={{textAlign: 'center'}}>Действие</th></tr>{dirs == '' ? '' : dirs.map((d) => <tr key={d}>
				<td id={directory + d + "/"} 
					style={{color: 'blueviolet', padding: 5, paddingLeft: 0, opacity: 0.8}}>
						<div 
							style={{width: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: "nowrap", color: 'white', backgroundColor: '#3b4cff'}}
							className="btn "
							//style={{cursor: 'pointer', color: 'blueviolet', backgroundColor: 'lightgrey', padding: 5, borderRadius: 5}}
							onClick={() => {setDirectory(directory + d + "/");}}
						>
							{d}
						</div>
				</td>
				<td id={d + '_id'}
					style={{ textAlign: 'right', alignItems: 'center', padding: 5, paddingLeft: 0}} 
				>
							<div 
              					className="btn btn-danger"
								style={{display : (filesDownloaded != "" ? (filesDownloaded.filter(file => getFileExtension(file) == d).length > 0 ? "none" : '') : ""), width: 100, textOverflow: 'ellipsis', whiteSpace: "nowrap", overflow: 'hidden', maxWidth: window.innerWidth / 4}}
								//style={{ cursor: 'pointer', color: 'red', backgroundColor: "pink", textAlign: 'center', borderRadius: 5, padding: 5}} 
								onClick={() => {
									let result = window.confirm('Delete folder?')
									if(result)
										RemoveDir(directory + d + "/")
								}}
							>
								Удалить
							</div>
				</td>
            </tr>)}
			</tbody>
            </table>
          { /* <Button className="mt-2" variant='outline-success' onClick={() => GetDirs(directory)}>Get Dirs</Button> */}
    

          
    </Container>
    </>
  );
}

const Admin = observer(AdminComp)

export default Admin;
