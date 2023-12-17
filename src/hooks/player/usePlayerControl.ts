import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'

const usePlayerControl = (player: HTMLVideoElement | null) => {

  const [
    playQueue,
    currentIndex,
    updateCurrentIndex,
  ] = usePlayQueueStore(
    (state) => [
      state.playQueue,
      state.currentIndex,
      state.updateCurrentIndex,
    ]
  )

  const [
    updatePlayStatu,
    updateCurrentTime,
  ] = usePlayerStore(
    (state) => [
      state.updatePlayStatu,
      state.updateCurrentTime,
    ]
  )

  const [
    shuffle,
    repeat,
    updateRepeat,
  ] = useUiStore(
    (state) => [
      state.shuffle,
      state.repeat,
      state.updateRepeat,
    ]
  )

  // 播放开始
  const handleClickPlay = () => {
    updatePlayStatu('playing')
  }

  // 播放暂停
  const handleClickPause = () => {
    updatePlayStatu('paused')
  }

  // 下一曲
  const handleClickNext = () => {
    if (player && playQueue) {
      const next = playQueue[(playQueue.findIndex(item => item.index === currentIndex) + 1)]
      // player.pause()
      if (shuffle && next) {
        updateCurrentIndex(next.index)
      }
      if (!shuffle && currentIndex + 1 < playQueue?.length)
        updateCurrentIndex(currentIndex + 1)
    }
  }

  // 上一曲
  const handleClickPrev = () => {
    if (player && playQueue) {
      const prev = playQueue[(playQueue.findIndex(item => item.index === currentIndex) - 1)]
      // player.pause()
      if (shuffle && prev) {
        updateCurrentIndex(prev.index)
      }
      if (!shuffle && currentIndex > 0)
        updateCurrentIndex(currentIndex - 1)
    }
  }

  /**
   * 快进
   * @param skipTime 
   */
  const handleClickSeekbackward = (skipTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = Math.max(player.currentTime - skipTime, 0)
    }
  }

  /**
   * 快退
   * @param skipTime 
   */
  const handleClickSeekforward = (skipTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = Math.min(player.currentTime + skipTime, player.duration)
    }
  }

  /**
   * 跳到指定位置
   * @param seekTime 
   */
  const seekTo = (seekTime: number) => {
    if (player && !isNaN(player.duration)) {
      player.currentTime = seekTime
    }
  }

  /**
 * 点击进度条
 * @param current 
 */
  const handleTimeRangeonChange = (current: number | number[]) => {
    if (player && !isNaN(player.duration) && typeof (current) === 'number') {
      updateCurrentTime(player.duration / 1000 * Number(current))
      seekTo(player.duration / 1000 * Number(current))
    }
  }

  // 重复
  const handleClickRepeat = () => {
    if (repeat === 'off')
      updateRepeat('all')
    if (repeat === 'all')
      updateRepeat('one')
    if (repeat === 'one')
      updateRepeat('off')
  }

  return {
    seekTo,
    handleClickPlay,
    handleClickPause,
    handleClickNext,
    handleClickPrev,
    handleClickSeekforward,
    handleClickSeekbackward,
    handleTimeRangeonChange,
    handleClickRepeat,
  }

}

export default usePlayerControl