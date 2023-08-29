<?php
$name = $_REQUEST['name'];
$uid = $_REQUEST['uid'];
//pārbauda identifikātoru datubāzē
function sendData($uid, $name){
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

    
    $insertQuery = $pdo->prepare(
      "INSERT INTO user (name, uid) VALUES (:name, :uid)"
    );
    $insertQuery->bindParam(":name", $name);
    $insertQuery->bindParam(":uid", $uid);
    $insertQuery->execute();
    //pārbauda vai identifikators ir datubāsē, ja ir atsūta true, ja nav tad false
  } catch (PDOException $e) {
    $noError = false;
    $errorMsg = $e->getMessage();
  }

  if($noError){
    return 'veiksmīgi reģistrēts';
  }else{
    return $errorMsg;
  }
}

$response = [
  'response' => sendData($uid, $name)
];

echo json_encode($response);
?>