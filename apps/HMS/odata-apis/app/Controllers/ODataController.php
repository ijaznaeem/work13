<?php

namespace App\Controllers;

use CodeIgniter\Model;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class ODataController extends ResourceController
{
    protected $format = 'json';
    protected $model;

    public function __construct()
    {
        helper('inflector');
        $this->secretKey = getenv('JWT_SECRET');
    }

    /**
     * Main entry point for the OData controller.
     * @param string $tableName The name of the table to query.
     * @return \CodeIgniter\HTTP\Response
     */
    public function index($tableName = null)
    {
        // if (!$this->verifyToken()) {
        //     return $this->failUnauthorized('Unauthorized');
        // }
        
        if (!$tableName || !$this->isTableExists($tableName)) {
            return $this->failNotFound("Table '$tableName' does not exist.");
        }

        $this->model = $this->getModelForTable($tableName);
        if (!$this->model) {
            return $this->fail("Unable to create model for table '$tableName'.");
        }

        $request = service('request');
        $skip = $request->getGet('$skip') ?? 0;
        $top = $request->getGet('$top') ?? 10;
        $filter = $request->getGet('$filter');
        $orderby = $request->getGet('$orderby');
        $expand = $request->getGet('$expand');

        $query = $this->model;

        if ($filter) {
            $filterConditions = $this->parseFilter($filter);
            $query = $query->where($filterConditions);
        }

        if ($orderby) {
            $orderArray = explode(' ', $orderby);
            $query = $query->orderBy($orderArray[0], $orderArray[1] ?? 'asc');
        }

        if ($expand) {
            $query = $this->applyExpand($query, $expand);
        }

        $data = $query->findAll($top, $skip);
        $totalRecords = $this->model->countAllResults();

        return $this->respond([
            'd' => $data,
            'totalCount' => $totalRecords,
        ]);
    }

    public function create($tableName = null)
    {
        if (!$this->verifyToken()) {
            return $this->failUnauthorized('Unauthorized');
        }

        if (!$tableName || !$this->isTableExists($tableName)) {
            return $this->failNotFound("Table '$tableName' does not exist.");
        }

        $this->model = $this->getModelForTable($tableName);

        $data =   $this->request->getJSON(true);

        // Validate the data format and ensure it's an associative array
        if (!is_array($data) || array_values($data) === $data) {
            return $this->fail("Invalid data format. Expecting an associative array.", 400);
        }


        if (empty($data)) {
            return $this->fail("No data provided for insertion.", 400);
        }
    
       

        // Attempt to insert data
        if ($this->model->insert($data)) {
            return $this->respondCreated([
                'message' => "Record created successfully.",
                'id' => $this->model->insertID()
            ]);
        } else {
            return $this->fail("Failed to insert data.", 500);
        }
    }

    public function update($tableName = null, $id = null)
    {
        if (!$this->verifyToken()) {
            return $this->failUnauthorized('Unauthorized');
        }

        if (!$tableName || !$this->isTableExists($tableName)) {
            return $this->failNotFound("Table '$tableName' does not exist.");
        }

        $this->model = $this->getModelForTable($tableName);

        $data = $this->request->getJSON(true);
        if ($this->model->update($id, $data)) {
            return $this->respondUpdated(['message' => 'Data updated successfully']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($tableName = null, $id = null)
    {
        if (!$this->verifyToken()) {
            return $this->failUnauthorized('Unauthorized');
        }

        if (!$tableName || !$this->isTableExists($tableName)) {
            return $this->failNotFound("Table '$tableName' does not exist.");
        }

        $this->model = $this->getModelForTable($tableName);

        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Data deleted successfully']);
        }

        return $this->failNotFound('Record not found');
    }

    private function applyExpand($query, $expand)
    {
        // Fetch the main data first
        $mainData = $query->findAll();
    
        // Process each relation specified in $expand
        $relations = explode(',', $expand);
        foreach ($relations as $relation) {
            $relatedTable = trim($relation);
            $relatedTablePlural = plural($relatedTable);
    
            if ($this->isTableExists($relatedTablePlural)) {
                $foreignKey = $relatedTable . '_id';
    
                // Get IDs from the main data to fetch related records
                $mainIds = array_column($mainData, 'id'); // Assuming primary key is 'id'
    
                // Fetch related data for these IDs
                $relatedModel = $this->getModelForTable($relatedTablePlural);
                $relatedData = $relatedModel->whereIn($foreignKey, $mainIds)->findAll();
    
                // Group related data by foreign key for easy mapping
                $groupedRelatedData = [];
                foreach ($relatedData as $relatedRow) {
                    $groupedRelatedData[$relatedRow->$foreignKey][] = $relatedRow;
                }
    
                // Attach related data to each main data record
                foreach ($mainData as &$record) {
                    $record->$relatedTablePlural = $groupedRelatedData[$record->id] ?? []; // Add related data under pluralized table name as key
                }
            }
        }
    
        return $mainData;
    }
    

    private function isTableExists($tableName)
    {
        $db = \Config\Database::connect();
        return $db->tableExists($tableName);
    }

    private function getModelForTable($tableName)
    {
        return new class($tableName) extends Model
        {
            public function __construct($tableName)
            {
                parent::__construct();
                $this->setTable($tableName);
                $this->primaryKey = $this->getPrimaryKey($tableName);
                $this->allowedFields = $this->getFieldNames($tableName);
            }

            private function getFieldNames($tableName)
            {
                $db = \Config\Database::connect();
                return array_column($db->getFieldData($tableName), 'name');
            }

            private function getPrimaryKey($tableName)
            {
                $db = \Config\Database::connect();
                $indexData = $db->getIndexData($tableName);
                foreach ($indexData as $index) {
                    if ($index->type === 'PRIMARY') {
                        return $index->fields[0];
                    }
                }
                return null;
            }
        };
    }

    private function parseFilter($filter)
    {
        if (preg_match("/(\w+)\s(between)\s(\d+)\s(and)\s(\d+)/i", $filter, $matches)) {
            $field = $matches[1];
            $start = $matches[3];
            $end = $matches[5];
            return ["$field >=" => $start, "$field <=" => $end];
        } elseif (preg_match("/(\w+)\s(eq|ne|gt|lt|like)\s'([^']+)'/", $filter, $matches)) {
            $field = $matches[1];
            $operator = $matches[2];
            $value = $matches[3];
            switch ($operator) {
                case 'eq': return [$field => $value];
                case 'ne': return ["$field !=" => $value];
                case 'gt': return ["$field >" => $value];
                case 'lt': return ["$field <" => $value];
                case 'like': return ["$field LIKE" => $value];
            }
        }
        return [];
    }

    private function verifyToken()
{
    $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
    $token = null;

    if ($authHeader) {
        list(, $token) = explode(' ', $authHeader);
    }

    if (!$token) {
        return false;
    }

    try {
        $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
        return true;
    } catch (\Firebase\JWT\ExpiredException $e) {
        // Token has expired
        return false;
    } catch (\Exception $e) {
        // Other token validation errors
        return false;
    }
}

}
