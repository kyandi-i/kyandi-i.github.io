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
        const pageName = this.querySelector('span').textContent || this.innerText;
        document.getElementById('currentPage').textContent = pageName;
        
        // 显示对应页面
        const targetPage = this.getAttribute('data-page');
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(targetPage).classList.add('active');
        
        // 返回笔记列表（如果从笔记详情返回）
        if (targetPage === 'notes') {
            document.getElementById('noteListContainer').style.display = 'block';
            document.getElementById('noteViewer').style.display = 'none';
        }
    });
});

// 博客文章跳转功能
document.querySelectorAll('.blog-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const url = this.getAttribute('data-url');
        if (!url || url === '') {
            e.preventDefault();
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

// 添加加载状态元素
const loadingIndicator = `
    <div class="loading-container" style="text-align:center; padding: 40px;">
        <div class="spinner"></div>
        <p style="margin-top: 15px; color: var(--text-muted);">正在加载内容...</p>
    </div>
`;

// 创建加载样式
const style = document.createElement('style');
style.textContent = `
    .spinner {
        border: 4px solid rgba(211, 47, 47, 0.1);
        border-left-color: var(--accent-red);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .error-container {
        text-align: center;
        padding: 40px;
        color: #ff5252;
        border: 1px solid #ffcccc;
        border-radius: 8px;
        background-color: #fff9f9;
    }
`;
document.head.appendChild(style);

// 监听笔记列表项的点击
document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        
        if (!url || url === '') {
            alert('这篇笔记还在撰写中哦 ( >﹏< )');
            return;
        }

        // 1. 切换界面：显示加载状态
        noteListContainer.style.display = 'none';
        noteViewer.style.display = 'block';
        markdownContent.innerHTML = loadingIndicator;

        // 2. 设置一个20秒的超时
        const timeoutId = setTimeout(() => {
            markdownContent.innerHTML = `
                <div class="error-container">
                    <h3>⏰ 加载超时</h3>
                    <p>笔记内容加载时间过长，请检查网络连接或稍后重试</p>
                </div>
            `;
        }, 20000);

        // 3. 使用 Fetch API 获取 Markdown 文件
        fetch(url, { mode: 'cors' })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error('网络请求失败');
                return response.text();
            })
            .then(text => {
                // 4. 使用 marked.js 和 DOMPurify 将 Markdown 转换为安全的 HTML
                const cleanHTML = DOMPurify.sanitize(marked.parse(text));
                markdownContent.innerHTML = cleanHTML;
                
                // 5. 滚动到顶部
                window.scrollTo({
                    top: document.querySelector('.top-bar').offsetHeight,
                    behavior: 'smooth'
                });
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.error('笔记加载失败:', error);
                markdownContent.innerHTML = `
                    <div class="error-container">
                        <h3>😵 哎呀，加载失败了</h3>
                        <p>可能是跨域问题，或者链接不是 Raw 格式。</p>
                        <p><strong>错误信息:</strong> ${error.message}</p>
                        <p style="margin-top: 15px; font-size: 0.9rem; color: var(--text-muted);">
                            提示: GitHub RAW 链接通常以 "https://raw.githubusercontent.com/..." 开头
                        </p>
                    </div>
                `;
            });
    });
});

// 返回按钮逻辑
backButton.addEventListener('click', function() {
    noteViewer.style.display = 'none';
    noteListContainer.style.display = 'block';
    // 平滑滚动回顶部
    window.scrollTo({
        top: document.querySelector('.top-bar').offsetHeight,
        behavior: 'smooth'
    });
});

// 添加页面加载完成效果
window.addEventListener('load', function() {
    document.body.style.opacity = 0;
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 100);
});