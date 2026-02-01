// ============= 页面切换功能 =============
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 更新导航栏状态
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        // 更新顶部当前页面显示
        const pageName = this.querySelector('span').textContent || this.innerText;
        document.getElementById('currentPage').textContent = pageName;
        
        // 显示对应页面
        const targetPage = this.getAttribute('data-page');
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(targetPage).classList.add('active');
        
        if (targetPage === 'notes') {
            document.getElementById('noteListContainer').style.display = 'block';
            document.getElementById('noteViewer').style.display = 'none';
        }
    });
});

// ============= 笔记模块 (Markdown 加载) =============
const noteListContainer = document.getElementById('noteListContainer');
const noteViewer = document.getElementById('noteViewer');
const markdownContent = document.getElementById('markdownContent');
const backButton = document.getElementById('backToNotes');

document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if (!url) { alert('这篇笔记还在撰写中哦 ( >﹏< )'); return; }

        noteListContainer.style.display = 'none';
        noteViewer.style.display = 'block';
        markdownContent.innerHTML = '<p>正在加载内容...</p>';

        fetch(url)
            .then(response => { if (!response.ok) throw new Error('加载失败'); return response.text(); })
            .then(text => {
                const cleanHTML = DOMPurify.sanitize(marked.parse(text));
                markdownContent.innerHTML = cleanHTML;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(err => { markdownContent.innerHTML = `<p>加载出错: ${err.message}</p>`; });
    });
});

backButton.addEventListener('click', () => {
    noteViewer.style.display = 'none';
    noteListContainer.style.display = 'block';
});

// ============= 侧边栏折叠核心逻辑 =============
const sidebarToggle = document.getElementById('sidebarToggle');

// 点击事件
sidebarToggle.addEventListener('click', function() {
    document.body.classList.toggle('sidebar-collapsed');
    
    // 保存状态到本地
    const isCollapsed = document.body.classList.contains('sidebar-collapsed');
    localStorage.setItem('sidebarStatus', isCollapsed ? 'closed' : 'open');
});

// 页面加载时恢复状态
window.addEventListener('DOMContentLoaded', () => {
    const savedStatus = localStorage.getItem('sidebarStatus');
    // 只有当明确记录为 'closed' 时才折叠，默认开启
    if (savedStatus === 'closed') {
        document.body.classList.add('sidebar-collapsed');
    }
});

// 初始加载淡入效果
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});