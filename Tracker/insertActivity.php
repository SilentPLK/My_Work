<?php
$name = $_REQUEST['name'];
$uid = $_REQUEST['uid'];
$la = $_REQUEST['la'];
$lo = $_REQUEST['lo'];
$status = $_REQUEST['status'];
$time = $_REQUEST['time'];
//pārbauda identifikātoru datubāzē
$id = null;
if(isset($_REQUEST['id'])){
  $id = $_REQUEST['id'];
}
function sendData($uid, $la, $lo, $status, $time, $id){

  //ievieto datus datubāzē
  $noError = true;
  try{
    $host = '127.0.0.1';
    $db = 'activities';
    $user = 'root';
    $password = '';

    $pdo = new PDO(
      "mysql:host=$host;dbname=$db;charset=utf8mb4",
      $user,
      $password
    );
    
    //ja tiek iedota $id, tad atjaunina tabulas rindas laiku
    if($id != null){
      $updateQuery = $pdo->prepare(
        "UPDATE activity
        SET time_spent = :time
        WHERE id = :id;"
      );
      $updateQuery->bindParam(":time", $time);
      $updateQuery->bindParam(":id", $id);
      $updateQuery->execute();

      $insertedId = $id;
    }else{
      $insertQuery = $pdo->prepare(
        "INSERT INTO activity (user_id, la, lo, status_id, time_spent)
        SELECT user.id, :la, :lo, status.id, :time
        FROM user, status
        WHERE user.uid = :uid
        AND status.status = :status;"
      );
      $insertQuery->bindParam(':uid', $uid);
      $insertQuery->bindParam(':la', $la);
      $insertQuery->bindParam(':lo', $lo);
      $insertQuery->bindParam(':status', $status);
      $insertQuery->bindParam(':time', $time);
      $insertQuery->execute();

      // dabū izveidoto rindu id
      $insertedId = $pdo->lastInsertId();

    }
    
    
  } catch (PDOException $e) {
    $noError = false;
    $errorMsg = $e->getMessage();
  }

  if($noError){
    return $insertedId;
  }else{
    return $errorMsg;
  }
}

$response = [
  'response' => sendData($uid, $la, $lo, $status, $time, $id)
];

echo json_encode($response);
?>