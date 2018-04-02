import { Modules } from './modules'

/**
 * Inject core typings
 *
 * Imported & used in the Injectify UI's monaco-editor
 */

export namespace Injectify {
  //#modules
  interface info {
    project: string
    server: {
      websocket: string
      url: string
      cached: boolean
      compression: boolean
      version: string
    }
    id: number
    platform: 'browser' | 'electron' | 'node'
    duration: number
    debug: boolean
    os: false | any
    ip: {
      city?: string
      country?: string
      ll: number[]
      metro: number
      query: string
      range: number[]
      region: string
      zip: number
    }
    headers: any
    'user-agent': any
  }

  /**
	 * Returns an object containing information about the current Injectify session
	 */
  export var info: info

  /**
	 * Information regarding the current session
	 */
  export namespace session {
    interface Info {
      window: {
        url: string
        title: string
        active: boolean
      }
      devtools
    }
    /**
     * Returns information about the current session, browser etc.
     */
    export var info: Info
    /**
     * Sends the session info to the server
     */
    export function send()
  }

  /**
   * Returns the current state of the devtools
   */
  export var devtools: {
    open: boolean,
    orientation: null | 'horizontal' | 'vertical'
  }

  /**
   * Starts the devtools listener
   */
  export function DevtoolsListener(enable?: boolean): void

  /**
	 * Returns whether Injectify was loaded in debugging mode or not.
	 * [true]: being used in development;
	 * [false]: console output should be suppressed
	 */
  export var debug: boolean

  /**
	 * Returns whether Injectify was loaded in debugging mode or not.
	 */
  export function debugLog(internalName: string, level: 'info' | 'debug' | 'warn' | 'error',  ...message: any[]): void

  /**
	 * Returns the amount of time connected to injectify server
	 */
  export var duration: number

  /**
   * Returns the time when the client connected to the injectify server
   */
  export var connectTime: number

  /**
	 * Returns the global config
	 */
  interface global {
    listeners: {
      visibility: boolean
      timed: {
        active: boolean
        prevState: string | JSON
        timer: any
      }
      pinger: any
      devtools: any
      websocket: any
    }
    windowInjection: boolean
    commandHistory: string[]
    modules: {
      states: any
      calls: any
    }
    vows: any
    scroll: {
      order: number
      id: any
      x: number
      y: number
    }
  }
  export var global: global

  /**
	 * Updates the global state
   * @param newState An object containing the new state
	 */
  export function setState(newState: any)

  /**
	 * Passes the clients window.console logs over to Injectify, whilst still showing them in the clients console.
	 * @param state Override or don't override
	 */
  export function console(state?: boolean) : 'hooked' | 'unhooked'


  /**
	 * Loads a module from the injectify server
	 * @param name Module name
	 * @param params Module parameters
	 */
  export var module: Modules

  /**
   * Loads a ReactJS app from the injectify serveer
   * @param name App name
	 * @param params App parameters
   */
  export var app: Modules

  /**
	 * Authenticates the client to the Injectify database
   * @param auth Inject websocket token to use
	 */
  export function auth(token?: string)

  interface DBRecord {
    /**
     * The table to record to
     */
    table: string
    /**
     * Data to record (can be specified as second param)
     */
    data?: any
  }

  interface DBInsert extends DBRecord {
    mode?: 'insert'
  }

  interface DBUpdate extends DBRecord {
    mode: 'update'
    /**
     * The ID of the DB record to update
     */
    id: string
  }

  interface DBAppend extends DBRecord {
    mode: 'append'
    /**
     * The ID of the DB record to update
     */
    id: string
  }

  type DBRequest = DBInsert | DBUpdate | DBAppend

  /**
	 * Records data to your projects database
   * @example
   * injectify.record('passwords', ['user', 'pass'])
   * @example
   * injectify.record({
   *   table: 'passwords',
   *   id: 'demo',
   *   mode: 'update'
   * }, ['updated', 'record'])
	 * @param req A string or object containing information about the DB request
   * @param data The data to be used in the request
	 */
  export function record(req: string | DBRequest, data?: any)

  /**
	 * Logs messages to the InjectJS console
	 * @param messages Comma-seperated list of messages to be logged
	 */
  export function log(...messages: any[])

  /**
	 * Logs warnings to the InjectJS console
	 * @param messages Comma-seperated list of messages to be logged
	 */
  export function warn(...messages: any[])

  /**
	 * Logs error messages to the InjectJS console
	 * @param messages Comma-seperated list of messages to be logged
	 */
  export function error(...messages: any[])

  /**
	 * Logs a table to the InjectJS console
	 * @param object An object / array to be converted to a table
	 */
  export function table(object: any)

  /**
	 * Logs the result of a function to the InjectJS console
	 * @param data Data to be logged
	 */
  export function result(...messages: any[])


	/**
	 * CAUTION: This will prevent you from executing any other commands
   *
   * Overrides the message handler for the websocket connection
	 * @param callback Callback to be triggered once message received
	 */
  export function listener(callback: Function)

  /**
   * Returns the current state of the DOM with all the values from input elements intact
   */
  export var DOMExtractor: HTMLHtmlElement

  /**
   * Loads external javascript files and returns a promise once all are complete
   */
  export function LoadJS(urls: string[]): Promise<void>

  /**
	 * Listen for a topic from the websocket connection
	 * @param topic Topic name to listen to
	 * @param callback Callback to be triggered once received
   * @param once Only listen for the first event
	 */
  export function listen(topic: string, callback, once?: boolean)

  /**
	 * Removes a listener from a websocket topic listener
	 * @param topic Topic name to unlisten
	 * @param callback
	 */
  export function unlisten(topic: string, callback?: any)


  /**
	 * Send data to websocket
	 * @param topic Message topic
	 * @param data Message data
	 */
  export function send(topic: string, data?: any)

  /**
	 * Get the websocket ping time (in milliseconds)
	 * @param callback Callback to be executed on ping complete
	 */
  export function ping(callback: Function)
}
