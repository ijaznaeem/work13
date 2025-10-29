<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends ResourceController
{
    private $secretKey;

    public function __construct()
    {
        $this->secretKey = getenv('JWT_SECRET');
    }

    // User Registration
    public function register()
    {
        $rules = [
            'username' => 'required|min_length[3]|max_length[20]|is_unique[users.username]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), ResponseInterface::HTTP_BAD_REQUEST);
        }

        $userModel = new UserModel();
        $data      = [
            'username' => $this->request->getVar('username'),
            'full_name' => $this->request->getVar('full_name'),
            'is_active' => $this->request->getVar('is_active'),
            'group_id' => $this->request->getVar('group_id'),
            'email'    => $this->request->getVar('email'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_BCRYPT),
        ];

        $userModel->save($data);
        return $this->respondCreated(['message' => 'User registered successfully']);
    }

    // User Login
    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), ResponseInterface::HTTP_BAD_REQUEST);
        }

        $userModel = new UserModel();
        $user      = $userModel->where('email', $this->request->getVar('email'))->first();

        // print_r($user);
        if (!$user || !password_verify(
            $this->request->getVar('password'),
            $user['password']
        )) {
            return $this->fail('Invalid login credentials', ResponseInterface::HTTP_UNAUTHORIZED);
        }

        // Create JWT Token
        $payload = [
            'iss' => 'CodeIgniter4App',
            'sub' => 'uid-' . $user['user_id'],
            'iat' => time(),
            'exp' => time() + 5 * 3600, // Token expiration time (1 hour)
        ];

        $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
        unset($user['password']);

        return $this->respond([
            'token' => $jwt,
            'user'  => $user,
            'status' =>'success'
        ], ResponseInterface::HTTP_OK);
    }

    // Decode and verify JWT token
    public function verifyToken()
    {
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
        $token      = null;

        if ($authHeader) {
            list(, $token) = explode(' ', $authHeader);
        }

        if (!$token) {
            return $this->failUnauthorized('Token not provided');
        }

        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            return $this->respond(['data' => (array) $decoded], ResponseInterface::HTTP_OK);
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid or expired token');
        }
    }
}
