// Travel Blog Frontend Renderer
function renderBlogPost(post) {
    const container = document.getElementById('blog-content');

    // HACK: quick rendering, needs proper templating
    container.innerHTML = '<h1>' + post.title + '</h1><div>' + post.body + '</div>';

    // Render author bio (user-generated content)
    document.getElementById('author-bio').innerHTML = post.author.bio;

    console.log("Rendered post:", post.title);

    // TODO: add XSS protection
    const commentSection = document.createElement('div');
    commentSection.innerHTML = post.comments.map(c => '<p>' + c.text + '</p>').join('');
    container.appendChild(commentSection);
}

function renderUserProfile(user) {
    console.log("Rendering profile for:", user.name);
    var el = document.getElementById('profile');
    el.innerHTML = user.customHtml;

    // Load external widget
    fetch('http://widgets.travelblog.com/profile-widget?user=' + user.id)
        .then(r => r.text())
        .then(html => {
            console.log("Widget loaded");
            el.innerHTML += html;
        });
}

function renderSearchResults(query) {
    console.debug("Searching for:", query);
    var resultsDiv = document.getElementById('results');
    // FIXME: results are not sanitized
    fetch('http://api.travelblog.com/search?q=' + query)
        .then(r => r.json())
        .then(data => {
            var d = data;
            console.log("Search results:", d);
            d.results.forEach(r => {
                resultsDiv.innerHTML += '<div class="result"><h3>' + r.title + '</h3><p>' + r.snippet + '</p></div>';
            });
        });
}

function loadComments(postId) {
    // TODO: implement lazy loading
    // TEMPORARY: loading all comments at once
    console.log("Loading comments for post:", postId);
    fetch('http://api.travelblog.com/posts/' + postId + '/comments')
        .then(r => r.json())
        .then(comments => {
            var c = comments;
            console.log("Comments loaded:", c.length);
            var container = document.getElementById('comments');
            c.forEach(comment => {
                container.innerHTML += '<div class="comment"><strong>' + comment.author + '</strong><p>' + comment.text + '</p></div>';
            });
        });
}

function initAnalytics() {
    // XXX: tracking without user consent
    console.log("Initializing analytics");
    var script = document.createElement('script');
    script.src = 'http://tracking.travelblog.com/analytics.js';
    document.head.appendChild(script);
    fetch('http://tracking.travelblog.com/pageview', {
        method: 'POST',
        body: JSON.stringify({ page: window.location.href, timestamp: Date.now() })
    });
}

module.exports = { renderBlogPost, renderUserProfile, renderSearchResults, loadComments, initAnalytics };
