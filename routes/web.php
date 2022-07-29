<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware("guest")->group(function (){
    Route::get("/", [LoginController::class, "index"])->name("login");
    Route::post("/login", [LoginController::class, "login"])->name("login.trigger");
});

Route::middleware("auth")->group(function (){
    // messages
    Route::prefix("/chat")->name("chat.")->group(function (){
        Route::get("/", [ChatController::class, "index"])->name("index");
        Route::get("/conversations/{room_id}", [ChatController::class, "loadingMessage"])->name("conversations");
        Route::get("/histories", [ChatController::class, "getHistoryMessage"])->name("histories");
        Route::post("/save", [ChatController::class, "saveChat"])->name("save");
    });

    // checkRoom
    Route::get("room/check/{user_id}", [RoomController::class, 'checkRoom'])->name("check.room");

    // logout
    Route::get("/logout", [LoginController::class, "logout"])->name("logout");
});

