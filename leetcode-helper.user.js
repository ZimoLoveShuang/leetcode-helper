// ==UserScript==
// @name         leetcode-helper
// @namespace    https://github.com/ZimoLoveShuang/leetcode-helper
// @version      0.1
// @description  parse leetcode problems from html to markdown
// @author       zimo
// @match        https://leetcode-cn.com/problems/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const window = unsafeWindow;
    const description = '.description__2b0C';

    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    };

    // 等待内容渲染完整之后才开始解析
    waitForKeyElements(description, function () {
        // 题目
        var title = $('#question-detail-main-tabs > div.tab-pane__1SHj.css-12hreja-TabContent.e16udao5 > div > div.css-xfm0cl-Container.eugt34i0 > h4').text();
        // 难度
        var difficulty = '难度：' + $('#question-detail-main-tabs > div.tab-pane__1SHj.css-12hreja-TabContent.e16udao5 > div > div.css-xfm0cl-Container.eugt34i0 > div > span:nth-child(2)').text();
        // 内容Dom
        var contentDom = $('#question-detail-main-tabs > div.tab-pane__1SHj.css-12hreja-TabContent.e16udao5 > div > div.content__1Y2H > div');
        var content = '';
        // 遍历内容Dom，逐个处理
        contentDom.children().each(function () {
            var element = $(this)[0];
            switch (element.tagName) {
                case "P":
                    var html = '\n';
                    html += handleHtml(element.innerHTML);
                    html += '\n';
                    content += html;
                    break;
                case "PRE":
                    var html = '\n```\n' + element.innerText + '\n```\n\n';
                    content += html;
                    break;
                case "OL":
                    var html = '\n';
                    $(this).children().each(function (index) {
                        html += (index + 1) + '. ' + handleHtml($(this).html()) + '\n';
                    });
                    html += '\n';
                    content += html
                    break;
                case "UL":
                    var html = '\n';
                    $(this).children().each(function () {
                        html += '- ' + handleHtml($(this).html()) + '\n';
                    });
                    html += '\n';
                    content += html
                    break;
                default:
                    console.log('暂时未处理的内容，看到这个日志，请提issues');
                    console.log(element.tagName);
                    console.log(element);
                    break;
            }
            // console.log($(this).text())
        });
        // console.log(title);
        // console.log(difficulty);
        // console.log(content);
        // 注入菜单
        GM_registerMenuCommand("复制LeetCode题目为markdown，并存入剪切板", function () {
            var str = title + '\n\n' + difficulty + '\n' + content + '\n' + '来源：力扣（LeetCode）\n' +
                '链接：' + window.location.href + '\n' +
                '著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。';
            console.log(str);
            GM_setClipboard(str);
            swal({
                icon: "success",
                title: "复制成功",
            });
        });
        // console.log(contentDom[0].outerHTML)
    });

    /**
     * html转markdown
     * @param html
     * @returns {void|*}
     */
    function handleHtml(html) {
        // 空格
        html = html.replaceAll(/&nbsp;/, ' ');
        // 换行
        // html = html.replaceAll(/<br\s*(\/)*>/, '\n\n');
        // 小于符号
        html = html.replaceAll(/&lt;/, '<');
        // 大于符号
        html = html.replaceAll(/&gt;/, '>');
        // 加粗
        html = html.replaceAll(/<strong>/, '**');
        html = html.replaceAll(/<\/strong>/, '** ');
        html = html.replaceAll(/<b>/, '**');
        html = html.replaceAll(/<\/b>/, '** ');
        // 行内代码块
        // html = html.replaceAll(/<[/]{0,1}code>/, '`');
        // 下标
        // html = html.replaceAll(/<sub>/, '$_{');
        // html = html.replaceAll(/<\/sub>/, '}$');

        // 上标
        // html = html.replaceAll(/<sup>/, '$^{');
        // html = html.replaceAll(/<\/sup>/, '}$');

        return html
    }
})();