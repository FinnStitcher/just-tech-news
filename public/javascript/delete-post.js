async function deleteHandler(event) {
    event.preventDefault();

    // getting the post id
    const urlArray = document.location.toString().split('/');
    const post_id = urlArray[urlArray.length - 1];

    const response = await fetch('/api/posts/' + post_id, {
        method: 'DELETE'
    });

    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteHandler);