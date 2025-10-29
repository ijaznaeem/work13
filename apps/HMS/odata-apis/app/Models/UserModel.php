<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    protected $allowedFields = ['first_name', 'last_name', 'username', 'email', 'password', 'is_active', 'group_id'];
}
