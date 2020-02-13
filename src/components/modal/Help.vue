<template>
  <div class="markdown-body help">
    <h3>Markdown语法</h3>
    <ul>
      <li>
        <a href="http://www.markdown.cn/">Markdown 语法说明</a>
      </li>
      <li>
        <a href="https://help.github.com/articles/github-flavored-markdown/"
          >GitHub Flavored Markdown</a
        >
      </li>
    </ul>
    <h3>XK-Editor独有的语法</h3>
    <table>
      <tr>
        <th>语法格式</th>
        <th>参数</th>
        <th>样例</th>
      </tr>
      <tr>
        <td>[text]{style|label}</td>
        <td>
          text:内容，style:样式(css)，label:包裹的标签(span,p,font)默认为p
        </td>
        <td>[这是蓝色的字]{color:blue} [灰色背景]{background:#ddd|span}</td>
      </tr>
      <tr>
        <td>[TOC]</td>
        <td>null</td>
        <td>在[TOC]位置填充目录</td>
      </tr>
    </table>

    <h3>键盘快捷键</h3>
    <blockquote>当编辑器取得焦点的时候才能使用快捷键</blockquote>
    <table>
      <tr>
        <th>快捷键</th>
        <th>说明</th>
      </tr>
      <tr>
        <td>F1</td>
        <td>转换为HTML编辑</td>
      </tr>
      <tr>
        <td>F2</td>
        <td>转换为TinyMCE</td>
      </tr>
      <tr>
        <td>F7</td>
        <td>显示隐藏目录</td>
      </tr>
      <tr>
        <td>F8</td>
        <td>开启/关闭打字机模式</td>
      </tr>
      <tr>
        <td>F9</td>
        <td>开启/关闭实时预览</td>
      </tr>
      <tr>
        <td>F10</td>
        <td>切换全窗口预览</td>
      </tr>
      <tr>
        <td>F11</td>
        <td>切换全屏</td>
      </tr>
      <tr>
        <td>Ctrl + 1~6 / Command + 1~6</td>
        <td>插入标题1~6</td>
      </tr>
      <tr>
        <td>Ctrl + A / Command + A</td>
        <td>全选</td>
      </tr>
      <tr>
        <td>Ctrl + B / Command + B</td>
        <td>粗体</td>
      </tr>
      <tr>
        <td>Ctrl + D / Command + D</td>
        <td>插入时间</td>
      </tr>
      <tr>
        <td>Ctrl + F / Command + F</td>
        <td>搜索</td>
      </tr>
      <tr>
        <td>Ctrl + G / Command + G</td>
        <td>匹配下一项</td>
      </tr>
      <tr>
        <td>Ctrl + H / Command + H</td>
        <td>插入水平线</td>
      </tr>
      <tr>
        <td>Ctrl + I / Command + I</td>
        <td>斜体</td>
      </tr>
      <tr>
        <td>Ctrl + K / Command + K</td>
        <td>插入行内代码</td>
      </tr>
      <tr>
        <td>Ctrl + L / Command + L</td>
        <td>插入链接</td>
      </tr>
      <tr>
        <td>Ctrl + Q / Command + Q</td>
        <td>切换粘贴转化</td>
      </tr>
      <tr>
        <td>Ctrl + U / Command + U</td>
        <td>插入无序列表</td>
      </tr>
      <tr>
        <td>Ctrl + Z / Command + Z</td>
        <td>撤销</td>
      </tr>
      <tr>
        <td>Ctrl + Y / Command + Y</td>
        <td>重做</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + I</td>
        <td>插入图片</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + K</td>
        <td>插入TeX(KaTeX)公式符号</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + O</td>
        <td>插入有序列表</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + P</td>
        <td>插入Code块</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + Q</td>
        <td>插入引用</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + S</td>
        <td>插入删除线</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + T</td>
        <td>插入表格</td>
      </tr>
      <tr>
        <td>Shift + Shift + H</td>
        <td>打开使用帮助对话框</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + G</td>
        <td>跳转到指定的行</td>
      </tr>
      <tr>
        <td>Ctrl + Shift + F</td>
        <td>格式化Markdown(美化)</td>
      </tr>
    </table>

    <h3>Emoji表情</h3>
    <a href="https://www.webfx.com/tools/emoji-cheat-sheet/"
      >EMOJI CHEAT SHEET</a
    >
    <h3>流程图/时序图/甘特图</h3>
    <a href="https://mermaidjs.github.io/">mermaid - GitBook</a>
    <h3>Tex数学公式</h3>
    <a href="https://juejin.im/post/5af93ec6518825428b38e7f4"
      >markdown 数学公式Latex语法 - 掘金</a
    >
  </div>
</template>

<script>
export default {
  name: "help-item"
};
</script>
