<?php
  class MyDB extends SQLite3
  {
    function __construct()
    {
      $this->open('db/mycr0blog.db');
    }
  }

  $conn = new MyDB();

  if ($_POST["mode"] == "postCreate") {
    $created = date("Y-m-d H:i:s", time());
    $title = $_POST["title"];
    $content = $_POST["content"];
    $sql = "INSERT INTO tinymce (created, title, content) VALUES ('$created','$title', '$content')";
    $conn->query($sql);
  } elseif ($_POST["mode"] == "postUpdate") {
    $updated = date("Y-m-d H:i:s", time());
    $id = $_POST["id"];
    $title = $_POST["title"];
    $content = $_POST["content"];
    $sql = "UPDATE tinymce SET title = '$title', content = '$content', updated = '$updated' WHERE id = '$id'";
    $conn->query($sql);
  } elseif ($_POST["mode"] == "postTrash") {
    $id = $_POST["id"];
    $title = $_POST["title"];
    $sql = "DELETE FROM tinymce WHERE id = $id";
    $conn->query($sql);
  } elseif ($_POST["mode"] == "postLoad") {
    $query = $conn->query("SELECT * FROM tinymce ORDER BY id DESC");
    $posts = array();
    while($row = $query->fetchArray()) {
      $posts[] = $row;
    }
    echo json_encode(array('posts' => $posts));
  }
?>