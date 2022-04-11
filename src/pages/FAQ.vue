<template>
    <div class="faq-desk">
        <div>
            <QuestAndAnswer title="本系统完整使用文档">
                前往
                <Link @click="openUrl('https://portableoj.github.io/portable-docs/')">
                    这里
                </Link>
                获取
            </QuestAndAnswer>
            <QuestAndAnswer title="提交的反馈信息有哪些">
                <div>
                    <div class="solution-box">
                        <SolutionStatus value="PENDING"></SolutionStatus>
                        <span>等待中</span>
                        <span>你的提交正在等待被处理，请耐心等待</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="COMPILING"></SolutionStatus>
                        <span>编译中</span>
                        <span>你的提交正在被编译，请耐心等待</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="JUDGING"></SolutionStatus>
                        <span>判题中</span>
                        <span>你的提交正在接受测试，至少可以通过编译</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="ACCEPT"></SolutionStatus>
                        <span>通过</span>
                        <span>恭喜你通过了所有测试</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="SYSTEM_ERROR"></SolutionStatus>
                        <span>系统错误</span>
                        <span>出现了一些意料之外的错误，如果频繁出现请联系管理员</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="RUNTIME_ERROR"></SolutionStatus>
                        <span>运行错误</span>
                        <span>你的程序在运行期间发生崩溃</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="TIME_LIMIT_EXCEEDED"></SolutionStatus>
                        <span>超时</span>
                        <span>你的程序不能在规定时间内完成指定的测试任务</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="SEGMENT_FAIL"></SolutionStatus>
                        <span>段错误</span>
                        <span>你的程序可能存在「数组越界」，「非法访问」，「内存超限」的问题</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="ERRONEOUS_ARITHMETIC_OPERATION"></SolutionStatus>
                        <span>运算符非法</span>
                        <span>你使用了不正确的运算，例如「除0」</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="ILLEGAL_SYSTEM_CAL"></SolutionStatus>
                        <span>非法的系统调用</span>
                        <span>你的程序中存在不被允许的系统调用，亦或者你试图攻击系统</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="RETURN_NOT_ZERO"></SolutionStatus>
                        <span>返回值非零</span>
                        <span>你的程序虽然正常结束了，但是没有正确的返回 「0」</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="COMPILE_ERROR"></SolutionStatus>
                        <span>编译错误</span>
                        <span>你的程序没有办法正确通过编译</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="JUDGE_COMPILE_ERROR"></SolutionStatus>
                        <span>judge 程序编译错误</span>
                        <span>这通常不是你的问题，请联系出题人解决</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="JUDGE_FAIL"></SolutionStatus>
                        <span>judge 程序运行出错</span>
                        <span>这通常不是你的问题，请联系出题人解决</span>
                    </div>
                    <div class="solution-box">
                        <SolutionStatus value="WRONG_ANSWER"></SolutionStatus>
                        <span>答案错误</span>
                        <span>你的程序没有输出令出题人满意的答案</span>
                    </div>
                </div>
            </QuestAndAnswer>
            <QuestAndAnswer title="我应该从哪里读输入，另外应该输出到哪里">
                <p style="font-weight: bolder">你应该从标准输入流中输入，并输出至标准输出流</p>
                <p>
                    标准输入流：在 Linux 下，即从文件标识符为 「0」 处进行读入，C 语言通常使用
                    <MarkdownInlineCode value="scanf"></MarkdownInlineCode>
                    进行读入，而 C++ 则常用
                    <MarkdownInlineCode value="cin"></MarkdownInlineCode>
                    进行读入
                </p>
                <p>
                    标准输出流：在 Linux 下，即从文件标识符为 「1」 处进行输出，C 语言通常使用
                    <MarkdownInlineCode value="prinf"></MarkdownInlineCode>
                    进行输出，而 C++ 则常用
                    <MarkdownInlineCode value="cout"></MarkdownInlineCode>
                    进行输出
                </p>
            </QuestAndAnswer>
        </div>
        <div>
            <QuestAndAnswer title="Portable OJ 是什么">
                <div style="text-align: center">
                    <img src="../assets/logo.svg" alt="logo"/>
                    <p style="text-align: center">
                        Portable OJ 是一个开源的、高性能的、分布式的在线判题系统。
                    </p>
                </div>
                <p>
                    你可以在任何地方，通过一行命令来快速的搭建一个 Portable Online Judge 系统来为你所用，整个过程完全免费。
                </p>
                <p>
                    你也可以
                    <Link @click="openUrl('https://github.com/PortableOJ')">前往https://github.com/PortableOJ</Link>
                    来获取本系统的所有源代码，整个过程完全不需要向其他任何人支付任何费用。
                </p>
            </QuestAndAnswer>
            <QuestAndAnswer title="本系统贡献名单">
                <Link @click="openUrl('https://github.com/Hukeqing')">Shiroha</Link>
                <p>
                    你也可以在页面底部看到所有核心贡献者名单
                </p>
            </QuestAndAnswer>
            <QuestAndAnswer title="我的程序在什么环境下进行评判">
                你可以在
                <Link @click="openUrl('https://github.com/PortableOJ/portable-judge-base/actions')">这里</Link>
                查询到所有系统版本的编译/解释器的版本。这里的信息通常有些滞后，请谅解
                <div>
                    <h3>编译/解释器版本信息</h3>
                    <h5>GCC</h5>
                    <MarkdownBlockCode value="gcc (Ubuntu 9.4.0-1ubuntu1~20.04) 9.4.0
Copyright (C) 2019 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.">
                    </MarkdownBlockCode>
                    <h5>G++</h5>
                    <MarkdownBlockCode value="g++ (Ubuntu 9.4.0-1ubuntu1~20.04) 9.4.0
Copyright (C) 2019 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE."
                    ></MarkdownBlockCode>
                </div>
                <div>
                    <h3>运行命令</h3>
                    <h5>GNU GCC C99</h5>
                    编译
                    <MarkdownBlockCode value="/usr/bin/gcc main.c -O2 -o main -w -lm --static -std=gnu99 -DONLINE_JUDGE -fmax-errors=5"></MarkdownBlockCode>
                    运行
                    <MarkdownBlockCode value="./main"></MarkdownBlockCode>
                    <h5>GNU G++ C++11</h5>
                    编译
                    <MarkdownBlockCode value="/usr/bin/g++ main.cpp -O2 -o main -w -lm --static -std=c++17 -DONLINE_JUDGE -fmax-errors=5"></MarkdownBlockCode>
                    运行
                    <MarkdownBlockCode value="./main"></MarkdownBlockCode>
                    <h5>GNU G++ C++17</h5>
                    编译
                    <MarkdownBlockCode value="/usr/bin/g++ main.cpp -O2 -o main -w -lm --static -std=c++17 -DONLINE_JUDGE -fmax-errors=5"></MarkdownBlockCode>
                    运行
                    <MarkdownBlockCode value="./main"></MarkdownBlockCode>
                </div>
            </QuestAndAnswer>
        </div>
    </div>
</template>

<script>
import QuestAndAnswer from "@/kit/QuestAndAnswer";
import SolutionStatus from "@/kit/SolutionStatus";

export default {
    name: "FAQ",
    components: {SolutionStatus, QuestAndAnswer},
    methods: {
        openUrl(url) {
            window.open(url, '_blank')
        }
    }
}
</script>

<style scoped>
.faq-desk {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}

.solution-box {
    display: grid;
    grid-template-columns: 150px 150px 1fr;
    column-gap: 10px;
    place-items: center;
    border-top: 1px solid var(--border-color-level-1);
    text-align: center;
}
</style>