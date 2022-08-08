async function upvoteHandler (event) {
    event.preventDefault();
    
    const urlArray = window.location.toString().split('/');
    // getting the url and taking the post id from it
    const postId = urlArray[urlArray.length - 1];
    
    // creating a new vote in the database requires the post id and user id
    // we'll get the user id on the backend, as it's included in the session data
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({ post_id: postId }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.upvote-btn').addEventListener('click', upvoteHandler);