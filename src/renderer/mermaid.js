const { debug } = console

function injectMermaid(monaco) {
  debug('Injecting mermaid language')
  // Register a new language
  monaco.languages.register({ id: 'mermaid' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('mermaid', {
    tokenizer: {
      root: [
        [/^graph .*$/, "keyword"],
        [/\[error.*/, "custom-error"],
        [/\[notice.*/, "custom-notice"],
        [/\[info.*/, "custom-info"],
        [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
      ]
    }
  });

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme('myCoolTheme', {
    base: 'vs',
    inherit: false,
    rules: [
      { token: 'graph-definition', foreground:'#000060' },
      { token: 'custom-info', foreground: '808080' },
      { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
      { token: 'custom-notice', foreground: 'FFA500' },
      { token: 'custom-date', foreground: '008800' },
    ]
  });

  // Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider('mermaid', {
    provideCompletionItems: () => {
      var suggestions = [{
        label: 'simpleFlowChart',
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: `graph TD \n\tA[Label] --> B`
      }, {
        label: 'simpleLine',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '${1:id1}[${2:label1}] --> ${3:id2}[${4:label2}]'
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Simple '
      }];
      return { suggestions: suggestions };
    }
  });
}



module.exports = {
  injectMermaid
}