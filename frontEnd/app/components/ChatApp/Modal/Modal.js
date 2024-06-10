
import { useState, useContext } from 'react';
import { UserContext } from '@/app/dashboard/chatapp/home/page';
import Button from 'react-bootstrap/Button';
import Moddal from 'react-bootstrap/Modal';
import axios from 'axios';

function Modal(props) {
  const context = useContext(UserContext)
  const [passwordResponse, setPasswordResposne] = useState(null)
  const [changePassword, setChangePassword] = useState(false)
  const [fullname, setFullName] = useState(context?.user?.fullname);
  const [update, setUpdate] = useState('')
    const submitHandler = async (e) => {
      e.preventDefault()
      const form = document.getElementById('profileImage');
      const response = await props.updateProfile(form)
        setUpdate(response)
        setTimeout(() => {
          setUpdate('')
          props.onHide()
        }, 1000)
      
    }
    const passwordChange = (e) => {
      setChangePassword(true)
    }
    const onSubmitPasswordHandler = async (e) => {
      e.preventDefault()
      const data= new FormData(e.target)
      const response = await props.updatePassword(data.get('current'), data.get('new'))
      setPasswordResposne(response)
      setTimeout(() => {
        setPasswordResposne(null)
      }, 2000)
    }
  return (
    <Moddal
      show={props.show} 
      onHide={props.handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Moddal.Header>
        <Moddal.Title id="contained-modal-title-vcenter">
          Edit
        </Moddal.Title>
      </Moddal.Header>
      <Moddal.Body>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"/>
      <div class="container bootstrap snippets bootdeys">
      <div class="row">
        {update && (
          <div>
            {update}
          </div>
        )}
        <div class="col-xs-12 col-sm-9">
          <form class="form-horizontal"  encType='multipart/form-data' id='profileImage' >
            <div class="panel panel-default">
                  <div class="panel-body text-center">
                  <img width={50} height={50}  src={context.user.Image ? `http://192.168.200.84:8000/profilepics/${context.user.Image}`: '/avatar.svg'} class="img-circle profile-avatar" alt="User avatar"/>
                  </div>
                  <div class="panel-body text-center">
                    <input type='file' name='avatar'/>
                  </div>
              </div>
            <div class="panel panel-default">
              <div class="panel-heading">
              <h4 class="panel-title">User info</h4>
              </div>
              <div class="panel-body">
                <div class="form-group">
                  <label class="col-sm-2 control-label">Full Name</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" name='fullname' value={fullname} onChange={(e)=> setFullName(e.target.value)}/>
                    <input type='hidden' name = 'userId' class="form-control" value={context?.user?.userId} />
                  </div>
                </div>
                
              </div>
            </div>
          </form>
          <form class="form-horizontal" onSubmit={onSubmitPasswordHandler}>
            <div class="panel panel-default">
              <div class="panel-heading">
              <h4 class="panel-title">Security</h4>
              </div>
              <div class="panel-body">
              {changePassword ?(
                <>
                <div class="form-group">
                  <label class="col-sm-2 control-label">Current password</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control " name='current' />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-2 control-label">New password</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" name='new'/>
                  </div>
                </div>
                </>
              ) :(
                <div>
                  <div class="col-sm-10" >
                    <div onClick={passwordChange}>
                      Change Password
                    </div>  
                  </div>
                </div>
              )}
                
              {passwordResponse && (
                <span>{passwordResponse}</span>
              )}
                <div class="form-group">
                  <div class="col-sm-10 col-sm-offset-2">
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <button type="reset" class="btn btn-default">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
      </Moddal.Body>
      <Moddal.Footer>
        <Button onClick={submitHandler}>Submit</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Moddal.Footer>
    </Moddal>
  );
}

export default Modal;