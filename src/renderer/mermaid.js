const { debug } = console

function injectMermaid(monaco) {
  debug('Injecting mermaid language')

  const templateSuggestions = [
    {
      label: 'Flow Chart',
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: 'graph TD; \n\tA-->B;\n\tA-->C;\n\tB-->D;\n\tC-->D;',
    },
    {
      label: 'Sequence Diagram',
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: `sequenceDiagram
  participant Alice
  participant Bob
  Alice->>John: Hello John, how are you?
  loop Healthcheck
      John->>John: Fight against hypochondria
  end
  Note right of John: Rational thoughts <br/>prevail!
  John-->>Alice: Great!
  John->>Bob: How about you?
  Bob-->>John: Jolly good!`,
    },
    {
      label: 'Gannt Diagram',
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: `gantt
  dateFormat  YYYY-MM-DD
  title Adding GANTT diagram to mermaid
  excludes weekdays 2014-01-10

  section A section
  Completed task            :done,    des1, 2014-01-06,2014-01-08
  Active task               :active,  des2, 2014-01-09, 3d
  Future task               :         des3, after des2, 5d
  Future task2               :         des4, after des3, 5d`,
    },
    {
      label: 'Class Diagram',
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: `classDiagram
  Class01 <|-- AveryLongClass : Cool
  Class03 *-- Class04
  Class05 o-- Class06
  Class07 .. Class08
  Class09 --> C2 : Where am i?
  Class09 --* C3
  Class09 --|> Class07
  Class07 : equals()
  Class07 : Object[] elementData
  Class01 : size()
  Class01 : int chimp
  Class01 : int gorilla
  Class08 <--> C2: Cool label`,
    },
    {
      label: 'Git graph',
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: `gitGraph:
  options
  {
      "nodeSpacing": 150,
      "nodeRadius": 10
  }
  end
  commit
  branch newbranch
  checkout newbranch
  commit
  commit
  checkout master
  commit
  commit
  merge newbranch`,
    },
    {
      label: 'State diagram',
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: `stateDiagram-v2
[*] --> Still
Still --> [*]

Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]`,
    },
    {
      label: 'Pie chart',
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: `pie
  title Key elements in Product X
  "Calcium" : 42.96
  "Potassium" : 50.05
  "Magnesium" : 10.01
  "Iron" :  5`,
    },
  ]

  // Register a new language
  monaco.languages.register({ id: 'mermaid' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('mermaid', {
    tokenizer: {
      root: [
        [/^graph/, 'keyword'],
        [/(TB|TD)|[BRL][TLR]/, 'attribute.value'],
        [/[-.=]{2}-?>?/, 'attribute.value'],
        [/^sequenceDiagram.*$/, 'keyword'],
        [/^gantt.*$/, 'keyword'],
        [/^section.*$/, 'keyword'],
        [/^stateDiagram.*$/, 'keyword'],
        [/^classDiagram.*$/, 'keyword'],
        [/^gitGraph.*/, 'keyword'],
        [/^pie.*/, 'keyword'],
      ],
    },
  });

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme('myCoolTheme', {
    base: 'vs',
    inherit: false,
    rules: [
      // { token: 'graph-definition', foreground: '#000060' },
      // { token: 'custom-info', foreground: '808080' },
      // { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
      // { token: 'custom-notice', foreground: 'FFA500' },
      // { token: 'custom-date', foreground: '008800' },
    ],
  });

  // Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider('mermaid', {
    provideCompletionItems: () => {
      const suggestions = [{
        label: 'simpleLine',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '${1:id1}[${2:label1}] --> ${3:id2}[${4:label2}]', // eslint-disable-line
        ].join('\n'),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Simple ',
      }].concat(templateSuggestions);
      return { suggestions };
    },
  });
}

module.exports = {
  injectMermaid,
}
