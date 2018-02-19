import ReactDOM, { render } from 'react-dom'
import React from 'react'
import { connect } from 'react-redux'


import Tabs from './Tabs'
import Console from './Console'

import MonacoEditor from 'react-monaco-editor'
import CodeMirror from 'react-codemirror'
require('codemirror/mode/javascript/javascript')
import Typings from '../../../../../../src/inject/core/definitions/core.d.ts'
import ModuleTypings from '../../../../../../src/inject/core/definitions/modules.d.ts'

class Editor extends React.Component {
  updateDimensions = () => {
    if (this.editor) this.editor.layout()
  }

  editorDidMount = (editor, monaco) => {
    this.editor = editor
    let typings = Typings
      .replace(/^\s*import /mg, `// import `)
      .replace('export namespace Injectify', `declare module 'injectify'`)
      .replace('//1', 'export namespace injectify {')
      .replace('//2', ModuleTypings.replace('export interface Modules', 'interface Modules'))
      .replace('//3',
        `}
      export var window: any`)
    monaco.editor.defineTheme('Injectify', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '626466' },
        { token: 'keyword', foreground: '6CAEDD' },
        { token: 'identifier', foreground: 'fac863' },
      ],
    })
    monaco.editor.setTheme('Injectify')
    try {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(typings, 'injectify.d.ts')
    } catch (e) { }
    editor.focus()
    window.addEventListener('resize', this.updateDimensions)
  }

  render() {
    const { state } = this.props
    const options = {
      selectOnLineNumbers: true,
      lineNumbers: true,
      mode: 'javascript',
      formatOnPaste: true,
      folding: true,
      glyphMargin: false,
      fontLigatures: true,
      theme: 'panda-syntax'
    }

    return (
      <div className='inject-editor-container' /*onClick={() => this.state.open && this.toggleMenu()}*/>
        {/* <Tabs tabs={(state.console.selected && state.console.selected.client && state.console.selected.sessions) || []} /> */}
        {window.innerWidth >= 650 ? (
          <MonacoEditor
            language={(state.code && /^\s*import /m.test(state.code)) ? 'typescript' : 'javascript'}
            value={state.code}
            options={options}
            onChange={this.onChange}
            editorDidMount={this.editorDidMount} />
        ) : (
          <CodeMirror value={code} onChange={this.onChange} options={options} />
        )}
        {/* <Console resizeMonaco={this.updateDimensions.bind(this)} execute={code => { if (this.state.selectedClient && this.state.selectedClient.token) this.execute(this.state.selectedClient.token, '*', code) }} /> */}
      </div>
    )
  }
}


export default connect(({ injectify }) => ({ state: injectify }))(Editor)