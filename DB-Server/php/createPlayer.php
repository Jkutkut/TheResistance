<?php
    include("setup.php");
    $myPDO->query('INSERT INTO Players ("p-id") VALUES("' . $_POST['name'] . '")');
    echo 'INSERT INTO Players ("p-id") VALUES("' . $_POST['name'] . '")';
?>