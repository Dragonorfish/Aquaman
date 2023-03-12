import MarkdownIt from "markdown-it"
import katex from 'markdown-it-katex-external'
import emoji from 'markdown-it-emoji'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import 'highlight.js/lib/common'

export function markdownToHtml(content) {

  const md = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(lang, str, true).value +
            '</code></pre>';
        } catch (__) {}
      }
      md.renderer.rules.strong_open  = function () { return '<b>'; };
      md.renderer.rules.strong_close = function () { return '</b>'; };

      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    },
    breaks:true,
    linkify: true,
    typographer: true,
  }).use(katex).use(emoji)

  return md.render(content)
}
export function markdownToHtmlWithoutLink(content) {
  const md = new MarkdownIt({
    breaks:true
  }).use(katex).use(emoji)
  md.disable(['link'])
  return md.render(content)
}
