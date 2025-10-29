<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->group('v1', ['namespace' => 'App\Controllers'], function ($routes) {
    // Route for the index (Read) method
    $routes->get('(:segment)', 'ODataController::index/$1');

    // Route for the create (POST) method
    $routes->post('(:segment)', 'ODataController::create/$1');

    // Route for the update (PUT/PATCH) method
    $routes->put('(:segment)/(:num)', 'ODataController::update/$1/$2');
    $routes->patch('(:segment)/(:num)', 'ODataController::update/$1/$2');

    // Route for the delete (DELETE) method
    $routes->delete('(:segment)/(:num)', 'ODataController::delete/$1/$2');
});
$routes->group('auth', function($routes) {
    $routes->post('register', 'AuthController::register');
    $routes->post('login', 'AuthController::login');
    $routes->get('verify-token', 'AuthController::verifyToken');
});