import { t } from '@lingui/macro'
import { useNavigate } from 'react-router-dom'
import shortUUID from 'short-uuid'
import { Menu, MenuItem, ListItemText, Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import { shallow } from 'zustand/shallow'
import usePlayQueueStore from '../../store/usePlayQueueStore'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import useUiStore from '../../store/useUiStore'
import { pathConvert } from '../../utils'
import { File } from '../../types/file'

const CommonMenu = (
  {
    anchorEl,
    menuOpen,
    dialogOpen,
    currentFile,
    setAnchorEl,
    setMenuOpen,
    setDialogOpen,
    handleClickRemove,
    listType,
  }
    :
    {
      anchorEl: null | HTMLElement,
      menuOpen: boolean,
      dialogOpen: boolean,
      currentFile: null | File,
      setAnchorEl: (anchorEl: null | HTMLElement) => void,
      setMenuOpen: (menuOpen: boolean) => void,
      setDialogOpen: (dialogOpen: boolean) => void,
      handleClickRemove?: (filePathArray: string[][]) => void,
      listType: 'files' | 'playlist' | 'playQueue',
    }
) => {

  const navigate = useNavigate()

  const [updateFolderTree] = useUiStore((state) => [state.updateFolderTree])
  const [playQueue, currentIndex, updatePlayQueue] = usePlayQueueStore(
    (state) => [state.playQueue, state.currentIndex, state.updatePlayQueue],
    shallow
  )
  const [playlists, insertPlaylist, insertFilesToPlaylist] = usePlaylistsStore(
    (state) => [state.playlists, state.insertPlaylist, state.insertFilesToPlaylist],
    shallow
  )
  const [updateAudioViewIsShow, updateVideoViewIsShow, updatePlayQueueIsShow] = useUiStore(
    (state) => [state.updateAudioViewIsShow, state.updateVideoViewIsShow, state.updatePlayQueueIsShow]
  )

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setAnchorEl(null)
  }

  // 新建播放列表
  const addNewPlaylist = () => {
    const id = shortUUID().generate()
    insertPlaylist({ id, title: t`New playlist`, fileList: [] })
  }

  // 添加到播放列表
  const addToPlaylist = (id: string) => {
    if (currentFile) {
      insertFilesToPlaylist(id, [currentFile])
      setDialogOpen(false)
    }
  }

  // 添加到播放队列
  const handleClickAddToPlayQueue = () => {
    if (currentFile) {
      playQueue
        ? updatePlayQueue([...playQueue, { index: playQueue.length, ...currentFile }])
        : updatePlayQueue([{ index: 0, ...currentFile }])
      setMenuOpen(false)
    }
  }

  // 打开所在文件夹
  const handleClickOpenInFolder = () => {
    if (currentFile) {
      updateFolderTree(currentFile.filePath.slice(0, -1))
      navigate('/')
      setMenuOpen(false)
      updateAudioViewIsShow(false)
      updateVideoViewIsShow(false)
      updatePlayQueueIsShow(false)
    }
  }

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          setDialogOpen(true)
          handleCloseMenu()
        }}>
          <ListItemText primary={t`Add to playlist`} />
        </MenuItem>
        {  // 当前选择文件不在播放队列中时显示
          (currentFile && !playQueue?.find((file) => {
            return pathConvert(file.filePath) === pathConvert(currentFile?.filePath)
          })) &&
          <MenuItem onClick={handleClickAddToPlayQueue}>
            <ListItemText primary={t`Add to play queue`} />
          </MenuItem>
        }

        {  // 在 Files 组件中隐藏
          handleClickRemove &&
          <MenuItem onClick={handleClickOpenInFolder}>
            <ListItemText primary={t`Open in folder`} />
          </MenuItem>
        }

        {
          (
            handleClickRemove
            && currentFile
            && !(listType === 'playQueue' && currentFile?.filePath === playQueue?.find((item) => item.index === currentIndex)?.filePath)
          ) &&
          <MenuItem
            onClick={() => {
              handleClickRemove([currentFile.filePath])
              handleCloseMenu()
            }}
          >
            <ListItemText primary={t`Remove`} />
          </MenuItem>
        }
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>{t`Add to playlist`}</DialogTitle>
        <List>
          {playlists?.map((item, index) =>
            <ListItem
              disablePadding
              key={index}
            >
              <ListItemButton
                sx={{ pl: 3 }}
                onClick={() => addToPlaylist(item.id)}
              >
                <ListItemIcon>
                  <ListRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 3 }}
              onClick={addNewPlaylist}
            >
              <ListItemIcon>
                <PlaylistAddRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={t`Add playlist`} />
            </ListItemButton>
          </ListItem>
        </List>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t`Cancel`}</Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default CommonMenu