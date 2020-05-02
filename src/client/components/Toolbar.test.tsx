jest.mock('../window')
import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import { getDesktopStream } from '../actions/MediaActions'
import { removeLocalStream, StreamTypeCamera, StreamTypeDesktop } from '../actions/StreamActions'
import { DialState, DIAL_STATE_IN_CALL } from '../constants'
import { LocalStream } from '../reducers/streams'
import { MediaStream } from '../window'
import Toolbar, { ToolbarProps } from './Toolbar'

describe('components/Toolbar', () => {

  interface StreamState {
    cameraStream: LocalStream | null
    desktopStream: LocalStream | null
  }

  class ToolbarWrapper extends React.PureComponent<ToolbarProps, StreamState> {
    state = {
      cameraStream: null,
      desktopStream: null,
    }
    render () {
      return <Toolbar
        chatVisible={this.props.chatVisible}
        dialState={this.props.dialState}
        nickname={this.props.nickname}
        onToggleChat={this.props.onToggleChat}
        onHangup={this.props.onHangup}
        onGetDesktopStream={this.props.onGetDesktopStream}
        onRemoveLocalStream={this.props.onRemoveLocalStream}
        messagesCount={this.props.messagesCount}
        cameraStream={this.state.cameraStream || this.props.cameraStream}
        desktopStream={this.state.desktopStream || this.props.desktopStream}
      />
    }
  }

  let node: Element
  let mediaStream: MediaStream
  let url: string
  let onToggleChat: jest.Mock<() => void>
  let onHangup: jest.Mock<() => void>
  let onGetDesktopStream: jest.MockedFunction<typeof getDesktopStream>
  let onRemoveLocalStream: jest.MockedFunction<typeof removeLocalStream>
  let desktopStream: LocalStream | undefined
  let dialState: DialState
  const nickname = 'john'
  async function render () {
    dialState = DIAL_STATE_IN_CALL
    mediaStream = new MediaStream()
    onToggleChat = jest.fn()
    onHangup = jest.fn()
    onGetDesktopStream = jest.fn().mockImplementation(() => Promise.resolve())
    onRemoveLocalStream = jest.fn()
    const div = document.createElement('div')
    const cameraStream: LocalStream = {
      stream: mediaStream,
      type: StreamTypeCamera,
      url,
      streamId: mediaStream.id,
    }
    await new Promise<ToolbarWrapper>(resolve => {
      ReactDOM.render(
        <ToolbarWrapper
          ref={instance => resolve(instance!)}
          dialState={dialState}
          chatVisible
          onHangup={onHangup}
          onToggleChat={onToggleChat}
          messagesCount={1}
          nickname={nickname}
          cameraStream={cameraStream}
          desktopStream={desktopStream}
          onGetDesktopStream={onGetDesktopStream}
          onRemoveLocalStream={onRemoveLocalStream}
        />,
        div,
      )
    })
    node = div
  }

  beforeEach(async () => {
    await render()
  })

  describe('handleChatClick', () => {
    it('toggle chat', () => {
      expect(onToggleChat.mock.calls.length).toBe(0)
      const button = node.querySelector('.chat')!
      TestUtils.Simulate.click(button)
      expect(onToggleChat.mock.calls.length).toBe(1)
    })
  })

  describe('handleMicClick', () => {
    it('toggle mic', () => {
      const button = node.querySelector('.mute-audio')!
      TestUtils.Simulate.click(button)
      expect(button.classList.contains('on')).toBe(true)
    })
  })

  describe('handleCamClick', () => {
    it('toggle cam', () => {
      const button = node.querySelector('.mute-video')!
      TestUtils.Simulate.click(button)
      expect(button.classList.contains('on')).toBe(true)
    })
  })

  describe('handleFullscreenClick', () => {
    it('toggle fullscreen', () => {
      const button = node.querySelector('.fullscreen')!
      TestUtils.Simulate.click(button)
      expect(button.classList.contains('on')).toBe(false)
    })
  })

  describe('handleHangoutClick', () => {
    it('hangout', () => {
      const button = node.querySelector('.hangup')!
      TestUtils.Simulate.click(button)
      expect(window.location.href).toBe('http://localhost/')
    })
  })

  describe('onHangup', () => {
    it('calls onHangup callback', () => {
      expect(onHangup.mock.calls.length).toBe(0)
      const hangup = node.querySelector('.hangup')!
      expect(hangup).toBeDefined()
      TestUtils.Simulate.click(hangup)
      expect(onHangup.mock.calls.length).toBe(1)
    })
  })

  describe('desktop sharing', () => {
    it('starts desktop sharing', async () => {
      const shareDesktop = node.querySelector('.stream-desktop')!
      expect(shareDesktop).toBeDefined()
      TestUtils.Simulate.click(shareDesktop)
      await Promise.resolve()
      expect(onGetDesktopStream.mock.calls.length).toBe(1)
    })
    it('stops desktop sharing', async () => {
      const stream = new MediaStream()
      desktopStream = {
        stream,
        streamId: stream.id,
        type: StreamTypeDesktop,
      }
      await render()
      const shareDesktop = node.querySelector('.stream-desktop')!
      expect(shareDesktop).toBeDefined()
      TestUtils.Simulate.click(shareDesktop)
      await Promise.resolve()
      expect(onRemoveLocalStream.mock.calls.length).toBe(1)
    })
  })

  describe('copy invitation url', () => {

    let promise: Promise<string>
    beforeEach(() => {
      promise = new Promise<string>(resolve => {
        (navigator.clipboard as any) = {}
        navigator.clipboard.writeText = async text => {
          resolve(text)
        }
      })
    })

    it('copies invite url using navigator.clipboard', async () => {
      const copyUrl = node.querySelector('.copy-url')!
      expect(copyUrl).toBeDefined()
      TestUtils.Simulate.click(copyUrl)
      const result = await promise
      expect(result).toMatch(/john has invited you/)
    })
  })

})
