<?php
$uid = $_REQUEST['uid'];
//pārbauda identifikātoru datubāzē
function checkUID($uid){
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

    
    $checkQuery = $pdo->prepare(
      "SELECT COUNT(*) FROM user WHERE uid = :uid"
    );
    $checkQuery->bindParam(":uid", $uid);
    $checkQuery->execute();
    //pārbauda vai identifikators ir datubāsē, ja ir atsūta true, ja nav tad false
    if($checkQuery->fetchColumn() == 0){
      return true;
    }else{
      return false;
    }
  } catch (PDOException $e) {
    $noError = false;
    $errorMsg = $e->getMessage();
  }

  if($noError){
    return true;
  }else{
    return $errorMsg;
  }
}

$response = [
  'response' => checkUID($uid)
];

echo json_encode($response);
?>