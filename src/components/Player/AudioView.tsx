import { Box, Container, IconButton, Slider, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { MetaData } from '../../type'
import usePlayListStore from '../../store/usePlayListStore'
import usePlayerStore from '../../store/usePlayerStore'
import useUiStore from '../../store/useUiStore'
import { timeShift } from '../../util'

const AudioView = (
  { player, metaData, cover, handleClickPlayPause, handleClickNext, handleClickPrev, handleTimeRangeonChange }
    : {
      player: HTMLVideoElement,
      metaData: MetaData | null,
      cover: string,
      handleClickPlayPause: () => void,
      handleClickNext: () => void,
      handleClickPrev: () => void,
      handleTimeRangeonChange: (current: number | number[]) => void,
    }
) => {
  const [playList] = usePlayListStore((state) => [
    state.playList,
  ])

  const [audioViewIsShow, updateAudioViewIsShow, updatePlayListIsShow] = useUiStore((state) => [
    state.audioViewIsShow,
    state.updateAudioViewIsShow,
    state.updatePlayListIsShow,
  ])

  const [currentTime, duration] = usePlayerStore((state) => [state.currentTime, state.duration])

  return (
    <div style={{
      transform: 'translateZ(0)' // blur 性能优化
    }}>
      <Container
        maxWidth={false}
        disableGutters={true}
        sx={{
          width: '100%',
          height: '100dvh',
          position: 'fixed',
          transition: 'all 0.5s',
          background: `linear-gradient(rgba(150, 150, 150, .5), rgb(150, 150, 150, .5)), url(${cover})  no-repeat center`,
          backgroundSize: 'cover',
          color: '#fff'
        }}
        style={(audioViewIsShow) ? { bottom: '0' } : { bottom: '-100vh' }}
      >
        <Box sx={{ backdropFilter: 'blur(20px)', }}>
          <Container maxWidth={'xl'} disableGutters={true}>
            <Grid container
              pt={{ xs: 1, sm: 2 }}
              pb={{ xs: 1, sm: 2 }}
              pl={{ xs: 0, sm: 2 }}
              pr={{ xs: 0, sm: 2 }}
              sx={{
                width: '100%',
                height: '100dvh',
                justifyContent: 'space-evenly',
                alignItems: 'start',
              }}
            >

              <Grid xs={6} pl={{ xs: 1, sm: 0 }} >
                <IconButton aria-label="close" onClick={() => updateAudioViewIsShow(false)} >
                  <KeyboardArrowDownOutlinedIcon style={{ color: '#fff' }} />
                </IconButton>
              </Grid>

              <Grid xs={6} pr={{ xs: 1, sm: 0 }} textAlign={'right'}>
                <IconButton aria-label="PlayList" onClick={() => updatePlayListIsShow(true)} >
                  <QueueMusicOutlinedIcon style={{ color: '#fff' }} />
                </IconButton>
              </Grid>

              {/* 封面和音频信息 */}
              <Grid container
                maxWidth={'lg'}
                height={{ xs: 'calc(100dvh - 4rem)', sm: 'auto' }}
                flexDirection={{ xs: 'column', sm: 'row' }}
                wrap='nowrap'
                xs={12}
                sx={{
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                {/* 封面 */}
                <Grid sm={4} xs={12} pl={{ xs: 0, sm: 1 }}>
                  <img style={{ maxHeight: '100vw', width: '100%', objectFit: 'contain' }} src={cover} />
                </Grid>

                {/* 音频信息 */}
                <Grid sm={8} xs={12} pl={{ xs: 0, lg: 5 }} textAlign={'center'}>
                  <Grid xs={12} pl={4} pr={4} >
                    <Typography variant="h6" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.title}
                    </Typography>
                    <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.artist}
                    </Typography>
                    <Typography variant="body1" component="div" textAlign={'center'} noWrap>
                      {(!playList || !metaData) ? 'Not playing' : metaData.album}
                    </Typography>
                  </Grid>

                  {/* 播放进度条 */}
                  <Grid xs={12} pl={3} pr={3} >
                    <Slider
                      size="small"
                      min={0}
                      max={1000}
                      value={(!duration) ? 0 : currentTime / duration * 1000}
                      onChange={(_, current) => handleTimeRangeonChange(current)}
                      style={{ color: '#fff', width: '100%' }}
                    />
                    <Typography style={{ color: '#fff' }} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                      <span>{timeShift(currentTime)}</span>
                      <span>{timeShift((duration) ? duration : 0)}</span>
                    </Typography>
                  </Grid>

                  <Grid xs={12} >
                    <IconButton aria-label="previous" onClick={handleClickPrev} >
                      <SkipPreviousIcon sx={{ height: 48, width: 48 }} style={{ color: '#fff' }} />
                    </IconButton>
                    <IconButton aria-label="play/pause" onClick={handleClickPlayPause}>
                      {
                        (!player.paused)
                          ? <PauseCircleOutlinedIcon sx={{ height: 64, width: 64 }} style={{ color: '#fff' }} />
                          : <PlayCircleOutlinedIcon sx={{ height: 64, width: 64 }} style={{ color: '#fff' }} />}
                    </IconButton>
                    <IconButton aria-label="next" onClick={handleClickNext} >
                      <SkipNextIcon
                        sx={{ height: 48, width: 48 }}
                        style={{ color: '#fff' }} />
                    </IconButton>
                  </Grid>

                </Grid>
              </Grid>

            </Grid>
          </Container>
        </Box>

      </Container>
    </div >
  )
}

export default AudioView