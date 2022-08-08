async function editHandler(event) {
    event.preventDefault();

    const urlArray = document.location.toString().split('/');
    const post_id = urlArray[urlArray.length - 1];
    const title = document.querySelector('input[name="post-title"]').value.trim();

    const response = await fetch('/api/posts/' + post_id, {
        method: 'PUT', 
        body: JSON.stringify({title}),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.edit-post-form').addEventListener('submit', editHandler);