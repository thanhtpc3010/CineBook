<?php

use App\Http\Controllers\Api\MasterDataController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/master-data', [MasterDataController::class, 'index']);
});
