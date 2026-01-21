// 页面切换功能
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 更新导航栏状态
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        this.classList.add('active');
        
        // 更新顶部当前页面显示
        const pageName = this.textContent || this.innerText;
        document.getElementById('currentPage').textContent = pageName;
        
        // 显示对应页面
        const targetPage = this.getAttribute('data-page');
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(targetPage).classList.add('active');
    });
});

// 博客文章跳转功能 (保持原样)
document.querySelectorAll('.blog-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('data-url');
        if(url && url !== '') {
            window.open(url, '_blank');
        } else {
            alert('此链接尚未配置，请联系管理员添加跳转地址');
        }
    });
});

// ==========================================
// 核心升级：笔记模块 (原地加载 Markdown)
// ==========================================

const noteListContainer = document.getElementById('noteListContainer');
const noteViewer = document.getElementById('noteViewer');
const markdownContent = document.getElementById('markdownContent');
const backButton = document.getElementById('backToNotes');

// 监听笔记列表项的点击
document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        
        if (!url || url === '') {
            alert('这篇笔记还在撰写中哦 ( >﹏< )');
            return;
        }

        // 1. 切换界面：显示加载动画
        noteListContainer.style.display = 'none';
        noteViewer.style.display = 'block';
        markdownContent.innerHTML = `
            <div style="text-align:center; padding: 40px; color: #a18cd1;">
                <h3>✨ 正在获取笔记内容...</h3>
                <p>Loading...</p>
            </div>
        `;

        // 2. 使用 Fetch API 获取 Markdown 文件
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('网络请求失败');
                return response.text();
            })
            .then(text => {
                // 3. 使用 marked.js 将 Markdown 转换为 HTML 并渲染
                // 这里的 marked.parse 是我们在 HTML head 中引入的库提供的功能
                markdownContent.innerHTML = marked.parse(text);
            })
            .catch(error => {
                console.error('笔记加载失败:', error);
                markdownContent.innerHTML = `
                    <div style="text-align:center; padding: 40px; color: #ff9a9e;">
                        <h3>😵 哎呀，加载失败了</h3>
                        <p>可能是跨域问题，或者链接不是 Raw 格式。</p>
                        <p>错误信息: ${error.message}</p>
                    </div>
                `;
            });
    });
});

// 返回按钮逻辑
backButton.addEventListener('click', function() {
    noteViewer.style.display = 'none';
    noteListContainer.style.display = 'block';
    // 滚动回顶部
    window.scrollTo(0, 0);
});