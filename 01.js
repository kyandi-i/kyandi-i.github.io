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

// 博客文章跳转功能
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

// 笔记跳转功能
document.querySelectorAll('.note-link').forEach(link => {
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