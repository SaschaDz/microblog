tinymce.init({
  selector: '#textarea',
  branding: false,
  resize: 'both',
  width: '90vw',
  height: '80vh',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
  'bold italic backcolor | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'removeformat | help',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});

var updating = false;
var postId;

function clear() {
  updating = false;
  postId = "";
  postTitle = "";
  postContent = "";
  $("#post-title").val("");
  tinymce.get("textarea").setContent("");
}

$("#new").click(function(){
  $(".editor").show();
});

$("#close_btn").click(function(){
  $(".editor").hide();
  clear();
});

editPosts();
function editPosts(){
  $.ajax({
    type: "POST",
    url: "api/",
    data: {
      mode: "postLoad"
    },
    dataType: "json",
    success: function(output){
      $(".posts_edit").html("");
      for (i=0;i<output.posts.length;i++) {
        var post = output.posts[i];
        if (post.updated == null) {
          var updated = "never";
        } else {
          var updated = post.updated;
        }
        $(".posts_edit").append(`
          <article class="post_edit">
            <div class="edit_head">
              <h2>${post.title}</h2>
            </div>
            <div class="edit_dates">
              <p class="edit-date">created: ${post.created}</p>
              <p class="edit-date">updated: ${updated}</p>
            </div>
            <div class="edit_buttons">
              <button onclick="trash(${post.id},'${post.title}')">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"></path><path fill-rule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clip-rule="evenodd"></path></svg>
              </button>
              <button onclick="edit(${i})">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="2" d="M14,4 L20,10 L14,4 Z M22.2942268,5.29422684 C22.6840146,5.68401459 22.6812861,6.3187139 22.2864907,6.71350932 L9,20 L2,22 L4,15 L17.2864907,1.71350932 C17.680551,1.319449 18.3127724,1.31277239 18.7057732,1.70577316 L22.2942268,5.29422684 Z M3,19 L5,21 M7,17 L15,9"></path></svg>
              </button>
            </div>
          </article`);
      }
    }
  });
}

function edit(index){
  $.ajax({
    type: "POST",
    url: "api/",
    data: {
      mode: "postLoad"
    },
    dataType: "json",
    success: function(output){
      var post = output.posts[index];
      postId = post.id;
      updating = true;
      $(".editor").show();
      $("#post-title").val(post.title);
      tinymce.get("textarea").setContent(he.decode(post.content));
      editPosts();
    }
  });
}

function trash(id,title){
  if (confirm("Delete "+title+"?")) {
    $.ajax({
      url: "api/",
      type: "POST",
      data: {
        mode: "postTrash",
        id: id,
        title: title
      },
      complete: function(){
        editPosts();
      }
    });
  }
  
}

$("#save").click(function(){
  if ($("#post-title").val() != "") {
    if (updating === false) {
      create();
    } else if (updating === true) {
      update();
    } 
    $(".editor").hide();
  } else {
    alert("please add a title");
  }
});

function create(){
  var title = $("#post-title").val();
  var editorContent = tinymce.get("textarea").getContent();
  if (title != "" && editorContent != ""){
    $.ajax({
      url: "api/",
      type: "POST",
      data: {
        mode: "postCreate",
        title: title,
        content: he.encode(editorContent)
      },
      complete: function(){
        editPosts();
        clear();
      }
    });
  }
}

function update(){
  var title = $("#post-title").val();
  var editorContent = tinymce.get("textarea").getContent();
  if (title != "" && editorContent != ""){
    $.ajax({
      url: "api/",
      type: "POST",
      data: {
        mode: "postUpdate",
        id: postId,
        title: title,
        content: he.encode(editorContent)
      },
      complete: function(){
        editPosts();
        clear();
      }
    });
  }
}