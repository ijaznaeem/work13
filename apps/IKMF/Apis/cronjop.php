<?php
// Database configuration
$host     = 'localhost';
$dbname   = 'online_ikmf';
$username = 'root';
$password = '123';

// Initialize debug log statement
$debugLogStmt = null;

try {
    // 1) Connect to database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    // 2) Prepare debug log statement
    $debugLogStmt = $pdo->prepare("
        INSERT INTO debug_log (Step, VoucherID, DonarID, Message)
        VALUES (:step, :voucherID, :donarID, :message)
    ");

    // 3) Prepare notification log statement
    $logStmt = $pdo->prepare("
        INSERT INTO notification_log
          (Date, Task, DonarID, Message, Status)
        VALUES
          (:date, :task, :donarID, :message, :status)
    ");

    // 4) Log job execution
    $logStmt->execute([
        ':date'    => date('Y-m-d H:i:s'),
        ':task'    => 'Job Executed',
        ':donarID' => 0,
        ':message' => 'Job Executed',
        ':status'  => 'Success',
    ]);

    // 5) Select donors due for reminder
    $sql = "
        SELECT
          d.DonarID,
          d.DonarName,
          d.DonationType,
          d.DonationAmount,
          d.Balance,
          d.NextDueDate,
          d.WhatsAppNo,
          d.SendWhatsApp,
          d.Type
        FROM donars d
        LEFT JOIN vouchers v
          ON v.DonarID = d.DonarID
         AND v.Debit   > 0
         AND v.Date    >= DATE_SUB(CURDATE(), INTERVAL d.DonationType MONTH)
        WHERE v.VoucherID IS NULL
          AND (
               d.NextDueDate IS NULL
            OR d.NextDueDate <= CURDATE()
          )
    ";
    $stmt = $pdo->query($sql);
    $donors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Prepare update statements
    $updBalanceStmt = $pdo->prepare("
        UPDATE donars
        SET Balance = Balance + :amount
        WHERE DonarID = :donarID
    ");

    $updNextDueStmt = $pdo->prepare("
        UPDATE donars
        SET NextDueDate = DATE_ADD(
                COALESCE(NextDueDate, AddDate),
                INTERVAL DonationType MONTH
            )
        WHERE DonarID = :donarID
    ");

    foreach ($donors as $d) {
        $status = '';
        $task   = "Send Donation Status Message";

        if ($d['SendWhatsApp'] == 1) {
            $mobile = (strpos($d['WhatsAppNo'], '+') === 0)
                ? ltrim($d['WhatsAppNo'], '+')
                : '92' . ltrim($d['WhatsAppNo'], '0');

            $message = "Dear {$d['DonarName']},\n\n"
                . "This is a reminder from Imtiaz Kausar Memorial Foundation regarding your " . ($d['Type'] == 1? "donation": "membership fee"). " of PKR "
                . number_format($d['DonationAmount'], 0, '.', ',')
                . ".\n\nThank you for your continued support at *Imtiaz Kausar Memorial Foundation!*";

            // Send via cURL
            $ch = curl_init('http://myapi.pk/api/send.php');
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => [
                    'api_key'  => '923000645113-a4d7bf5a-da2c-44f9-a520-b63cc546d95a',
                    'mobile'   => $mobile,
                    'message'  => $message,
                    'priority' => '10',
                    'type'     => 0,
                ],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_TIMEOUT        => 30,
            ]);
            $resp = curl_exec($ch);
            $err  = curl_error($ch);
            curl_close($ch);

            if ($err) {
                $status = "Failed: cURL error: $err";
                $debugLogStmt->execute([
                    ':step'      => 'cURL Execution',
                    ':voucherID' => null,
                    ':donarID'   => $d['DonarID'],
                    ':message'   => $err,
                ]);
            } else {
                $data = json_decode($resp, true);
                $ok = isset($data['results'][0]['status']) && $data['results'][0]['status'] === 'OK';
                $status = $ok ? 'Success' : ('Failed: ' . ($data['results'][0]['status'] ?? 'Unknown'));
            }

            $logStmt->execute([
                ':date'    => date('Y-m-d H:i:s'),
                ':task'    => $task,
                ':donarID' => $d['DonarID'],
                ':message' => $message,
                ':status'  => $status,
            ]);
        }

        // Update balance if success
        if (strpos($status, 'Success') === 0) {
            $updBalanceStmt->execute([
                ':amount'  => $d['DonationAmount'],
                ':donarID' => $d['DonarID'],
            ]);
        }

        // Update NextDueDate always
        $updNextDueStmt->execute([
            ':donarID' => $d['DonarID'],
        ]);
    }

} catch (PDOException $e) {
    if ($debugLogStmt) {
        $debugLogStmt->execute([
            ':step'      => 'DB Error',
            ':voucherID' => null,
            ':donarID'   => null,
            ':message'   => $e->getMessage(),
        ]);
    }
    echo "Database error: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    if ($debugLogStmt) {
        $debugLogStmt->execute([
            ':step'      => 'General Error',
            ':voucherID' => null,
            ':donarID'   => null,
            ':message'   => $e->getMessage(),
        ]);
    }
    echo "General error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
