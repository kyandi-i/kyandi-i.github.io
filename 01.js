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
        const activePage = document.getElementById(targetPage);
        activePage.classList.add('active');
        
        // 页面切换时平滑滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (targetPage === 'notes') {
            document.getElementById('noteListContainer').style.display = 'block';
            document.getElementById('noteViewer').style.display = 'none';
        }
    });
});

// ============= 鼠标点击特效 (二次元装饰) =============
document.addEventListener('click', function(e) {
    const heart = document.createElement('div');
    heart.innerHTML = '💗';
    heart.style.position = 'fixed';
    heart.style.left = (e.clientX - 10) + 'px';
    heart.style.top = (e.clientY - 10) + 'px';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.transition = 'all 0.8s ease-out';
    
    document.body.appendChild(heart);
    
    // 动画效果：向上飘散并消失
    setTimeout(() => {
        heart.style.transform = `translateY(-50px) scale(1.5) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        heart.remove();
    }, 800);
});

// ============= 笔记模块 (Markdown 加载) =============
const noteListContainer = document.getElementById('noteListContainer');
const noteViewer = document.getElementById('noteViewer');
const markdownContent = document.getElementById('markdownContent');
const backButton = document.getElementById('backToNotes');

// 生成骨架屏HTML
const skeletonHTML = `
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
`;

document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if (!url) { 
            alert('这篇笔记还在撰写中哦 ( >﹏< )'); 
            return; 
        }

        noteListContainer.style.display = 'none';
        noteViewer.style.display = 'block';
        markdownContent.innerHTML = skeletonHTML; // 显示骨架屏

        fetch(url)
            .then(response => { 
                if (!response.ok) throw new Error('加载失败，请检查网络或链接'); 
                return response.text(); 
            })
            .then(text => {
                const cleanHTML = DOMPurify.sanitize(marked.parse(text));
                // 延迟渲染（模拟加载，增强体验）
                setTimeout(() => {
                    markdownContent.innerHTML = cleanHTML;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 300);
            })
            .catch(err => { 
                markdownContent.innerHTML = `<p style="color: var(--accent-red); text-align: center; padding: 2rem;">加载出错: ${err.message}</p>`; 
            });
    });
});

backButton.addEventListener('click', () => {
    noteViewer.style.display = 'none';
    noteListContainer.style.display = 'block';
    // 返回时平滑滚动到笔记列表顶部
    noteListContainer.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============= 侧边栏折叠核心逻辑 =============
const sidebarToggle = document.getElementById('sidebarToggle');

// 点击事件（添加防重复点击）
let isToggling = false;
sidebarToggle.addEventListener('click', function() {
    if (isToggling) return;
    isToggling = true;

    document.body.classList.toggle('sidebar-collapsed');
    const isCollapsed = document.body.classList.contains('sidebar-collapsed');

    // 更新 aria-expanded 属性
    this.setAttribute('aria-expanded', !isCollapsed);

    // 保存状态到本地
    localStorage.setItem('sidebarStatus', isCollapsed ? 'closed' : 'open');

    // 解锁点击
    setTimeout(() => {
        isToggling = false;
    }, 350);
});

// 页面加载时恢复状态
window.addEventListener('DOMContentLoaded', () => {
    const savedStatus = localStorage.getItem('sidebarStatus');
    if (savedStatus === 'closed') {
        document.body.classList.add('sidebar-collapsed');
    }
    
    // 监听滚动，给顶栏添加滚动状态
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });
});

// 初始加载淡入效果
window.addEventListener('load', () => {
    // 延迟淡入，增强体验
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 200);
    
    // 初始化页面动画
    document.querySelectorAll('.page').forEach(page => {
        if (page.classList.contains('active')) {
            page.style.opacity = 1;
            page.style.transform = 'translateY(0)';
        }
    });
});



// 链接新窗口打开优化
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        window.open(link.href, '_blank', 'noopener,noreferrer');
    });
});