<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Stock Management Library for CodeIgniter 3
 *
 * This library provides comprehensive stock management functionality
 * with dynamic balance calculation and consistency checks
 *
 * @package    Stock_management
 * @author     Your Name
 * @version    1.0
 */
class Stock_management
{

    protected $CI;
    protected $db;

    /**
     * Constructor
     */
    public function __construct($params = [])
    {
        $this->CI = &get_instance();
        $this->db = $this->CI->db;

        // Load database if not already loaded
        if (! isset($this->CI->db)) {
            $this->CI->load->database();
            $this->db = $this->CI->db;
        }

        log_message('info', 'Stock Management Library Initialized');
    }

    /**
     * Update Stock with Dynamic Balance Calculation
     *
     * @param int $action 1 = Add/Create, 2 = Update/Reduce
     * @param string $description Transaction description
     * @param int $productID Product ID
     * @param float $unitPrice Unit price
     * @param float $qtyOut Quantity out (sold/used)
     * @param float $qtyIn Quantity in (purchased/received)
     * @param int $billNo Reference bill/document number
     * @param int $refType Reference type (1=Purchase, 2=Sale, etc.)
     * @param string $invDate Transaction date
     * @param int $storeID Store ID
     * @param int $unitID Unit ID
     * @param int $businessID Business ID
     * @param float $packing Packing quantity
     * @return array Success status and current balance
     */

    /*************************************
      *
      * DON NOT REMOVE TRANSACTION HISTORY
      *
      *************************************/

    public function update_stock($action, $description, $productID, $unitPrice, $qtyOut, $qtyIn, $billNo, $refType, $invDate, $storeID, $unitID, $businessID = 1, $packing = 0)
    {
        try {
            // Start transaction
            $this->db->trans_begin();

            // Validate inputs
            $this->_validate_stock_inputs($productID, $storeID, $businessID, $qtyIn, $qtyOut);

            // Prepare stock account data
            $stockacct = [
                'Date'        => $invDate,
                'Description' => $description,
                'ProductID'   => $productID,
                'StoreID'     => $storeID,
                'Packing'     => $packing,
                'QtyIn'       => $qtyIn,
                'QtyOut'      => $qtyOut,
                'UnitPrice'   => $unitPrice,
                'RefID'       => $billNo,
                'RefType'     => $refType,
                'Balance'     => 0, // Will be calculated
                'BusinessID'  => $businessID,
            ];

            // Insert transaction record
            $this->db->insert('stockaccts', $stockacct);
            $newAcctID = $this->db->insert_id();

            if (! $newAcctID) {
                throw new Exception('Failed to insert stock transaction');
            }

            // Calculate running balance
            $currentBalance = $this->_calculate_running_balance($productID, $storeID, $businessID, $newAcctID);

            // Update balance for new record
            $this->db->where('AcctID', $newAcctID);
            $this->db->update('stockaccts', ['Balance' => $currentBalance]);

            // Check for negative stock if it's a reduction
            // if ($action == 2 && $currentBalance < 0) {
            //     throw new Exception("Insufficient stock. Current balance: $currentBalance");
            // }

            // Update stock table
            $this->_update_stock_table($productID,
                $storeID,
                $businessID,
                $unitPrice,
                $unitID);

            // Commit transaction
            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                throw new Exception('Stock update transaction failed');
            }

            $this->db->trans_commit();

            return [
                'success'         => true,
                'current_balance' => $currentBalance,
                'acct_id'         => $newAcctID,
                'message'         => 'Stock updated successfully',
            ];

        } catch (Exception $e) {
            $this->db->trans_rollback();
            log_message('error', 'Stock Management Error: ' . $e->getMessage());

            return [
                'success'         => false,
                'error'           => $e->getMessage(),
                'current_balance' => 0,
                'acct_id'         => 0,
            ];
        }
    }

    /**
     * Get current stock balance from transactions
     *
     * @param int $productID
     * @param int $storeID
     * @param int $businessID
     * @return float Current stock balance
     */
    public function get_current_stock($productID, $storeID, $businessID = 1)
    {
        $sql = "
            SELECT COALESCE(SUM(QtyIn - QtyOut), 0) as CurrentStock
            FROM stockaccts
            WHERE ProductID = ? AND StoreID = ? AND BusinessID = ?
        ";

        $query  = $this->db->query($sql, [$productID, $storeID, $businessID]);
        $result = $query->row_array();

        return (float) $result['CurrentStock'];
    }

    /**
     * Get product transaction history with balance verification
     *
     * @param int $productID
     * @param int $storeID
     * @param int $businessID
     * @param string $dateFrom
     * @param string $dateTo
     * @param int $limit
     * @return array Transaction history
     */
    public function get_transaction_history($productID, $storeID, $businessID = 1, $dateFrom = null, $dateTo = null)
    {
      $sql = "CALL GetProductTransactionHistory(?, ?, ?, ?, ?)";
      $params = [$productID, $storeID, $businessID, $dateFrom, $dateTo];
      $query = $this->db->query($sql, $params);
      $result = $query->result_array();
      return $result;
    }

    /**
     * Validate and fix stock inconsistencies
     *
     * @param int $productID Optional - specific product
     * @param int $storeID Optional - specific store
     * @param int $businessID
     * @return array Results of validation/fixing
     */
    public function validate_and_fix_stock($productID = null, $storeID = null, $businessID = 1)
    {
        $whereClause = "WHERE BusinessID = $businessID";
        $params      = [];

        if ($productID) {
            $whereClause .= " AND ProductID = ?";
            $params[] = $productID;
        }

        if ($storeID) {
            $whereClause .= " AND StoreID = ?";
            $params[] = $storeID;
        }

        // Get all unique product/store combinations
        $sql = "
            SELECT DISTINCT ProductID, StoreID, BusinessID
            FROM stockaccts
            $whereClause
        ";

        $query        = $this->db->query($sql, $params);
        $combinations = $query->result_array();
        $results      = [];

        foreach ($combinations as $combo) {
            try {
                $this->db->trans_begin();

                // Fix balance calculations
                $fixed = $this->_fix_account_balances($combo['ProductID'], $combo['StoreID'], $combo['BusinessID']);

                // Update stock table
                $this->_update_stock_table($combo['ProductID'], $combo['StoreID'], $combo['BusinessID'], 0, 1);

                $this->db->trans_commit();

                $results[] = [
                    'ProductID'    => $combo['ProductID'],
                    'StoreID'      => $combo['StoreID'],
                    'BusinessID'   => $combo['BusinessID'],
                    'Status'       => 'Fixed',
                    'RecordsFixed' => $fixed,
                ];

            } catch (Exception $e) {
                $this->db->trans_rollback();
                $results[] = [
                    'ProductID'  => $combo['ProductID'],
                    'StoreID'    => $combo['StoreID'],
                    'BusinessID' => $combo['BusinessID'],
                    'Status'     => 'Error',
                    'Error'      => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Get stock summary for multiple products
     *
     * @param array $productIDs
     * @param int $storeID
     * @param int $businessID
     * @return array Stock summary
     */
    public function get_stock_summary($productIDs = [], $storeID = null, $businessID = 1)
    {
        $whereClause = "WHERE BusinessID = $businessID";
        $params      = [];

        if (! empty($productIDs)) {
            $placeholders = implode(',', array_fill(0, count($productIDs), '?'));
            $whereClause .= " AND ProductID IN ($placeholders)";
            $params = array_merge($params, $productIDs);
        }

        if ($storeID) {
            $whereClause .= " AND StoreID = ?";
            $params[] = $storeID;
        }

        $sql = "
            SELECT
                ProductID,
                StoreID,
                SUM(QtyIn) as TotalIn,
                SUM(QtyOut) as TotalOut,
                SUM(QtyIn - QtyOut) as CurrentStock,
                COUNT(*) as TransactionCount,
                MAX(Date) as LastTransaction
            FROM stockaccts
            $whereClause
            GROUP BY ProductID, StoreID
            ORDER BY ProductID, StoreID
        ";

        $query = $this->db->query($sql, $params);
        return $query->result_array();
    }

    /**
     * Get low stock alerts
     *
     * @param float $threshold Minimum stock threshold
     * @param int $storeID
     * @param int $businessID
     * @return array Products with low stock
     */
    public function get_low_stock_alerts($threshold = 10, $storeID = null, $businessID = 1)
    {
        $whereClause = "WHERE BusinessID = $businessID";
        $params      = [];

        if ($storeID) {
            $whereClause .= " AND StoreID = ?";
            $params[] = $storeID;
        }

        $sql = "
            SELECT
                ProductID,
                StoreID,
                SUM(QtyIn - QtyOut) as CurrentStock
            FROM stockaccts
            $whereClause
            GROUP BY ProductID, StoreID
            HAVING CurrentStock <= ?
            ORDER BY CurrentStock ASC
        ";

        $params[] = $threshold;
        $query    = $this->db->query($sql, $params);
        return $query->result_array();
    }

    /**
     * PRIVATE METHODS
     */

    /**
     * Validate stock inputs
     */
    private function _validate_stock_inputs($productID, $storeID, $businessID, $qtyIn, $qtyOut)
    {
        if (empty($productID) || empty($storeID) || empty($businessID)) {
            throw new Exception('ProductID, StoreID, and BusinessID are required');
        }

        if ($qtyIn < 0 || $qtyOut < 0) {
            throw new Exception('Quantities cannot be negative');
        }

        if ($qtyIn == 0 && $qtyOut == 0) {
            throw new Exception('Either QtyIn or QtyOut must be greater than 0');
        }
    }

    /**
     * Calculate running balance for specific transaction
     */
    private function _calculate_running_balance($productID, $storeID, $businessID, $acctID)
    {
        $sql = "
            SELECT COALESCE(SUM(QtyIn - QtyOut), 0) as RunningBalance
            FROM stockaccts
            WHERE ProductID = ?
              AND StoreID = ?
              AND BusinessID = ?
              AND AcctID <= ?
        ";

        $query  = $this->db->query($sql, [$productID, $storeID, $businessID, $acctID]);
        $result = $query->row_array();

        return (float) $result['RunningBalance'];
    }

    /**
     * Update stock table with calculated values
     */
    private function _update_stock_table($productID, $storeID, $businessID, $price, $unitID)
    {
        // Get current stock from transactions
        $currentStock = $this->get_current_stock($productID, $storeID, $businessID);

        // Check if stock record exists
        $this->db->where('ProductID', $productID);
        $this->db->where('StoreID', $storeID);
        $this->db->where('BusinessID', $businessID);
        $existing = $this->db->get('stock');


        if ($existing->num_rows() > 0) {
            // Update existing record
            $updateData = ['Stock' => $currentStock];

            if ($price > 0) {
                $updateData['PPrice'] = $price;
            }

            $existingRow = $existing->row_array();
            $this->db->where('StockID', $existingRow['StockID']);
            $this->db->update('stock', $updateData);

        } else {
            // Create new record
            $stockData = [
                'ProductID'  => $productID,
                'StoreID'    => $storeID,
                'BusinessID' => $businessID,
                'Stock'      => $currentStock,
                'PPrice'     => $price,
                'UnitID'     => $unitID,
            ];

            $this->db->insert('stock', $stockData);
        }
    }

    /**
     * Fix account balances for specific product/store
     */
    private function _fix_account_balances($productID, $storeID, $businessID)
    {
        $sql = "
            SELECT AcctID, QtyIn, QtyOut
            FROM stockaccts
            WHERE ProductID = ? AND StoreID = ? AND BusinessID = ?
            ORDER BY AcctID
        ";

        $query        = $this->db->query($sql, [$productID, $storeID, $businessID]);
        $transactions = $query->result_array();

        $runningBalance = 0;
        $fixedCount     = 0;

        foreach ($transactions as $transaction) {
            $runningBalance += $transaction['QtyIn'] - $transaction['QtyOut'];

            $this->db->where('AcctID', $transaction['AcctID']);
            $this->db->update('stockaccts', ['Balance' => $runningBalance]);
            $fixedCount++;
        }

        return $fixedCount;
    }

    /**
     * Get balance before specific date
     */
    private function _get_balance_before_date($productID, $storeID, $businessID, $date)
    {
        $sql = "
            SELECT Balance
            FROM stockaccts
            WHERE ProductID = ?
              AND StoreID = ?
              AND BusinessID = ?
              AND Date < ?
            ORDER BY AcctID DESC
            LIMIT 1
        ";

        $query = $this->db->query($sql, [$productID, $storeID, $businessID, $date]);

        if ($query->num_rows() > 0) {
            $result = $query->row_array();
            return (float) $result['Balance'];
        }

        return 0;
    }
}

/* End of file Stock_management.php */
/* Location: ./application/libraries/Stock_management.php */
