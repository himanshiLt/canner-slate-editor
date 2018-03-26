// @flow
/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor} from 'slate-react';
import beautify from 'js-beautify';
import {Value} from 'slate';
import {Row, Col} from 'antd';
import rendererFn from 'packages/slate-editor-renderer';
import {AlignCenter, AlignLeft, AlignRight} from 'packages/slate-icon-align';
import Blockquote from 'packages/slate-icon-blockquote';
import Bold, {BoldPlugin} from 'packages/slate-icon-bold';
import Clean from 'packages/slate-icon-clean';
import Code, {CodePlugin} from 'packages/slate-icon-code';
import Emoji from 'packages/slate-icon-emoji';
import FontBgColor, {FontBgColorPlugin} from 'packages/slate-icon-fontBgColor';
import FontColor, {FontColorPlugin} from 'packages/slate-icon-fontColor';
import {Header1, Header2} from 'packages/slate-icon-header';
import Image from 'packages/slate-icon-image';
import {Indent, Outdent} from 'packages/slate-icon-indent';
import Italic, {ItalicPlugin} from 'packages/slate-icon-italic';
import Link from 'packages/slate-icon-link';
import {OlList, UlList} from 'packages/slate-icon-list';
import StrikeThrough, {StrikeThroughPlugin} from 'packages/slate-icon-strikethrough';
import Underline, {UnderlinePlugin} from 'packages/slate-icon-underline';
import Undo from 'packages/slate-icon-undo';
import Video from 'packages/slate-icon-video';

// select
import FontSize, {FontSizePlugin} from 'packages/slate-select-fontsize';
import LetterSpacing, {LetterSpacingPlugin} from 'packages/slate-select-letterspacing';
import LineHeight from 'packages/slate-select-lineheight';

// plugins
import {DEFAULT as DEFAULTLIST} from '@canner/slate-helper-block-list';
import {DEFAULT as DEFAULTBLOCKQUOTE} from '@canner/slate-helper-block-quote';
import EditList from 'slate-edit-list';
import EditBlockquote from 'slate-edit-blockquote';
import {ParagraphPlugin} from 'packages/slate-icon-shared';

import Prism from 'prismjs';
import "prismjs/themes/prism.css"

// rules
import Html from 'slate-html-serializer';
import {
  markRules,
  blockRules,
  inlineRules,
  imageRules,
  videoRules
} from 'packages/slate-editor-html';

const html = new Html({ rules: [
    blockRules('p', 'paragraph'),
    blockRules('blockquote', 'blockquote'),
    blockRules('h1', 'heading1'),
    blockRules('h2', 'heading2'),
    blockRules('ul', 'list-ul'),
    blockRules('ol', 'list-ol'),
    blockRules('li', 'list-item'),
    inlineRules('a', 'link'),
    markRules('strong', 'bold'),
    markRules('code', 'code'),
    markRules('i', 'italic'),
    markRules('s', 'strikethrough'),
    markRules('u', 'underline'),
    markRules('span', 'fontBgColor', {
      key: 'backgroundColor',
      value: 'color'
    }),
    markRules('span', 'fontColor',  {
      key: 'color',
      value: 'color'
    }),
    markRules('span', 'fontSize',  {
      key: 'fontSize',
      value: 'fontSize'
    }),
    markRules('span', 'letterSpacing',  {
      key: 'letterSpacing',
      value: 'letterSpacing'
    }),
    videoRules('youtube'),
    videoRules('vimeo'),
    videoRules('dailymotion'),
    videoRules('youku'),
    imageRules('image')
  ]
})

import "./style.css";
import "./github-markdown.css";

const {
  commonNode,
  emojiNode,
  imageNode,
  linkNode,
  videoNode
} = rendererFn;

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          }
        ],
      },
    ],
  },
});

const selectors = [
  FontSize,
  LetterSpacing,
  LineHeight
]

const icons = [
  AlignCenter,
  AlignLeft,
  AlignRight,
  Blockquote,
  Bold,
  Clean,
  Code,
  Emoji,
  FontBgColor,
  FontColor,
  Header1,
  Header2,
  Image,
  Indent,
  Outdent,
  Italic,
  Link,
  OlList,
  UlList,
  StrikeThrough,
  Underline, 
  Undo,
  Video
];

const plugins = [
  EditList(DEFAULTLIST),
  EditBlockquote(DEFAULTBLOCKQUOTE),
  ParagraphPlugin,
  BoldPlugin,
  CodePlugin,
  FontBgColorPlugin,
  FontColorPlugin,
  ItalicPlugin,
  StrikeThroughPlugin,
  UnderlinePlugin,
  FontSizePlugin,
  LetterSpacingPlugin
];

class App extends React.Component {
  // Set the initial state when the app is first constructed.
  state = {
    value: initialValue
  }

  componentDidUpdate() {
    Prism.highlightAllUnder(document.getElementById('root'));
  }

  render() {
    const {value} = this.state;
    const onChange = ({value}) => this.setState({value});
    const htmlValue = html.serialize(value);
    const dataObj = html.deserialize(htmlValue);
    const beautyHTML = beautify.html(htmlValue, { indent_size: 2, space_in_empty_paren: true })

    console.log('--------------Current Value----------------')
    console.log(value.toJSON())
    console.log('--------------Deserialize from HTML--------------')
    console.log(dataObj.toJSON())

    return (
      <Row>
        <Col span={12} style={{borderRight: '1px solid #DDD', minHeight: '100vh'}}>
          <div className="toolbar">
            <div>
              {selectors.map((Type, i) => {
                return <Type
                  change={value.change()}
                  onChange={onChange}
                  key={i}
                  className="toolbar-select"
                />
              })}
            </div>
            <div>
              {icons.map((Type, i) => {
                return <Type
                  change={value.change()}
                  onChange={onChange}
                  key={i}
                  className="toolbar-item"
                  activeClassName="toolbar-item-active"
                  activeStrokeClassName="ql-stroke-active"
                  activeFillClassName="ql-fill-active"
                  activeThinClassName="ql-thin-active"
                  activeEvenClassName="ql-even-active"
                />
              })}
            </div>
          </div>
          <div className="editor markdown-body">
            <Editor
              value={value}
              onChange={onChange}
              plugins={plugins}
              renderNode={renderNode}
            />
          </div>
        </Col>
        <Col span={12} style={{padding: '5px 0 5px 10px'}}>
          <h3>Serialized HTML</h3>
          <pre>
            <code className="language-markup">
              {beautyHTML}
            </code>
          </pre>
        </Col>
      </Row>
    );
  }
}

function renderNode(props) {
  switch (props.node.type) {
    case 'emoji':
      return emojiNode()(props);
    case 'heading1':
      return commonNode('h1')(props);
    case 'heading2':
      return commonNode('h2')(props);
    case 'list-ul':
      return commonNode('ul')(props);
    case 'list-ol':
      return commonNode('ol')(props);
    case 'list-item':
      return commonNode('li')(props);
    case 'image':
      return imageNode()(props);
    case 'link':
      return linkNode()(props);
    case 'youtube':
      return videoNode('youtube')(props);
    case 'dailymotion':
      return videoNode('dailymotion')(props);
    case 'youku':
      return videoNode('youku')(props);
    case 'vimeo':
      return videoNode('vimeo')(props);
  }
}

ReactDOM.render(
  <App/>
, document.getElementById('root'));
