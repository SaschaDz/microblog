displayPosts();
function displayPosts(){
  $.ajax({
    type: "POST",
    url: "admin/api/",
    data: {
      mode: "postLoad"
    },
    dataType: "json",
    success: function(output){
      $(".posts").html("");
      for (i=0;i<output.posts.length;i++) {
          var post = output.posts[i];
          if (post.updated != null) {
            postDate = post.updated
          } else {
            postDate = post.created
          }
          $(".posts").append(`
            <article class="post">
              <div class="post_head">
                <h1>${he.decode(post.title)}</h1>
              </div>   
              <div class="post-content">${he.decode(post.content)}</div>
              <p class="post-date">${postDate}</p>
            </article>`)
      }
    }
  });
}