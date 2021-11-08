import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import AuthContext from '../auth';
import { useContext, useState } from 'react';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import GlobalStoreContext from '../store';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const { auth } = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const { store } = useContext(GlobalStoreContext);

  const hideError = () => {
      auth.hideError();
  }

  let cancelDeletion = () => {
    store.unmarkListForDeletion();
  }

  let handleDeletion = () => {
    store.deleteMarkedList();
  }

  if(auth.err) {
    return ( 
      <div>
          <Modal
              open={open}
              onClose={hideError}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
              <Box sx={style}>
                  <Alert severity = "error">{auth.err}</Alert>
                  <Button variant = "text" onClick = {hideError}> Close </Button>
              </Box>
          </Modal>
        </div>
    )
  }

  if(store.listMarkedForDeletion){
    return (
      <div>
          <Modal
              open={open}
              onClose={cancelDeletion}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
              <Box sx={style}>
                  <Alert severity = "error"> Are you sure you want to delete the Top 5 List: {store.listMarkedForDeletion.name}?</Alert>
                  <Button variant = "text" onClick = {handleDeletion}> Confirm </Button>
                  <Button variant = "text" onClick = {cancelDeletion}> Cancel </Button>
              </Box>
          </Modal>
      </div>
    )
  }

  return '';
} 