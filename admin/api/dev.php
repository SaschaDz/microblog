<?php
  class MyDB extends SQLite3
  {
    function __construct()
    {
      $this->open('db/mycr0blog.db');
    }
  }

  $conn = new MyDB();

  $query = $conn->query("SELECT * FROM tinymce ORDER BY id DESC");
  $posts = array();
  while($row = $query->fetchArray()) {
    $posts[] = $row;
  }
  echo json_encode(array('posts' => $posts));
?>